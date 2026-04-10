const assert = require('assert');
const {
  DEFAULT_DEMO_ADMIN_EMAIL,
  getAdminEmails,
  isAdminEmail,
} = require('../utils/adminAccess');

function withEnv(name, value, fn) {
  const previous = process.env[name];
  if (value === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }

  try {
    fn();
  } finally {
    if (previous === undefined) {
      delete process.env[name];
    } else {
      process.env[name] = previous;
    }
  }
}

function run() {
  withEnv('ADMIN_EMAILS', '', () => {
    withEnv('DEMO_ADMIN_EMAIL', '', () => {
      const admins = getAdminEmails();
      assert.ok(admins.has(DEFAULT_DEMO_ADMIN_EMAIL), 'default demo admin should exist when no env overrides are set');
      assert.strictEqual(isAdminEmail('arjun_demo@example.com'), true, 'seeded demo admin should resolve as admin by default');
    });
  });

  withEnv('ADMIN_EMAILS', 'grader@example.com,TA@example.com', () => {
    const admins = getAdminEmails();
    assert.deepStrictEqual([...admins].sort(), ['grader@example.com', 'ta@example.com'], 'ADMIN_EMAILS should override the demo default');
    assert.strictEqual(isAdminEmail('TA@example.com'), true, 'configured admin emails should be case-insensitive');
    assert.strictEqual(isAdminEmail(DEFAULT_DEMO_ADMIN_EMAIL), false, 'demo default should not be added when ADMIN_EMAILS is explicitly set');
  });

  console.log('adminAccess.test.js passed');
}

run();
