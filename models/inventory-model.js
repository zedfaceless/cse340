// models/inventory-model.js
const pool = require("../database");

async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

module.exports = { getClassifications };
