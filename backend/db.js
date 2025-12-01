// backend/db.js
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'your_database_name',
  password: process.env.DB_PASS || 'your_password',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => console.log('✅ Connected to PostgreSQL'));
pool.on('error', (err) => console.error('❌ PostgreSQL Error:', err));

/**
 * Generic query wrapper
 */
export const query = async (text, params = []) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Executed query', { text, duration, rows: res.rowCount });
  return res;
};

/**
 * create(table, data) - simple INSERT helper that returns inserted row
 * data is an object { col1: val1, col2: val2 }
 */
export const create = async (table, data) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  if (keys.length === 0) throw new Error('No data provided to create()');

  const placeholders = keys.map((_, idx) => `$${idx + 1}`).join(', ');
  const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
  const res = await query(sql, values);
  return res.rows[0];
};

/**
 * getStockBySymbol - returns single stock row by symbol
 * expects stocks table with columns: symbol, current_price, previous_close, volume, last_updated
 */
export const getStockBySymbol = async (symbol) => {
  const res = await query('SELECT * FROM stocks WHERE symbol = $1 LIMIT 1', [symbol]);
  return res.rows[0];
};

/**
 * getNewsArticles - returns latest news articles
 */
export const getNewsArticles = async ({ limit = 5 } = {}) => {
  const res = await query(
    `SELECT id, title, category, content, published_at AS timestamp
     FROM news
     ORDER BY published_at DESC
     LIMIT $1`,
    [limit]
  );
  return res.rows;
};

/**
 * initDB - create minimal tables if they don't exist
 * Extend this as needed for production migrations
 */
export const initDB = async () => {
  try {
    // users
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(150) UNIQUE,
        password_hash TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // messages
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // stocks (for simulator / demo)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS stocks (
        id SERIAL PRIMARY KEY,
        symbol VARCHAR(16) UNIQUE NOT NULL,
        current_price NUMERIC DEFAULT 0,
        previous_close NUMERIC DEFAULT 0,
        volume BIGINT DEFAULT 0,
        last_updated TIMESTAMP
      );
    `);

    // news
    await pool.query(`
      CREATE TABLE IF NOT EXISTS news (
        id SERIAL PRIMARY KEY,
        title TEXT,
        category TEXT,
        content TEXT,
        published_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // forum threads & replies
    await pool.query(`
      CREATE TABLE IF NOT EXISTS forum_threads (
        id SERIAL PRIMARY KEY,
        title TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        reply_count INTEGER DEFAULT 0,
        last_reply_at TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS forum_replies (
        id SERIAL PRIMARY KEY,
        thread_id INTEGER REFERENCES forum_threads(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id),
        content TEXT,
        parent_reply_id INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    // ipos table (for IPO data)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ipos (
        id TEXT PRIMARY KEY,
        name TEXT,
        company_name TEXT,
        issue_type TEXT,
        open_date DATE,
        close_date DATE,
        listing_date DATE,
        price_band TEXT,
        issue_price NUMERIC,
        lot_size INTEGER,
        issue_size BIGINT,
        face_value NUMERIC,
        subscription_retail NUMERIC,
        subscription_qib NUMERIC,
        subscription_nii NUMERIC,
        subscription_total NUMERIC,
        status TEXT,
        registrar_name TEXT,
        lead_managers JSONB,
        description TEXT,
        listing_gains NUMERIC,
        raw JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
    `);

    // index for faster filtering by status
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_ipos_status ON ipos(status);
    `);
    

    console.log('🛠️ Tables checked and ready ✅');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
};

export default pool;
