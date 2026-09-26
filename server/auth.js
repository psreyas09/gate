const crypto = require('node:crypto');
const { db } = require('./db');

const JWT_SECRET = process.env.JWT_SECRET || 'gate_cse_2027_secure_hmac_secret_key_9981';

/**
 * Hash password with scrypt
 */
function hashPassword(password, salt = null) {
  if (!salt) {
    salt = crypto.randomBytes(16).toString('hex');
  }
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

/**
 * Verify password against salt and stored hash
 */
function verifyPassword(password, salt, storedHash) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(storedHash, 'hex'));
  } catch {
    return false;
  }
}

/**
 * Create a simple tamper-proof HMAC Bearer token
 */
function createToken(user) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      userId: user.id,
      username: user.username,
      exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days valid
    })
  ).toString('base64url');

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');

  return `${header}.${payload}.${signature}`;
}

/**
 * Verify and decode HMAC Bearer token
 */
function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, payload, signature] = parts;
  const expectedSig = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');

  if (signature !== expectedSig) {
    return null;
  }

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (data.exp && Date.now() > data.exp) {
      return null; // Expired
    }
    return data;
  } catch {
    return null;
  }
}

// In-memory cache for authenticated users to avoid round-trips to DB on every request
const userCache = new Map();
const USER_CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL

function getCachedUser(userId) {
  const entry = userCache.get(userId);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    userCache.delete(userId);
    return null;
  }
  return entry.user;
}

function setCachedUser(user) {
  if (!user || !user.id) return;
  userCache.set(user.id, {
    user,
    expiry: Date.now() + USER_CACHE_TTL_MS,
  });
}

function invalidateUserCache(userId) {
  if (userId) userCache.delete(userId);
}

/**
 * Express middleware that identifies user via Bearer token,
 * or defaults safely to 'guest' (Guest-First principle).
 */
async function authMiddleware(req, res, next) {
  req.userId = 'guest';
  req.user = null;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const tokenData = verifyToken(token);
    if (tokenData && tokenData.userId) {
      // 1. Check in-memory cache first (0ms latency)
      const cached = getCachedUser(tokenData.userId);
      if (cached) {
        req.userId = cached.id;
        req.user = cached;
      } else {
        try {
          const user = await db.prepare('SELECT id, username, email, created_at, last_login_at FROM users WHERE id = ?').get(tokenData.userId);
          if (user) {
            req.userId = user.id;
            req.user = user;
            setCachedUser(user);
          }
        } catch (err) {
          console.error('Error in auth middleware user lookup:', err);
        }
      }
    }
  }

  next();
}

/**
 * Middleware requiring active authentication
 */
function requireAuth(req, res, next) {
  if (!req.user || req.userId === 'guest') {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

module.exports = {
  hashPassword,
  verifyPassword,
  createToken,
  verifyToken,
  authMiddleware,
  requireAuth,
  setCachedUser,
  invalidateUserCache,
};
