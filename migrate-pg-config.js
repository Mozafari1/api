require('dotenv').config();  // Sørger for at .env filen lastes i ikke-produksjonsmiljøer

module.exports = {
   connectionString: DATABASE_URL,  // Bruker Heroku DATABASE_URL hvis tilgjengelig
  dir: './migrations',  // Stien til migrasjonsfilene
 ssl: { rejectUnauthorized: false } 

};
