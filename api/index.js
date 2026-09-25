const { app } = require('../server/app');

module.exports = (req, res) => {
  // In Vercel, when rewriting /api/(.*) -> /api, x-matched-path contains the original path
  if (req.headers['x-matched-path'] && req.headers['x-matched-path'].startsWith('/api')) {
    req.url = req.headers['x-matched-path'];
  } else if (!req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  return app(req, res);
};
