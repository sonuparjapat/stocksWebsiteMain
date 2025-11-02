import { pool } from './database';

export interface DatabaseResult<T = any> {
  rows: T[];
  rowCount: number;
}

export interface QueryParams {
  text: string;
  values?: any[];
}

export class Database {
  private pool = pool;

  async query<T = any>(text: string, values?: any[]): Promise<DatabaseResult<T>> {
    const start = Date.now();
    try {
      const result = await this.pool.query(text, values);
      const duration = Date.now() - start;
      console.log('Query executed', { text, duration, rows: result.rowCount });
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Generic CRUD operations
  async findById<T>(table: string, id: string): Promise<T | null> {
    const result = await this.query<T>(
      `SELECT * FROM ${table} WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async findAll<T>(table: string, options: {
    limit?: number;
    offset?: number;
    orderBy?: string;
    orderDirection?: 'ASC' | 'DESC';
    where?: string;
    whereParams?: any[];
  } = {}): Promise<T[]> {
    let query = `SELECT * FROM ${table}`;
    const params: any[] = [];
    let paramIndex = 1;

    if (options.where) {
      query += ` WHERE ${options.where}`;
      if (options.whereParams) {
        params.push(...options.whereParams);
      }
    }

    if (options.orderBy) {
      query += ` ORDER BY ${options.orderBy} ${options.orderDirection || 'ASC'}`;
    }

    if (options.limit) {
      query += ` LIMIT $${paramIndex}`;
      params.push(options.limit);
      paramIndex++;
    }

    if (options.offset) {
      query += ` OFFSET $${paramIndex}`;
      params.push(options.offset);
    }

    const result = await this.query<T>(query, params);
    return result.rows;
  }

  async create<T>(table: string, data: Partial<T>): Promise<T> {
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

    const query = `
      INSERT INTO ${table} (${columns})
      VALUES (${placeholders})
      RETURNING *
    `;

    const result = await this.query<T>(query, values);
    return result.rows[0];
  }

  async update<T>(table: string, id: string, data: Partial<T>): Promise<T | null> {
    const setClause = Object.keys(data)
      .map((key, i) => `${key} = $${i + 2}`)
      .join(', ');
    
    const values = [id, ...Object.values(data)];
    
    const query = `
      UPDATE ${table}
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;

    const result = await this.query<T>(query, values);
    return result.rows[0] || null;
  }

  async delete(table: string, id: string): Promise<boolean> {
    const result = await this.query(
      `DELETE FROM ${table} WHERE id = $1`,
      [id]
    );
    return result.rowCount > 0;
  }

  // Stock specific queries
  async getStockBySymbol(symbol: string): Promise<any | null> {
    const result = await this.query(`
      SELECT s.*, c.name as company_name, c.sector, c.industry
      FROM stocks s
      JOIN companies c ON s.company_id = c.id
      WHERE s.symbol = $1
    `, [symbol]);
    return result.rows[0] || null;
  }

  async getStockPriceHistory(symbol: string, days: number = 30): Promise<any[]> {
    const result = await this.query(`
      SELECT sp.date, sp.open, sp.high, sp.low, sp.close, sp.volume
      FROM stock_prices sp
      JOIN stocks s ON sp.stock_id = s.id
      WHERE s.symbol = $1
      AND sp.date >= CURRENT_DATE - INTERVAL '${days} days'
      ORDER BY sp.date ASC
    `, [symbol]);
    return result.rows;
  }

  // IPO specific queries
  async getIpos(filters: {
    status?: string;
    issue_type?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<any[]> {
    let query = `
      SELECT i.*, c.name as company_name, c.logo_url
      FROM ipos i
      JOIN companies c ON i.company_id = c.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.status) {
      query += ` AND i.status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters.issue_type) {
      query += ` AND i.issue_type = $${paramIndex}`;
      params.push(filters.issue_type);
      paramIndex++;
    }

    query += ` ORDER BY i.open_date DESC NULLS LAST`;

    if (filters.limit) {
      query += ` LIMIT $${paramIndex}`;
      params.push(filters.limit);
      paramIndex++;
    }

    if (filters.offset) {
      query += ` OFFSET $${paramIndex}`;
      params.push(filters.offset);
    }

    const result = await this.query(query, params);
    return result.rows;
  }

  // News specific queries
  async getNewsArticles(filters: {
    category?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<any[]> {
    let query = `
      SELECT id, title, slug, summary, author, source, category, image_url, published_at, view_count
      FROM news_articles
      WHERE is_published = true
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.category) {
      query += ` AND category = $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }

    query += ` ORDER BY published_at DESC`;

    if (filters.limit) {
      query += ` LIMIT $${paramIndex}`;
      params.push(filters.limit);
      paramIndex++;
    }

    if (filters.offset) {
      query += ` OFFSET $${paramIndex}`;
      params.push(filters.offset);
    }

    const result = await this.query(query, params);
    return result.rows;
  }

  // Forum specific queries
  async getForumThreads(filters: {
    category?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<any[]> {
    let query = `
      SELECT ft.*, u.username, u.avatar_url
      FROM forum_threads ft
      LEFT JOIN users u ON ft.user_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.category) {
      query += ` AND ft.category = $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }

    query += ` ORDER BY ft.is_sticky DESC, ft.last_reply_at DESC NULLS LAST, ft.created_at DESC`;

    if (filters.limit) {
      query += ` LIMIT $${paramIndex}`;
      params.push(filters.limit);
      paramIndex++;
    }

    if (filters.offset) {
      query += ` OFFSET $${paramIndex}`;
      params.push(filters.offset);
    }

    const result = await this.query(query, params);
    return result.rows;
  }

  async getForumReplies(threadId: string): Promise<any[]> {
    const result = await this.query(`
      SELECT fr.*, u.username, u.avatar_url
      FROM forum_replies fr
      LEFT JOIN users u ON fr.user_id = u.id
      WHERE fr.thread_id = $1
      ORDER BY fr.created_at ASC
    `, [threadId]);
    return result.rows;
  }
}

export const db = new Database();