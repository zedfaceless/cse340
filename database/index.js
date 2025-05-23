// database/index.js
const { Pool } = require("pg");
require("dotenv").config();

let pool;

if (process.env.NODE_ENV === "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  // Wrap query to add logging in dev
  const query = async (text, params) => {
    try {
      const res = await pool.query(text, params);
      console.log("executed query", { text });
      return res;
    } catch (error) {
      console.error("error in query", { text });
      throw error;
    }
  };

  module.exports = {
    query,
  };
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  // Export query method directly in production
  module.exports = {
    query: (text, params) => pool.query(text, params),
  };
}
