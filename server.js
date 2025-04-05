const stringSimilarity = require('string-similarity');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const app = express();
const port = 3001;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.use(cors());
app.use(bodyParser.json());

app.get('/api/phrase', async (req, res) => {
  const result = await pool.query('SELECT * FROM phrases ORDER BY RANDOM() LIMIT 1');
  res.json(result.rows[0]);
});

const normalizeText = (text) => {
  return text
    .toLowerCase()
    .replace(/[’'"]/g, '')         
    .replace(/[^a-z0-9\s]/gi, '') 
    .replace(/\s+/g, ' ')
    .trim();
};

app.post('/api/verify', (req, res) => {
  const { original, userInput } = req.body;

  const originalClean = normalizeText(original);
  const inputClean = normalizeText(userInput);

  const similarity = stringSimilarity.compareTwoStrings(originalClean, inputClean);

  const isCorrect = similarity >= 0.90;
  
  res.json({ correct: isCorrect });
});

app.listen(port, () => {
  console.log(`Server running ${process.env.CURRENT_DOMAIN}:${port}`);
});