// models/accountModel.js
const pool = require("../database/connection");

// Fetch account by email
async function getAccountByEmail(email) {
  try {
    const sql = "SELECT * FROM accounts WHERE account_email = $1";
    const values = [email];
    const result = await pool.query(sql, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error in getAccountByEmail:", error);
    throw error;
  }
}

// Fetch account by ID (used when decoding JWT)
async function getAccountById(id) {
  try {
    const sql = "SELECT * FROM accounts WHERE account_id = $1";
    const result = await pool.query(sql, [id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error in getAccountById:", error);
    throw error;
  }
}

// Register new account
async function registerAccount(account_firstname, account_lastname, account_email, hashedPassword) {
  try {
    const sql = `
      INSERT INTO accounts 
      (account_firstname, account_lastname, account_email, account_password)
      VALUES ($1, $2, $3, $4)
      RETURNING *`;
    const values = [account_firstname, account_lastname, account_email, hashedPassword];
    const result = await pool.query(sql, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error in registerAccount:", error);
    throw error;
  }
}

module.exports = {
  getAccountByEmail,
  getAccountById, // ✅ newly added
  registerAccount,
};
