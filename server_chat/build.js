import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['server_def.js'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'esm',
  outfile: 'dist/server.js',
  minify: true,
  sourcemap: true,
  external: [
    // External dependencies che non vogliamo bundlare
    'express',
    'axios',
    'dotenv',
    'cors',
    'cookie-parser',
    'express-session',
    'js-sha3'
  ],
  banner: {
    js: `// PanAI Express Server - Built on ${new Date().toISOString()}\n`
  }
});

console.log('✅ Build completata! File generato in dist/server.js');
