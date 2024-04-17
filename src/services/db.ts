import { Pool } from 'pg';

// Konfigurasjon for PostgreSQL-tilkoblingen
const pool = new Pool({
 user: process.env.DATABASE_USER|| 'rahmat', // Brukernavn for PostgreSQL-databasen
    host: process.env.DATABASE_HOST||'localhost', // Vert for PostgreSQL-serveren
    database: process.env.DATABASE_NAME||'inovix', // Navnet på den PostgreSQL-databasen du ønsker å koble til
    password: process.env.DATABASE_PASSWORD||'', // Passord for PostgreSQL-brukeren
    port: parseInt(process.env.DATABASE_PORT||'5432'), // Porten som PostgreSQL-serveren kjører på
});

export default pool;
