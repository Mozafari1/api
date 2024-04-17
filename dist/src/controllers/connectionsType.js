"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnectionsTypes = exports.deleteConnectionsType = exports.updateConnectionsType = exports.createConnectionsType = void 0;
const db_1 = __importDefault(require("../services/db"));
async function createConnectionsType(req, res) {
    try {
        const userId = req.body.userId;
        if (!userId) {
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }
        const { name } = req.body;
        if (name) {
            const client = await db_1.default.connect();
            const result = await client.query('INSERT INTO connections_type(name) VALUES($1) RETURNING *', [name]);
            client.release();
            res.status(201).json(result.rows[0]);
        }
        else {
            res.status(400).json({ error: 'Something went wrong' });
        }
    }
    catch (error) {
        console.error('Error creating price:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.createConnectionsType = createConnectionsType;
async function updateConnectionsType(req, res) {
    try {
        const { id } = req.params;
        const userId = req.body.userId;
        const { name } = req.body;
        if (!name || !id || !userId) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        const client = await db_1.default.connect();
        const result = await client.query('UPDATE connections_type SET name = $1, updated_at = $2 WHERE id = $3 RETURNING *', [name, new Date(), id]);
        client.release();
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Connections Type not found' });
        }
        else {
            res.status(200).json(result.rows[0]);
        }
    }
    catch (error) {
        console.error('Error updating connections type:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.updateConnectionsType = updateConnectionsType;
async function deleteConnectionsType(req, res) {
    try {
        const { id } = req.params;
        const userId = req.body.userId;
        if (!id || !userId) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        const client = await db_1.default.connect();
        const result = await client.query('UPDATE connections_type SET is_deleted = true, updated_at = $1 WHERE id = $2 RETURNING *', [new Date(), id]);
        client.release();
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Connections Type not found' });
        }
        else {
            res.status(200).json(result.rows[0]);
        }
    }
    catch (error) {
        console.error('Error deleting connections type:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.deleteConnectionsType = deleteConnectionsType;
async function getConnectionsTypes(req, res) {
    try {
        const client = await db_1.default.connect();
        const result = await client.query('SELECT * FROM connections_type WHERE is_deleted = false');
        client.release();
        res.json(result.rows);
    }
    catch (error) {
        console.error('Error getting connections type:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.getConnectionsTypes = getConnectionsTypes;
