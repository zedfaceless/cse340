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

// Fetch account by ID
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

// Update account info (name and email)
async function updateAccount(accountId, firstname, lastname, email) {
  try {
    const sql = `
      UPDATE accounts
      SET account_firstname = $1,
          account_lastname = $2,
          account_email = $3
      WHERE account_id = $4
      RETURNING *`;
    const values = [firstname, lastname, email, accountId];
    const result = await pool.query(sql, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error in updateAccount:", error);
    throw error;
  }
}

// Update account password
async function updatePassword(accountId, hashedPassword) {
  try {
    const sql = `
      UPDATE accounts
      SET account_password = $1
      WHERE account_id = $2`;
    const result = await pool.query(sql, [hashedPassword, accountId]);
    return result.rowCount; // Should return 1 if successful
  } catch (error) {
    console.error("Error in updatePassword:", error);
    throw error;
  }
}

module.exports = {
  getAccountByEmail,
  getAccountById,
  registerAccount,
  updateAccount,     // ✅ added
  updatePassword     // ✅ added
};
