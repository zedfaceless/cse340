require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function test() {
  try {
    console.log('Using connection string:', process.env.DATABASE_URL);
    const res = await pool.query('SELECT NOW()');
    console.log('DB connection success:', res.rows[0]);
    await pool.end();
  } catch (err) {
    console.error('DB connection error:', err);
  }
}

test();
