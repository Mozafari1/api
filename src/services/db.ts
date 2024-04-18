import { Pool } from 'pg';
import dbConfig from '../../config/databaseConfig'; // Importer konfigurasjonen

const pool = new Pool({
  connectionString: dbConfig.connectionString, // Prioriter denne for Heroku
  user: dbConfig.user,
  host: dbConfig.host,
  database: dbConfig.database,
  password: dbConfig.password,
  port: dbConfig.port,
  ssl: dbConfig.ssl
});

export default pool;
