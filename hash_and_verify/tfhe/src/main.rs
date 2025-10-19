use anyhow::{anyhow, Context, Result};
use dotenv::dotenv;
use serde::Deserialize;
use std::{
    env, fs,
    io::{self, Write},
};
use tfhe::{ConfigBuilder, generate_keys, set_server_key, FheUint16};
use tfhe::prelude::*;

// ---------- JSON structures ----------
#[derive(Deserialize)]
struct ChatEntry {
    role: String,
    content: String,
}

#[derive(Deserialize)]
struct InputData {
    chats: Vec<ChatEntry>,
}

#[tokio::main]
async fn main() -> Result<()> {
    dotenv().ok();

    // 0) Testo in input
    let user_text = read_input_text()?;

    // 1) Leggi JSON
    let data = fs::read_to_string("data/file.json")
        .context("Impossibile leggere data/file.json")?;
    let parsed: InputData = serde_json::from_str(&data)
        .context("JSON non valido in data/file.json")?;
    if parsed.chats.is_empty() {
        return Err(anyhow!("Nessuna chat in data/file.json"));
    }

    // 2) Embedding input
    let inp_emb = get_embedding(&user_text).await
        .context("Errore durante l'embedding del testo di input")?;

    // 3) Embedding DB
    let mut db_embs = Vec::with_capacity(parsed.chats.len());
    for ch in &parsed.chats {
        let e = get_embedding(&ch.content).await
            .with_context(|| format!("Embedding fallito per messaggio: {}", ch.content))?;
        db_embs.push(e);
    }

    // 4) Preprocessing robusto (ABTT: mean-centering + remove top PC + L2)
    //    Usiamo TUTTI gli embedding (input + db) per stimare media e 1ª PC.
    let mut all = Vec::with_capacity(1 + db_embs.len());
    all.push(inp_emb.clone());
    all.extend(db_embs.clone());
    let all_proc = preprocess_all(all)?;
    let proc_inp = &all_proc[0];
    let proc_db = &all_proc[1..];

    // 5) Stima baseline "non correlata" dal DB (mediana delle cosine tra coppie del DB)
    let baseline = estimate_unrelated_baseline(proc_db);
    // Se baseline non stimabile (pochi dati), fallback prudente
    let baseline = baseline.unwrap_or(0.20);

    println!("\n=== Similarità (calibrata) ===");
    println!("Baseline stimata (non correlati): cos ≈ {:.3}", baseline);

    for (i, (ch, emb)) in parsed.chats.iter().zip(proc_db.iter()).enumerate() {
        let cos = cosine(proc_inp, emb)?;
        // Mappa cos ∈ [baseline..1] → percent ∈ [10..100]
        let pct = map_cosine_to_percent(cos, baseline, 10.0, 100.0);
        println!("Chat #{:02} [{}] -> {:.2}%", i, ch.role, pct);
    }

    // 6) Dimostrazione TFHE (quantizza + encrypt/decrypt)
    let config = ConfigBuilder::default().build();
    let (client_key, server_key) = generate_keys(config);
    set_server_key(server_key);

    let q_inp: Vec<u16> = inp_emb.iter().map(|&x| quantize_f32_to_u16(x)).collect();
    let enc_inp: Vec<FheUint16> = q_inp.iter().map(|&u| FheUint16::encrypt(u, &client_key)).collect();
    let dec_sample: Vec<u16> = enc_inp.iter().take(8).map(|c| c.decrypt(&client_key)).collect();

    println!("\nTFHE: embedding input quantizzato (prime 8) [u16]: {:?}", &q_inp[..q_inp.len().min(8)]);
    println!("TFHE: embedding input decriptato (prime 8) [u16]:          {:?}", dec_sample);

    println!("\nPunteggi: diversi ≈10%, identici ≈80–100%.");
    Ok(())
}

// ---------- Helpers I/O ----------
fn read_input_text() -> Result<String> {
    let args = env::args().skip(1).collect::<Vec<_>>();
    if !args.is_empty() {
        return Ok(args.join(" "));
    }
    print!("Inserisci il testo da confrontare: ");
    io::stdout().flush().ok();
    let mut s = String::new();
    io::stdin().read_line(&mut s)?;
    let s = s.trim().to_string();
    if s.is_empty() {
        return Err(anyhow!("Nessun testo fornito"));
    }
    Ok(s)
}

// ---------- Similarità e calibrazione ----------

// Cosine "puro"
fn cosine(a: &[f32], b: &[f32]) -> Result<f32> {
    let n = a.len().min(b.len());
    if n == 0 { return Err(anyhow!("Embedding vuoto")); }
    let (mut dot, mut na, mut nb) = (0.0f32, 0.0f32, 0.0f32);
    for i in 0..n {
        dot += a[i] * b[i];
        na += a[i] * a[i];
        nb += b[i] * b[i];
    }
    if na == 0.0 || nb == 0.0 { return Ok(0.0); }
    Ok(dot / (na.sqrt() * nb.sqrt()))
}

// Stima la baseline "non correlati" come mediana delle cosine tra coppie del DB
fn estimate_unrelated_baseline(vecs: &[Vec<f32>]) -> Option<f32> {
    if vecs.len() < 3 { return None; }
    let mut sims: Vec<f32> = Vec::new();
    for i in 0..vecs.len() {
        for j in (i+1)..vecs.len() {
            if let Ok(c) = cosine(&vecs[i], &vecs[j]) {
                sims.push(c);
            }
        }
    }
    if sims.is_empty() { return None; }
    sims.sort_by(|a,b| a.partial_cmp(b).unwrap());
    Some(median(&sims))
}

fn median(xs: &[f32]) -> f32 {
    let n = xs.len();
    if n % 2 == 1 {
        xs[n/2]
    } else {
        0.5 * (xs[n/2 - 1] + xs[n/2])
    }
}

// Mappa cos in [base..1] → [lo..hi], clamp finale.
fn map_cosine_to_percent(cos: f32, baseline: f32, lo: f32, hi: f32) -> f32 {
    if cos <= baseline {
        return lo; // tutto ciò che è <= baseline viene ancorato ~10%
    }
    let t = (cos - baseline) / (1.0 - baseline + 1e-6);
    let pct = lo + (hi - lo) * t;
    pct.clamp(lo, hi)
}

// ---------- Preprocessing: ABTT (mean-center + remove top PC) + L2 ----------
fn preprocess_all(mut vecs: Vec<Vec<f32>>) -> Result<Vec<Vec<f32>>> {
    // 1) uniforma dimensione (sanity)
    let d = vecs[0].len();
    for v in &vecs {
        if v.len() != d {
            return Err(anyhow!("Dimensioni embedding non coerenti"));
        }
    }

    // 2) mean-centering globale
    let mean = mean_vector(&vecs);
    for v in vecs.iter_mut() {
        for i in 0..d {
            v[i] -= mean[i];
        }
    }

    // 3) stima 1ª componente principale con power iteration
    let pc1 = power_iteration_pc1(&vecs, 15);

    // 4) rimuovi componente principale ("all-but-the-top")
    let mut out = Vec::with_capacity(vecs.len());
    for v in vecs.into_iter() {
        let dot = dot_product(&v, &pc1);
        let mut w = v;
        for i in 0..d {
            w[i] -= dot * pc1[i];
        }
        // 5) L2 normalize
        out.push(l2_normalize(w));
    }
    Ok(out)
}

fn mean_vector(vecs: &[Vec<f32>]) -> Vec<f32> {
    let d = vecs[0].len();
    let mut m = vec![0.0f32; d];
    for v in vecs {
        for i in 0..d { m[i] += v[i]; }
    }
    let n = vecs.len() as f32;
    for i in 0..d { m[i] /= n; }
    m
}

fn dot_product(a: &[f32], b: &[f32]) -> f32 {
    let n = a.len().min(b.len());
    let mut s = 0.0f32;
    for i in 0..n { s += a[i] * b[i]; }
    s
}

fn l2_normalize(mut v: Vec<f32>) -> Vec<f32> {
    let mut n = 0.0f32;
    for &x in &v { n += x * x; }
    let n = n.sqrt();
    if n > 0.0 {
        for x in &mut v { *x /= n; }
    }
    v
}

// Stima la prima PC con power iteration su covarianza implicita
fn power_iteration_pc1(vecs: &[Vec<f32>], iters: usize) -> Vec<f32> {
    let d = vecs[0].len();
    // init vettore casuale deterministico (qui: tutti 1)
    let mut v = vec![1.0f32; d];
    v = l2_normalize(v);

    for _ in 0..iters {
        // Applica C * v (C ≈ (1/n) * Σ x x^T) senza costruire C
        let mut cv = vec![0.0f32; d];
        for x in vecs {
            let dot = dot_product(x, &v);
            for i in 0..d {
                cv[i] += dot * x[i];
            }
        }
        // normalizza
        v = l2_normalize(cv);
    }
    v
}

// ---------- Quantizzazione ----------
fn quantize_f32_to_u16(x: f32) -> u16 {
    // Clip in [-1,1] per robustezza
    let xc = x.max(-1.0).min(1.0);
    let y = ((xc + 1.0) / 2.0) * 65535.0;
    y.round().clamp(0.0, 65535.0) as u16
}

#[allow(dead_code)]
fn dequantize_u16_to_f32(u: u16) -> f32 {
    ((u as f32) / 65535.0) * 2.0 - 1.0
}

// ---------- OpenAI Embeddings ----------
async fn get_embedding(text: &str) -> Result<Vec<f32>> {
    #[derive(serde::Serialize)]
    struct RequestBody<'a> { input: &'a str, model: &'a str }
    #[derive(serde::Deserialize)]
    struct Resp { data: Vec<Item> }
    #[derive(serde::Deserialize)]
    struct Item { embedding: Vec<f32> }

    let api_key = env::var("OPENAI_API_KEY")
        .context("OPENAI_API_KEY non impostata")?;

    let client = reqwest::Client::new();
    let res = client
        .post("https://api.openai.com/v1/embeddings")
        .bearer_auth(api_key)
        .json(&RequestBody { input: text, model: "text-embedding-3-small" })
        .send()
        .await?
        .error_for_status()?
        .json::<Resp>()
        .await?;

    let v = res.data.into_iter().next()
        .ok_or_else(|| anyhow!("Risposta embeddings vuota"))?
        .embedding;

    Ok(v)
}
