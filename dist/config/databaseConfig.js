"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const isProduction = process.env.NODE_ENV === 'production';
const databaseConfig = {
    connectionString: isProduction
        ? `${process.env.DATABASE_URL}?sslmode=require`
        : process.env.DEVELOPMENT_DATABASE_URL,
    ssl: isProduction ? { rejectUnauthorized: false } : undefined,
    schema: 'public',
    migrationsTable: 'migrations',
};
exports.default = databaseConfig;
