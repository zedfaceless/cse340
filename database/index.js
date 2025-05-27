const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // enable SSL always (adjust if needed)
  },
});

// Optional: wrap query to add logging in development only
const query = async (text, params) => {
  try {
    const res = await pool.query(text, params);
    if (process.env.NODE_ENV === "development") {
      console.log("executed query", { text });
    }
    return res;
  } catch (error) {
    console.error("error in query", { text });
    throw error;
  }
};

module.exports = {
  query,
};
