const DEFAULT_DEMO_ADMIN_EMAIL = 'arjun_demo@example.com';

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function getAdminEmails() {
  const configured = String(process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(normalizeEmail)
    .filter(Boolean);

  if (configured.length) {
    return new Set(configured);
  }

  return new Set([normalizeEmail(process.env.DEMO_ADMIN_EMAIL || DEFAULT_DEMO_ADMIN_EMAIL)]);
}

function isAdminEmail(email) {
  return getAdminEmails().has(normalizeEmail(email));
}

module.exports = {
  DEFAULT_DEMO_ADMIN_EMAIL,
  getAdminEmails,
  isAdminEmail,
  normalizeEmail,
};
