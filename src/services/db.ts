import { Pool } from 'pg';
import dbConfig from '../../config/databaseConfig';

const pool = new Pool({
  connectionString: dbConfig.connectionString,
  ssl: dbConfig.ssl
});

export default pool;