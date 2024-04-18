require('dotenv').config();  // Sørger for at .env filen lastes i ikke-produksjonsmiljøer

module.exports = {
  connectionString: process.env.DATABASE_URL,  // Bruker Heroku DATABASE_URL hvis tilgjengelig
  user: process.env.DATABASE_USER || 'rahmat', 
  host: process.env.DATABASE_HOST || 'localhost',
  database: process.env.DATABASE_NAME || 'inovix',
  password: process.env.DATABASE_PASSWORD || '',
  port: process.env.DATABASE_PORT || 5432,
  dir: './migrations',  // Stien til migrasjonsfilene
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
};
