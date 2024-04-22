require('dotenv').config();
const isProduction = process.env.NODE_ENV === 'production';
console.log('Mig:', process.env.DATABASE_URL);
module.exports = {
    connectionString: isProduction
        ?process.env.DATABASE_URL
        : process.env.DEVELOPMENT_DATABASE_URL,
    ssl: isProduction ? { rejectUnauthorized: false} : undefined,
    dir: './migrations',
};
