import express from "express";
import { pool } from "../db.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email FROM users ORDER BY id ASC LIMIT 100;");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.post("/", async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query("INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email;", [name, email]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

export default router;
