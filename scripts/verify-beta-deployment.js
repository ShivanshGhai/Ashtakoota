#!/usr/bin/env node

const { URL } = require('url');

function usage() {
  return [
    'Usage:',
    '  node scripts/verify-beta-deployment.js --frontend <url> --backend <url>',
    '',
    'Optional:',
    '  --skip-network   Only validate URL inputs and documented env names',
  ].join('\n');
}

function parseArgs(argv) {
  const args = { skipNetwork: false };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--frontend') args.frontend = argv[++i];
    else if (arg === '--backend') args.backend = argv[++i];
    else if (arg === '--skip-network') args.skipNetwork = true;
    else if (arg === '--help' || arg === '-h') args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

function normalizeUrl(raw, name) {
  if (!raw) throw new Error(`Missing --${name} URL`);
  const parsed = new URL(raw);
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error(`${name} URL must start with http:// or https://`);
  }
  parsed.pathname = parsed.pathname.replace(/\/+$/, '');
  parsed.search = '';
  parsed.hash = '';
  return parsed.toString().replace(/\/$/, '');
}

async function fetchJson(url) {
  const res = await fetch(url);
  const text = await res.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(`${url} did not return JSON: ${text.slice(0, 120)}`);
  }
  if (!res.ok) throw new Error(`${url} returned HTTP ${res.status}`);
  return body;
}

async function fetchText(url) {
  const res = await fetch(url);
  const text = await res.text();
  if (!res.ok) throw new Error(`${url} returned HTTP ${res.status}`);
  return text;
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log(usage());
    return;
  }

  const frontend = normalizeUrl(args.frontend, 'frontend');
  const backend = normalizeUrl(args.backend, 'backend');

  const checks = [
    `Frontend URL: ${frontend}`,
    `Backend URL: ${backend}`,
    'Required backend Railway vars: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, JWT_EXPIRES_IN, FRONTEND_URL, RESEND_API_KEY, RESEND_FROM, UPLOAD_DIR',
    'Required frontend Railway var: FRONTEND_API_URL',
  ];

  if (!args.skipNetwork) {
    const [frontendHealth, backendHealth, configJs] = await Promise.all([
      fetchJson(`${frontend}/health`),
      fetchJson(`${backend}/health`),
      fetchText(`${frontend}/config.js`),
    ]);

    if (frontendHealth?.status !== 'ok') {
      throw new Error(`Frontend health status was not ok: ${JSON.stringify(frontendHealth)}`);
    }
    if (backendHealth?.status !== 'ok') {
      throw new Error(`Backend health status was not ok: ${JSON.stringify(backendHealth)}`);
    }
    if (!configJs.includes('window.__ASHTAKOOTA_CONFIG__')) {
      throw new Error('Frontend /config.js did not expose window.__ASHTAKOOTA_CONFIG__');
    }
    if (!configJs.includes(backend)) {
      throw new Error(`Frontend /config.js does not appear to point at backend URL: ${backend}`);
    }

    checks.push('Frontend /health returned ok');
    checks.push('Backend /health returned ok');
    checks.push('Frontend /config.js points to backend');
  }

  console.log('Beta deployment checks passed:');
  for (const check of checks) console.log(`- ${check}`);
}

main().catch((error) => {
  console.error(`Beta deployment check failed: ${error.message}`);
  console.error('');
  console.error(usage());
  process.exit(1);
});
