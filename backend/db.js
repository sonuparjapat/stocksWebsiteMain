import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();
const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // fallback to separate vars if needed
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
});
export { pool };
