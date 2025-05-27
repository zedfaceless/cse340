const pool = require("../database/connection");

// Get a single vehicle by ID
async function getVehicleById(inv_id) {
  try {
    const sql = 'SELECT * FROM inventory WHERE inv_id = $1';
    const values = [inv_id];
    const result = await pool.query(sql, values);

    if (result.rows.length === 0) return null;
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

// Get all classifications ordered by name
async function getClassifications() {
  try {
    const sql = 'SELECT * FROM classification ORDER BY classification_name';
    const result = await pool.query(sql);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

// Get all vehicles by classification ID
async function getVehiclesByClassification(classification_id) {
  try {
    const sql = `
      SELECT inv.*, cls.classification_name 
      FROM inventory inv
      JOIN classification cls ON inv.classification_id = cls.classification_id
      WHERE inv.classification_id = $1
      ORDER BY inv.inv_make
    `;
    const values = [classification_id];
    const result = await pool.query(sql, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getVehicleById,
  getClassifications,
  getVehiclesByClassification, // <-- added here
};
