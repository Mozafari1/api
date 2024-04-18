import { Pool } from 'pg';
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false  // Allows connection to a PostgreSQL instance with a self-signed certificate
    }
});

export default pool;
