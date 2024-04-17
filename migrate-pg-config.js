module.exports = {
  user: process.env.DATABASE_USER|| 'rahmat', // Brukernavn for PostgreSQL-databasen
    host: process.env.DATABASE_HOST||'localhost', // Vert for PostgreSQL-serveren
    database: process.env.DATABASE_NAME||'inovix', // Navnet på den PostgreSQL-databasen du ønsker å koble til
    password: process.env.DATABASE_PASSWORD||'', // Passord for PostgreSQL-brukeren
    port: process.env.DATABASE_PORT, // Porten for PostgreSQL-serveren
  dir: './migrations', // Stien til mappen med migrasjonsfilene dine
};