require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
const databaseConfig = {
  connectionString: isProduction
    ? process.env.DATABASE_URL // Fjernet unødvendige anførselstegn rundt variabelen
    : process.env.DEVELOPMENT_DATABASE_URL,
  ssl: isProduction
    ? { 
      rejectUnauthorized: false
      }
    : undefined, // Ingen SSL i utviklingsmiljø
  schema: 'public',
  migrationsTable: 'migrations',
};

export default databaseConfig;
