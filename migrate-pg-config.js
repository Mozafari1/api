require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  
    connectionString:`${isProduction ? process.env.DATABASE_URL + "?sslmode=require" : process.env.DEVELOPMENT_DATABASE_URL}`,
    dir: './migrations', // Stien til migrasjonsfilene
    ssl: isProduction ? {
        rejectUnauthorized: false // Tillater selvsignerte sertifikater, viktig på Heroku
    } : false
};
