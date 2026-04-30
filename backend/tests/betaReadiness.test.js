const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

const envExample = read('backend/.env.example');
[
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'FRONTEND_URL',
  'RESEND_API_KEY',
  'RESEND_FROM',
  'UPLOAD_DIR',
].forEach((key) => {
  assert(envExample.includes(`${key}=`), `backend .env.example should document ${key}`);
});

const betaReadiness = read('docs/beta-readiness.md');
[
  'Feature freeze',
  'external feedback form',
  'node scripts/verify-beta-deployment.js',
  'UPLOAD_DIR',
  'FRONTEND_API_URL',
].forEach((text) => {
  assert(betaReadiness.includes(text), `beta-readiness.md should include "${text}"`);
});

const qaChecklist = read('docs/beta-qa-checklist.md');
[
  'Register with required profile details',
  'Create a mutual match',
  'Send the first chat message',
  'Report a user',
  'Redeploy backend',
].forEach((text) => {
  assert(qaChecklist.includes(text), `beta QA checklist should include "${text}"`);
});

const outreach = read('docs/beta-outreach.md');
assert(outreach.includes('LinkedIn Post'), 'beta outreach doc should include LinkedIn copy');
assert(outreach.includes('Feedback form'), 'beta outreach doc should include feedback form placeholder');

const verifyScript = read('scripts/verify-beta-deployment.js');
assert(verifyScript.includes('--frontend'), 'deployment verifier should accept frontend URL');
assert(verifyScript.includes('--backend'), 'deployment verifier should accept backend URL');
assert(verifyScript.includes('/config.js'), 'deployment verifier should check frontend config');

console.log('betaReadiness.test.js passed');
