// vulnerable.js
// Intentional insecure code for CI/security-scan testing ONLY.
// Contains: hardcoded secret, command injection, eval usage, SQL string concatenation.
// test

const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(bodyParser.json());

// --- Hardcoded secret (credential leakage) ---
const API_KEY = "AKIAEXAMPLEHARDCODEDKEY123456"; // <- obvious hardcoded credential

// --- Insecure DB usage (SQL injection via string concat) ---
const db = new sqlite3.Database(':memory:');
db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");
  db.run("INSERT INTO users(username, password) VALUES ('alice', 'pw1')");
});

// Route: vulnerable SQL query built by concatenation
app.get('/user', (req, res) => {
  const username = req.query.username || '';
  // <-- insecure: direct string concatenation into SQL
  const q = "SELECT id, username FROM users WHERE username = '" + username + "'";
  db.all(q, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'db error' });
    }
    res.json({ results: rows });
  });
});

// --- Command injection via unsanitized input ---
app.get('/run', (req, res) => {
  const cmd = req.query.cmd || 'echo no-cmd';
  // <-- insecure: passing user input directly to shell
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).send('command failed');
    }
    res.send(`<pre>${stdout}</pre>`);
  });
});

// --- Dangerous eval on JSON body (remote code execution risk) ---
app.post('/eval', (req, res) => {
  const code = req.body.code || '';
  try {
    // <-- insecure: eval of user-provided content
    const result = eval(code);
    res.json({ result });
  } catch (e) {
    res.status(400).json({ error: 'bad code' });
  }
});

// Small helper that uses the hardcoded API key (simulates leaking a secret)
app.get('/call-external', (req, res) => {
  // Pretend to call an external API with the hardcoded key
  res.json({ called_with: API_KEY.slice(0, 8) + '... (truncated)' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Vulnerable demo server running on port ${PORT}`);
});

