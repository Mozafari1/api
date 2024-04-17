"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServiceTypes = exports.getServiceType = exports.deleteServiceType = exports.updateServiceType = exports.createServiceType = void 0;
const db_1 = __importDefault(require("../services/db"));
async function createServiceType(req, res) {
    try {
        if (!req.body.userId) {
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }
        const userId = req.body.userId;
        // Extract other form data from req.body
        const { value, label } = req.body;
        if (value && label) {
            // Now you can save the file path to the database along with other form data
            const client = await db_1.default.connect();
            const result = await client.query('INSERT INTO service-types(value, label, created_by) VALUES($1, $2, $3) RETURNING *', [value, label, userId,]);
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
exports.createServiceType = createServiceType;
async function updateServiceType(req, res) {
    try {
        const { id } = req.params;
        const userId = req.body.userId;
        const { value, label } = req.body;
        if (!value || !label || !id) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        const client = await db_1.default.connect();
        const result = await client.query('UPDATE service-types SET value = $1, label = $2, updated_at = $3, updated_by = $4 WHERE id = $5 RETURNING *', [value, label, new Date(), userId, id]);
        client.release();
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Service Type not found' });
        }
        else {
            res.status(200).json(result.rows[0]);
        }
    }
    catch (error) {
        console.error('Error updating service type:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.updateServiceType = updateServiceType;
async function deleteServiceType(req, res) {
    try {
        const { id } = req.params;
        const client = await db_1.default.connect();
        const result = await client.query('DELETE FROM service-types WHERE id = $1 RETURNING *', [id]);
        client.release();
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Service Type not found' });
        }
        else {
            res.status(200).json(result.rows[0]);
        }
    }
    catch (error) {
        console.error('Error deleting service type:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.deleteServiceType = deleteServiceType;
async function getServiceType(req, res) {
    try {
        const { id } = req.params;
        const client = await db_1.default.connect();
        const result = await client.query('SELECT * FROM service-types WHERE id = $1', [id]);
        client.release();
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Service Type not found' });
        }
        else {
            res.status(200).json(result.rows[0]);
        }
    }
    catch (error) {
        console.error('Error getting service type:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.getServiceType = getServiceType;
async function getServiceTypes(req, res) {
    try {
        const client = await db_1.default.connect();
        const result = await client.query('SELECT * FROM service-types WHERE is_deleted = false');
        client.release();
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error('Error getting service types:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.getServiceTypes = getServiceTypes;
