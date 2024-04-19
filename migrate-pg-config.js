require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    connectionString: isProduction ? process.env.DATABASE_URL : process.env.DEVELOPMENT_DATABASE_URL,
    dir: './migrations', // Stien til migrasjonsfilene
    ssl: isProduction ? {
        sslmode: 'require', // Bekrefter at SSL er påkrevd
        rejectUnauthorized: false // Tillater selvsignerte sertifikater, viktig på Heroku
    } : false
};
