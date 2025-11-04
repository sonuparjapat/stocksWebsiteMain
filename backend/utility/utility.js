import pool from "../db.js";

// ensureDefaultUser() — called before starting the WebSocket server
export const  ensureDefaultUser=async()=>{
  const result = await pool.query('SELECT * FROM users LIMIT 1');
  if (result.rows.length === 0) {
    const insert = await pool.query(
      'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING id',
      ['DefaultUser', 'default@example.com']
    );
    console.log("✅ Default user created with id:", insert.rows[0].id);
  } else {
    console.log("✅ User table already has data");
  }
}