const pool = require('../database/connection'); // Adjust path if needed

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

module.exports = {
  getVehicleById,
};
