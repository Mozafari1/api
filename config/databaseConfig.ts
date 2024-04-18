export default {
   connectionString: process.env.DATABASE_URL, // for Heroku-støtte
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'inovix',
  user: process.env.DATABASE_USER || 'rahmat',
  password: process.env.DATABASE_PASSWORD || '',
  schema: 'public',
  migrationsTable: 'migrations',
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined  // Endret fra null til undefined
};
