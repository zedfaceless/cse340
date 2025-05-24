// models/inventory-model.js
const db = require("../database");

async function getClassifications() {
  const sql = `SELECT * FROM public.classification ORDER BY classification_name`;
  const result = await db.query(sql);
  return result.rows;
}

// New function to get a vehicle by its inventory id
async function getVehicleById(inv_id) {
  const sql = `SELECT * FROM public.inventory WHERE inv_id = $1`;
  const values = [inv_id];
  const result = await db.query(sql, values);
  return result.rows[0]; // returns the single vehicle or undefined if not found
}

module.exports = { 
  getClassifications,
  getVehicleById,
};
