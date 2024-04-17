"use strict";
module.exports = {
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 5432,
    database: process.env.DATABASE_NAME || 'inovix',
    user: process.env.DATABASE_USER || 'rahmat',
    password: process.env.DATABASE_PASSWORD || '',
    schema: 'public',
    migrationsTable: 'migrations',
};
