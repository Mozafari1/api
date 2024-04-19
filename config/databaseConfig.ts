require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const databaseConfig = {
  connectionString: isProduction ? process.env.DATABASE_URL : process.env.DEVELOPMENT_DATABASE_URL,
  schema: 'public',
  migrationsTable: 'migrations',
    ssl: isProduction ? {
        rejectUnauthorized: false,
        sslmode: true
  } : false
};

export default databaseConfig;
