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

// Add a new classification
async function addClassification(classification_name) {
  try {
    const sql = `
      INSERT INTO classification (classification_name)
      VALUES ($1)
      RETURNING *;
    `;
    const values = [classification_name];
    const result = await pool.query(sql, values);
    return result.rows[0]; // returns the inserted row for confirmation or redirect
  } catch (error) {
    console.error("addClassification error:", error);
    throw error;
  }
}

// Add a new inventory item
async function addInventoryItem(data) {
  try {
    const sql = `
      INSERT INTO inventory 
        (classification_id, inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, inv_image, inv_thumbnail)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING inv_id
    `;

    const values = [
      data.classification_id,
      data.inv_make,
      data.inv_model,
      data.inv_year,
      data.inv_description,
      data.inv_price,
      data.inv_miles,
      data.inv_color,
      data.inv_image,
      data.inv_thumbnail,
    ];

    const result = await pool.query(sql, values);
    return result.rows[0].inv_id;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getVehicleById,
  getClassifications,
  getVehiclesByClassification,
  addClassification,
  addInventoryItem,
};
