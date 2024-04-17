"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPricesWithFiles = exports.getPrices = exports.getPrice = exports.deletePrice = exports.updatePrice = exports.createPrice = void 0;
const db_1 = __importDefault(require("../services/db"));
async function createPrice(req, res) {
    try {
        const userId = req.body.userId;
        if (!userId) {
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }
        // Extract other form data from req.body
        const { package_name, title, price, description, pointA, pointB, pointC, pointD, pointE } = req.body;
        if (package_name && title && price && description && pointA && pointB && pointC && pointD && pointE) {
            // Now you can save the file path to the database along with other form data
            const client = await db_1.default.connect();
            const result = await client.query('INSERT INTO prices(package_name, title, price, description, "pointA", "pointB", "pointC", "pointD", "pointE", created_by) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *', [package_name, title, price, description, pointA, pointB, pointC, pointD, pointE, userId,]);
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
exports.createPrice = createPrice;
async function updatePrice(req, res) {
    try {
        const { id } = req.params;
        const userId = req.body.userId;
        if (!userId || !id) {
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }
        const { package_name, title, price, description, pointA, pointB, pointC, pointD, pointE } = req.body;
        if (!package_name || !title || !price || !description || !pointA || !pointB || !pointC || !pointD || !pointE || !id) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        const client = await db_1.default.connect();
        const result = await client.query('UPDATE prices SET package_name = $1, title = $2, price = $3, description = $4, "pointA" = $5, "pointB" = $6, "pointC" = $7, "pointD" = $8, "pointE" = $9, updated_at = $10, updated_by = $11 WHERE id = $12 RETURNING *', [package_name, title, price, description, pointA, pointB, pointC, pointD, pointE, new Date(), userId, id]);
        client.release();
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Price not found' });
        }
        else {
            res.status(200).json(result.rows[0]);
        }
    }
    catch (error) {
        console.error('Error updating price:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.updatePrice = updatePrice;
async function deletePrice(req, res) {
    try {
        const { id } = req.params;
        const userId = req.body.userId;
        if (!id || !userId) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        const client = await db_1.default.connect();
        const result = await client.query('UPDATE prices SET is_deleted = true, updated_at = $1, updated_by = $2 WHERE id = $3 RETURNING *', [new Date(), userId, id]);
        client.release();
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Price not found' });
            return;
        }
        else {
            res.status(200).json(result.rows[0]);
            return;
        }
    }
    catch (error) {
        console.error('Error deleting price:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.deletePrice = deletePrice;
async function getPrice(req, res) {
    try {
        const { id } = req.params;
        const userId = req.body.userId;
        if (!id || !userId) {
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }
        const client = await db_1.default.connect();
        const result = await client.query('SELECT * FROM prices WHERE id = $1', [id]);
        client.release();
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Price not found' });
        }
        else {
            res.status(200).json(result.rows[0]);
        }
    }
    catch (error) {
        console.error('Error getting price:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.getPrice = getPrice;
async function getPrices(req, res) {
    try {
        const client = await db_1.default.connect();
        const result = await client.query('SELECT id, package_name, updated_at, title, price, description, "pointA","pointB", "pointC", "pointD", "pointE"  FROM prices WHERE is_deleted = false order by id ASC');
        client.release();
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error('Error getting prices:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.getPrices = getPrices;
async function getPricesWithFiles(req, res) {
    try {
        if (!req.body.userId) {
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }
        const client = await db_1.default.connect();
        const result = await client.query(`SELECT p.id, p.package_name AS name, f.name AS original_name, f.file_name, f.type, f.id AS file_id, f.updated_at, f.special_type
       FROM prices p
       LEFT JOIN files f ON p.id = f.price_id AND f.is_deleted = false
       WHERE p.is_deleted = false`);
        client.release();
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error('Error getting projects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.getPricesWithFiles = getPricesWithFiles;
