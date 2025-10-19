#!/usr/bin/env node

/**
 * Test Script per tutti i modelli AI
 * Testa ogni provider e modello disponibile per vedere quali funzionano
 */

const API_URL = 'http://localhost:3001';

const PROVIDERS = {
  openai: {
    name: 'OpenAI',
    models: ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo']
  },
  anthropic: {
    name: 'Anthropic',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-5-sonnet', 'claude-3-opus', 'claude-haiku-4.5']
  },
  xai: {
    name: 'X-AI',
    models: ['grok-beta', 'grok-2']
  },
  google: {
    name: 'Google',
    models: ['gemini-2.0-flash-exp', 'gemini-pro', 'gemini-1.5-pro']
  },
  meta: {
    name: 'Meta',
    models: ['llama-3.1-70b-instruct', 'llama-3.3-70b-instruct', 'llama-3.1-405b']
  }
};

const TEST_MESSAGE = "Hello! Respond with just 'OK' to confirm you're working.";

// Colori per il terminale
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

async function testModel(provider, model) {
  const endpoint = `${API_URL}/api/${provider}`;
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: 'test-script',
        message: TEST_MESSAGE,
        model: model
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return {
        success: true,
        model: data.model,
        response: data.content?.substring(0, 100) || 'OK',
      };
    } else {
      return {
        success: false,
        error: data.error || data.details?.error?.message || 'Unknown error',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

async function runTests() {
  console.log(`\n${colors.cyan}╔════════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║          🤖 Testing All AI Models on OpenRouter              ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════════════════════════╝${colors.reset}\n`);

  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    details: [],
  };

  for (const [providerId, provider] of Object.entries(PROVIDERS)) {
    console.log(`\n${colors.blue}═══ ${provider.name} (${provider.models.length} models) ═══${colors.reset}\n`);

    for (const model of provider.models) {
      results.total++;
      process.stdout.write(`  Testing ${colors.gray}${model}${colors.reset}... `);

      const result = await testModel(providerId, model);

      if (result.success) {
        results.passed++;
        console.log(`${colors.green}✓ PASS${colors.reset} ${colors.gray}(${result.model})${colors.reset}`);
        results.details.push({
          provider: providerId,
          model: model,
          status: 'PASS',
          actualModel: result.model,
        });
      } else {
        results.failed++;
        console.log(`${colors.red}✗ FAIL${colors.reset}`);
        console.log(`    ${colors.red}Error: ${result.error}${colors.reset}`);
        results.details.push({
          provider: providerId,
          model: model,
          status: 'FAIL',
          error: result.error,
        });
      }

      // Piccolo delay per non sovraccaricare l'API
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Riepilogo finale
  console.log(`\n${colors.cyan}╔════════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║                      📊 Test Summary                          ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════════════════════════╝${colors.reset}\n`);

  console.log(`  Total Models Tested: ${colors.blue}${results.total}${colors.reset}`);
  console.log(`  ${colors.green}Passed: ${results.passed}${colors.reset}`);
  console.log(`  ${colors.red}Failed: ${results.failed}${colors.reset}`);
  console.log(`  Success Rate: ${colors.yellow}${((results.passed / results.total) * 100).toFixed(1)}%${colors.reset}\n`);

  // Lista modelli funzionanti
  const working = results.details.filter(r => r.status === 'PASS');
  if (working.length > 0) {
    console.log(`${colors.green}✓ Working Models (${working.length}):${colors.reset}`);
    working.forEach(r => {
      console.log(`  ${colors.gray}•${colors.reset} ${r.provider}/${r.model} ${colors.gray}→ ${r.actualModel}${colors.reset}`);
    });
    console.log();
  }

  // Lista modelli con errori
  const failing = results.details.filter(r => r.status === 'FAIL');
  if (failing.length > 0) {
    console.log(`${colors.red}✗ Failed Models (${failing.length}):${colors.reset}`);
    failing.forEach(r => {
      console.log(`  ${colors.gray}•${colors.reset} ${r.provider}/${r.model}`);
      console.log(`    ${colors.red}${r.error}${colors.reset}`);
    });
    console.log();
  }

  // Salva risultati in un file JSON
  const fs = require('fs');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `test-results-${timestamp}.json`;
  
  fs.writeFileSync(filename, JSON.stringify(results, null, 2), 'utf8');
  console.log(`${colors.gray}Results saved to: ${filename}${colors.reset}\n`);
}

// Verifica che il server sia attivo
async function checkServer() {
  try {
    const response = await fetch(`${API_URL}/api/models`);
    if (!response.ok) throw new Error('Server not responding');
    return true;
  } catch (error) {
    console.error(`${colors.red}❌ Error: Backend server is not running on ${API_URL}${colors.reset}`);
    console.error(`${colors.yellow}Please start the server first:${colors.reset}`);
    console.error(`${colors.gray}  cd server && npm run dev${colors.reset}\n`);
    return false;
  }
}

// Main
(async () => {
  console.log(`${colors.gray}Checking server connection...${colors.reset}`);
  
  const serverOk = await checkServer();
  if (!serverOk) {
    process.exit(1);
  }

  console.log(`${colors.green}✓ Server is running${colors.reset}`);
  
  await runTests();
  
  console.log(`${colors.cyan}Done!${colors.reset}\n`);
})();
