const db = require('../config/db');
const { isAdminEmail } = require('../utils/adminAccess');

module.exports = async function requireAdmin(req, res, next) {
  try {
    const [[user]] = await db.query(
      'SELECT Email FROM USER WHERE UserID = ?',
      [req.user.userId]
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!isAdminEmail(user.Email)) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    req.isAdmin = true;
    return next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
