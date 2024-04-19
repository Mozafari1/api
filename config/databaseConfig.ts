require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const databaseConfig = {
  connectionString: isProduction ? process.env.DATABASE_URL+"?sslmode=require" : process.env.DEVELOPMENT_DATABASE_URL,
  schema: 'public',
  migrationsTable: 'migrations',
  ssl: isProduction ? { rejectUnauthorized: false,require: true, } : false
};

export default databaseConfig;
