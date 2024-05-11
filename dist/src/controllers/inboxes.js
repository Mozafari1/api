"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInboxes = exports.deleteInbox = exports.updateInboxStatus = exports.updateInbox = exports.createInbox = void 0;
const db_1 = __importDefault(require("../services/db"));
const reCaptcha_1 = require("../jwt/reCaptcha");
async function createInbox(req, res) {
    try {
        // Extract other form data from req.body
        const { name, email, message, phone_number, service_type, created_from_ip, recaptcha_token } = req.body;
        const isCaptchaValid = await (0, reCaptcha_1.verifyRecaptcha)(recaptcha_token);
        if (!isCaptchaValid) {
            res.status(403).json({ error: 'Failed to authenticate reCAPTCHA' });
            return;
        }
        console.log('isCaptchaValid', isCaptchaValid);
        if (name && email && message) {
            // Now you can save the file path to the database along with other form data
            const client = await db_1.default.connect();
            const result = await client.query('INSERT INTO inboxes(name, email, phone_number, service_type, message, created_from_ip) VALUES($1, $2, $3, $4, $5, $6) RETURNING *', [name, email, phone_number, service_type, message, created_from_ip]);
            client.release();
            res.status(201).json(result.rows[0]);
        }
        else {
            res.status(400).json({ error: 'Something went wrong' });
        }
    }
    catch (error) {
        console.error('Error creating inbox:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.createInbox = createInbox;
// update
async function updateInbox(req, res) {
    try {
        const { id } = req.params;
        const userId = req.body.userId;
        if (!id || !userId) {
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }
        const { is_customer, is_responded, } = req.body;
        const client = await db_1.default.connect();
        const result = await client.query('UPDATE inboxes SET is_customer = $1 updated_at = $2 WHERE id = $4 RETURNING *', [is_customer, new Date(), id]);
        client.release();
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        }
        else {
            res.status(404).json({ error: 'Inbox not found' });
        }
    }
    catch (error) {
        console.error('Error updating inbox:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.updateInbox = updateInbox;
async function updateInboxStatus(req, res) {
    try {
        const { id } = req.params;
        const userId = req.body.userId;
        if (!id || !userId) {
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }
        const { is_customer, is_responded } = req.body;
        const client = await db_1.default.connect();
        const result = await client.query('UPDATE inboxes SET is_responded = $1, is_customer = $2, updated_at = $3 WHERE id = $4 RETURNING *', [is_responded, is_customer, new Date(), id]);
        client.release();
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        }
        else {
            res.status(404).json({ error: 'Inbox not found' });
        }
    }
    catch (error) {
        console.error('Error updating inbox:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.updateInboxStatus = updateInboxStatus;
//delete
async function deleteInbox(req, res) {
    try {
        const { id } = req.params;
        const userId = req.body.userId;
        if (!id || !userId) {
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }
        const client = await db_1.default.connect();
        const result = await client.query('UPDATE inboxes SET is_deleted = true, updated_at = $1 WHERE id = $2 RETURNING *', [new Date(), id]);
        client.release();
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        }
        else {
            res.status(404).json({ error: 'Inbox not found' });
        }
    }
    catch (error) {
        console.error('Error deleting inbox:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.deleteInbox = deleteInbox;
// get
async function getInboxes(req, res) {
    try {
        const userId = req.body.userId;
        if (!userId) {
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }
        const client = await db_1.default.connect();
        const result = await client.query('SELECT * FROM inboxes  WHERE is_deleted = false ORDER BY created_at DESC');
        client.release();
        res.json(result.rows);
    }
    catch (error) {
        console.error('Error getting inboxes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.getInboxes = getInboxes;
