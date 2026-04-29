const assert = require('assert');

for (const key of ['RESEND_API_KEY', 'RESEND_FROM', 'SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'EMAIL_FROM']) {
  delete process.env[key];
}

const mailer = require('../utils/mailer');

const status = mailer.mailConfigStatus();
assert.strictEqual(status.configured, false, 'mailer should report missing config');
assert.deepStrictEqual(
  status.missing.sort(),
  ['EMAIL_FROM', 'SMTP_HOST', 'SMTP_PASS', 'SMTP_USER'].sort(),
  'mailer should list missing verification email variables'
);
assert(status.providerHint.includes('RESEND_API_KEY'), 'mailer should include Resend setup guidance');

(async () => {
  try {
    await mailer.sendVerificationEmail('test@example.com', 'Test', 'https://example.com/verify');
    throw new Error('sendVerificationEmail should fail without SMTP config');
  } catch (error) {
    assert(error.message.includes('Email delivery is not configured'), 'missing email config error should be explicit');
    assert(error.message.includes('RESEND_API_KEY'), 'missing email config error should include Resend setup guidance');
    console.log('mailer.test.js passed');
  }
})();
