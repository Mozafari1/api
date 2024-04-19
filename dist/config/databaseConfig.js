"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const isProduction = process.env.NODE_ENV === 'production';
console.log('databaseConfig:', process.env.DATABASE_URL);
const databaseConfig = {
    connectionString: isProduction
        ? process.env.DATABASE_URL // Fjernet unødvendige anførselstegn rundt variabelen
        : process.env.DEVELOPMENT_DATABASE_URL,
    ssl: isProduction
        ? {
            rejectUnauthorized: false, // Dette tillater selvsignerte sertifikater, typisk for noen cloud-miljøer
            ca: process.env.CACERT
        }
        : undefined, // Ingen SSL i utviklingsmiljø
    schema: 'public',
    migrationsTable: 'migrations',
};
exports.default = databaseConfig;
