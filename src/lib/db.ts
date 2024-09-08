// lib/db.js
import { Pool } from 'pg';

// Create a connection pool using the connection string from the environment variables
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Export a query function to execute SQL queries
export const query = (text: string, params?: any[]) => pool.query(text, params);
