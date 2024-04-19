"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const databaseConfig_1 = __importDefault(require("../../config/databaseConfig"));
console.log('Database Configuration:', databaseConfig_1.default);
const pool = new pg_1.Pool({
    connectionString: databaseConfig_1.default.connectionString,
    ssl: databaseConfig_1.default.ssl
});
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err); // Logg feilen
    process.exit(-1);
});
exports.default = pool;
