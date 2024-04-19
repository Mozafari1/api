import { Pool } from 'pg';
import dbConfig from '../../config/databaseConfig';
console.log('Database Configuration:', dbConfig);
const pool = new Pool({
  connectionString: dbConfig.connectionString,
  ssl: dbConfig.ssl
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err); // Logg feilen
  process.exit(-1);
});

export default pool;