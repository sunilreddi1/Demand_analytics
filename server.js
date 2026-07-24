// Simple HTTP server for the app
const express = require('express');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = 8000;

// Middleware
app.use(compression());

// Serve static files from dist folder
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`Keep PM2 running: pm2 status`);
});
