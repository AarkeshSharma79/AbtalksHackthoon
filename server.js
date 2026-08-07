import app from './app.js';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3001;

// Serve built static assets in production if dist directory exists
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  ABTalks AI Cohort - Technical Interview Agent Server`);
  console.log(`  Running on http://localhost:${PORT}`);
  console.log(`  Endpoint: POST http://localhost:${PORT}/api/interview`);
  console.log(`=======================================================`);
});
