// lib/db.js
import { Pool } from 'pg';

// Create a connection pool using the connection string from the environment variables
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Define the type for the parameters that can be passed into the query
type QueryParams = Array<string | number | boolean | null | undefined>;

// Export a query function to execute SQL queries
export const query = (text: string, params?: QueryParams) => pool.query(text, params);