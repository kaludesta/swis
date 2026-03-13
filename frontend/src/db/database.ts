import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';

const db = new Database('academic-dashboard.db');

// Initialize database with schema
export function initDatabase() {
  const schema = readFileSync(join(process.cwd(), 'db', 'schema.sql'), 'utf-8');
  db.exec(schema);
}

export interface User {
  id?: number;
  email: string;
  password_hash: string;
  name: string;
  created_at?: string;
}

export interface WebsiteTracking {
  id?: number;
  user_id: number;
  domain: string;
  url: string;
  title?: string;
  time_spent: number;
  visit_date: string;
  last_updated?: string;
}

export const userDb = {
  create: (user: Omit<User, 'id' | 'created_at'>) => {
    const stmt = db.prepare('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)');
    return stmt.run(user.email, user.password_hash, user.name);
  },
  
  findByEmail: (email: string): User | undefined => {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email) as User | undefined;
  },
  
  findById: (id: number): User | undefined => {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id) as User | undefined;
  }
};

export const trackingDb = {
  upsert: (tracking: Omit<WebsiteTracking, 'id' | 'last_updated'>) => {
    const stmt = db.prepare(`
      INSERT INTO website_tracking (user_id, domain, url, title, time_spent, visit_date)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, domain, visit_date)
      DO UPDATE SET 
        time_spent = time_spent + excluded.time_spent,
        url = excluded.url,
        title = excluded.title,
        last_updated = CURRENT_TIMESTAMP
    `);
    return stmt.run(
      tracking.user_id,
      tracking.domain,
      tracking.url,
      tracking.title,
      tracking.time_spent,
      tracking.visit_date
    );
  },
  
  getByUser: (userId: number, startDate?: string, endDate?: string) => {
    let query = 'SELECT * FROM website_tracking WHERE user_id = ?';
    const params: any[] = [userId];
    
    if (startDate) {
      query += ' AND visit_date >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND visit_date <= ?';
      params.push(endDate);
    }
    
    query += ' ORDER BY visit_date DESC, time_spent DESC';
    
    const stmt = db.prepare(query);
    return stmt.all(...params) as WebsiteTracking[];
  },
  
  getTopSites: (userId: number, limit: number = 10) => {
    const stmt = db.prepare(`
      SELECT domain, SUM(time_spent) as total_time, COUNT(*) as visit_count
      FROM website_tracking
      WHERE user_id = ?
      GROUP BY domain
      ORDER BY total_time DESC
      LIMIT ?
    `);
    return stmt.all(userId, limit);
  }
};

export default db;
