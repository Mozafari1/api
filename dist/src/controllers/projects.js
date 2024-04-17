"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectsWithFiles = exports.getProjects = exports.deleteProject = exports.updateProject = exports.createProject = void 0;
const db_1 = __importDefault(require("../services/db"));
async function createProject(req, res) {
    try {
        if (!req.body.userId) {
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }
        const userId = req.body.userId;
        // Extract other form data from req.body
        const { name, domain_name, status, service_type, contact_id } = req.body;
        if (name && domain_name && status && service_type && contact_id) {
            // Now you can save the file path to the database along with other form data
            const client = await db_1.default.connect();
            const result = await client.query('INSERT INTO projects(name, domain_name, status, service_type, contact_id, created_by) VALUES($1, $2, $3, $4, $5, $6) RETURNING *', [name, domain_name, status, service_type, contact_id, userId]);
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
exports.createProject = createProject;
async function updateProject(req, res) {
    try {
        const { id } = req.params;
        const userId = req.body.userId;
        if (!userId || !id) {
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }
        const { name, domain_name, status, service_type, contact_id } = req.body;
        if (!name || !domain_name || !status || !service_type || !contact_id || !id) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        const client = await db_1.default.connect();
        const result = await client.query('UPDATE projects SET name = $1, domain_name = $2, status = $3, service_type = $4, contact_id = $5, updated_at = $6, updated_by = $7 WHERE id = $8 RETURNING *', [name, domain_name, status, service_type, contact_id, new Date(), userId, id]);
        client.release();
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Project not found' });
        }
        else {
            res.status(200).json(result.rows[0]);
        }
    }
    catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.updateProject = updateProject;
async function deleteProject(req, res) {
    try {
        const { id } = req.params;
        const userId = req.body.userId;
        if (!userId || !id) {
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }
        const client = await db_1.default.connect();
        const result = await client.query('UPDATE projects SET is_deleted = true, updated_at = $1, updated_by = $2 WHERE id = $3 RETURNING *', [new Date(), userId, id]);
        client.release();
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Project not found' });
        }
        else {
            res.status(200).json(result.rows[0]);
        }
    }
    catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.deleteProject = deleteProject;
async function getProjects(req, res) {
    try {
        const client = await db_1.default.connect();
        const result = await client.query('SELECT p.id,p.name, p.domain_name, p.status, p.service_type, p.updated_at, p.contact_id, c.first_name, c.last_name, c.email, c.phone_number FROM projects p JOIN contacts c ON p.contact_id = c.id WHERE p.is_deleted = false');
        client.release();
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error('Error getting projects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.getProjects = getProjects;
async function getProjectsWithFiles(req, res) {
    try {
        if (!req.body.userId) {
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }
        const client = await db_1.default.connect();
        const result = await client.query(`SELECT p.id, p.name, f.name AS original_name, f.file_name, f.type, f.id AS file_id, f.updated_at, f.special_type
       FROM projects p
       LEFT JOIN files f ON p.id = f.project_id AND f.is_deleted = false
       WHERE p.is_deleted = false`);
        client.release();
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error('Error getting projects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.getProjectsWithFiles = getProjectsWithFiles;
