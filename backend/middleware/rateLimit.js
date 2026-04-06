const buckets = new Map();

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  if (typeof req.headers['cf-connecting-ip'] === 'string' && req.headers['cf-connecting-ip'].trim()) {
    return req.headers['cf-connecting-ip'].trim();
  }
  if (typeof req.headers['x-real-ip'] === 'string' && req.headers['x-real-ip'].trim()) {
    return req.headers['x-real-ip'].trim();
  }
  return req.ip || 'ip-unknown';
}

function requestFingerprint(req) {
  if (req.user?.userId) return `user:${req.user.userId}`;
  const email = String(req.body?.email || '').trim().toLowerCase();
  const username = String(req.body?.username || '').trim().toLowerCase();
  if (email) return `email:${email}`;
  if (username) return `username:${username}`;
  return `ip:${clientIp(req)}`;
}

function keyFor(req, scope) {
  return [
    scope,
    requestFingerprint(req),
  ].join(':');
}

function rateLimit({ windowMs, max, scope, message }) {
  return (req, res, next) => {
    const key = keyFor(req, scope);
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || bucket.expiresAt <= now) {
      buckets.set(key, { count: 1, expiresAt: now + windowMs });
      return next();
    }

    if (bucket.count >= max) {
      return res.status(429).json({ error: message || 'Too many requests' });
    }

    bucket.count += 1;
    return next();
  };
}

module.exports = { rateLimit };
