const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const bodyParser = require('body-parser');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT;

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DB_NAME,
  password: process.env.PASSWORD,
  port: process.env.PORT
});

app.use(cors());
app.use(bodyParser.json());

app.get('/api/phrase', async (req, res) => {
  const result = await pool.query('SELECT * FROM phrases ORDER BY RANDOM() LIMIT 1');
  res.json(result.rows[0]);
});



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});