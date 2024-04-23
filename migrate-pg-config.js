require('dotenv').config();
const isProduction = process.env.NODE_ENV === 'production';
module.exports = {
    connectionString: isProduction
        ? `${process.env.DATABASE_URL}?sslmode=require`
        : process.env.DEVELOPMENT_DATABASE_URL,
    ssl: isProduction ? { rejectUnauthorized: false} : undefined,
    dir: './migrations',
};
