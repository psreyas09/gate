const path = require('node:path');
const fs = require('node:fs');
const express = require('express');
const { app, ensureDbInitialized } = require('./app');

const PORT = process.env.PORT || 3001;

// Serve static client assets if built
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(clientDist, 'index.html'));
    }
    next();
  });
}

ensureDbInitialized()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`GATE CSE 2027 Study Platform API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database on startup:', err);
    process.exit(1);
  });

module.exports = app;
