"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
// Konfigurasjon for PostgreSQL-tilkoblingen
const pool = new pg_1.Pool({
    user: process.env.DATABASE_USER || 'rahmat', // Brukernavn for PostgreSQL-databasen
    host: process.env.DATABASE_HOST || 'localhost', // Vert for PostgreSQL-serveren
    database: process.env.DATABASE_NAME || 'inovix', // Navnet på den PostgreSQL-databasen du ønsker å koble til
    password: process.env.DATABASE_PASSWORD || '', // Passord for PostgreSQL-brukeren
    port: parseInt(process.env.DATABASE_PORT || '5432'), // Porten som PostgreSQL-serveren kjører på
});
exports.default = pool;
