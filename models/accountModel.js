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

// Get favorite vehicles by account
async function getFavoritesByAccountId(account_id) {
  try {
    const sql = `
      SELECT inventory_id FROM favorites WHERE account_id = $1
    `;
    const result = await pool.query(sql, [account_id]);
    return result.rows;
  } catch (error) {
    throw new Error("Failed to get favorites");
  }
}

// Register new account
async function registerAccount(account_firstname, account_lastname, account_email, hashedPassword) {
  try {
    const sql = `
      INSERT INTO accounts 
      (account_firstname, account_lastname, account_email, account_password)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
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
      RETURNING *;
    `;
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
      WHERE account_id = $2;
    `;
    const result = await pool.query(sql, [hashedPassword, accountId]);
    return result.rowCount;
  } catch (error) {
    console.error("Error in updatePassword:", error);
    throw error;
  }
}

// Add favorite vehicle
async function addFavoriteVehicle(accountId, invId) {
  try {
    const sql = `
      INSERT INTO favorites (account_id, inv_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
      RETURNING *;
    `;
    const result = await pool.query(sql, [accountId, invId]);
    return result.rowCount > 0;
  } catch (error) {
    console.error("Error in addFavoriteVehicle:", error);
    throw error;
  }
}

// Remove favorite vehicle
async function removeFavoriteVehicle(accountId, invId) {
  try {
    const sql = `
      DELETE FROM favorites
      WHERE account_id = $1 AND inv_id = $2;
    `;
    const result = await pool.query(sql, [accountId, invId]);
    return result.rowCount > 0;
  } catch (error) {
    console.error("Error in removeFavoriteVehicle:", error);
    throw error;
  }
}

// Check if vehicle is already a favorite
async function isFavoriteVehicle(accountId, invId) {
  try {
    const sql = `
      SELECT * FROM favorites
      WHERE account_id = $1 AND inv_id = $2;
    `;
    const result = await pool.query(sql, [accountId, invId]);
    return result.rows.length > 0;
  } catch (error) {
    console.error("Error in isFavoriteVehicle:", error);
    throw error;
  }
}

module.exports = {
  getAccountByEmail,
  getAccountById,
  registerAccount,
  updateAccount,
  updatePassword,
  addFavoriteVehicle,
  removeFavoriteVehicle,
  isFavoriteVehicle,
  getFavoritesByAccountId
};
