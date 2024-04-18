export default {
   connectionString: process.env.DATABASE_URL,
  schema: 'public',
  migrationsTable: 'migrations',
  ssl: { rejectUnauthorized: false }  
};
