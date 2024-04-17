"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServicesWithFiles = exports.getServiceList = exports.getServices = exports.deleteService = exports.updateService = exports.createService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const db_1 = __importDefault(require("../services/db"));
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
// Define the upload directory path
const uploadDirectory = path_1.default.join(__dirname, process.env.UPLOAD_PATH || "../../uploads");
if (!fs_1.default.existsSync(uploadDirectory)) {
    fs_1.default.mkdirSync(uploadDirectory, { recursive: true });
}
// Define storage for multer
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirectory); // Save files to the uploads directory
    },
    filename: function (req, file, cb) {
        const uuid = (0, uuid_1.v4)(); // Generate UUID version 4
        const extension = path_1.default.extname(file.originalname); // Extract file extension
        cb(null, `${uuid}${extension}`); // Use UUID as the filename
    }
});
// Create multer instance with defined storage
const upload = (0, multer_1.default)({ storage: storage });
async function createService(req, res) {
    try {
        if (!req.body.userId) {
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }
        const userId = req.body.userId;
        // Handle file upload using multer
        upload.single('image')(req, res, async (err) => {
            if (err) {
                console.error('Error uploading file:', err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            // Extract other form data from req.body
            const { title, less_content, main_content, sub_title, sub_content, sub_points_title, sub_point_titleA, sub_point_contentA, sub_point_titleB, sub_point_contentB, sub_point_titleC, sub_point_contentC, sub_point_titleD, sub_point_contentD, sub_point_titleE, sub_point_contentE, summary_title, summary_main_content, summary_sub_content, summary_sub_sub_content } = req.body;
            // If file is uploaded, save the file to the server
            if (req.file && title && less_content && main_content && sub_title && sub_content &&
                sub_points_title && sub_point_titleA && sub_point_contentA && sub_point_titleB && sub_point_contentB && sub_point_titleC && sub_point_contentC && sub_point_titleD && sub_point_contentD && sub_point_titleE && sub_point_contentE && summary_title && summary_main_content && summary_sub_content && summary_sub_sub_content) {
                // Now you can save the file path to the database along with other form data
                const client = await db_1.default.connect();
                const connection_id = await client.query('SELECT * FROM connections_type WHERE name = $1', ['Tjenester']);
                const result = await client.query('INSERT INTO services(title, less_content, main_content, sub_title, sub_content, sub_points_title, "sub_point_titleA", "sub_point_contentA", "sub_point_titleB", "sub_point_contentB", "sub_point_titleC", "sub_point_contentC", "sub_point_titleD", "sub_point_contentD", "sub_point_titleE", "sub_point_contentE", summary_title, summary_main_content, summary_sub_content, summary_sub_sub_content, created_by, updated_by) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22) RETURNING *', [title, less_content, main_content, sub_title, sub_content, sub_points_title, sub_point_titleA, sub_point_contentA, sub_point_titleB, sub_point_contentB, sub_point_titleC, sub_point_contentC, sub_point_titleD, sub_point_contentD, sub_point_titleE, sub_point_contentE, summary_title, summary_main_content, summary_sub_content, summary_sub_sub_content, userId, userId]);
                const fileResult = await client.query('INSERT INTO files(name, size, type, created_by, service_id, connection_type_id, file_name) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *', [req.file.filename, req.file.size, req.file.mimetype, userId, result.rows[0].id, connection_id.rows[0].id, req.file.filename]);
                client.release();
                res.status(201).json(result.rows[0]);
            }
            else {
                res.status(400).json({ error: 'No file uploaded' });
            }
        });
    }
    catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.createService = createService;
async function updateService(req, res) {
    try {
        const { id } = req.params;
        const userId = req.body.userId;
        if (!id || !userId) {
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }
        const { title, less_content, main_content, sub_title, sub_content, sub_points_title, sub_point_titleA, sub_point_contentA, sub_point_titleB, sub_point_contentB, sub_point_titleC, sub_point_contentC, sub_point_titleD, sub_point_contentD, sub_point_titleE, sub_point_contentE, summary_title, summary_main_content, summary_sub_content, summary_sub_sub_content } = req.body;
        const client = await db_1.default.connect();
        const result = await client.query('UPDATE services SET title = $1, less_content = $2, main_content = $3, sub_title = $4, sub_content = $5, sub_points_title = $6, "sub_point_titleA" = $7, "sub_point_contentA" = $8, "sub_point_titleB" = $9, "sub_point_contentB" = $10, "sub_point_titleC" = $11, "sub_point_contentC" = $12, "sub_point_titleD" = $13, "sub_point_contentD" = $14, "sub_point_titleE" = $15, "sub_point_contentE" = $16, summary_title = $17, summary_main_content = $18, summary_sub_content = $19, summary_sub_sub_content = $20, updated_at = $21, updated_by = $22 WHERE id = $23 RETURNING *', [title, less_content, main_content, sub_title, sub_content, sub_points_title, sub_point_titleA, sub_point_contentA, sub_point_titleB, sub_point_contentB, sub_point_titleC, sub_point_contentC, sub_point_titleD, sub_point_contentD, sub_point_titleE, sub_point_contentE, summary_title, summary_main_content, summary_sub_content, summary_sub_sub_content, new Date(), userId, id]);
        client.release();
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Service not found' });
        }
        else {
            res.status(200).json(result.rows[0]);
        }
    }
    catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.updateService = updateService;
async function deleteService(req, res) {
    try {
        const { id } = req.params;
        const userId = req.body.userId;
        if (!id || !userId) {
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }
        const client = await db_1.default.connect();
        const result = await client.query('UPDATE services SET is_deleted = true, updated_at = $1, updated_by = $2 WHERE id = $3 RETURNING *', [new Date(), userId, id]);
        client.release();
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Service not found' });
        }
        else {
            res.status(200).json(result.rows[0]);
        }
    }
    catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.deleteService = deleteService;
async function getServices(req, res) {
    try {
        const client = await db_1.default.connect();
        const result = await client.query(`SELECT s.id, s.title, s.updated_at, s.less_content, s.main_content, s.sub_title, s.sub_content, s.sub_points_title, s."sub_point_titleA", s."sub_point_contentA", s."sub_point_titleB", s."sub_point_contentB", s."sub_point_titleC", s."sub_point_contentC", s."sub_point_titleD", s."sub_point_contentD", s."sub_point_titleE", s."sub_point_contentE", s.summary_title, s.summary_main_content, s.summary_sub_content, s.summary_sub_sub_content,
             f.name AS file_name,f.type AS file_type, f.id AS file_id
             FROM services s
             LEFT JOIN files f ON s.id = f.service_id
             WHERE s.is_deleted = false AND f.is_deleted = false Order BY s.id ASC`);
        client.release();
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error('Error getting services:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.getServices = getServices;
async function getServiceList(req, res) {
    try {
        const client = await db_1.default.connect();
        const result = await client.query('SELECT id, title FROM services WHERE is_deleted = false');
        client.release();
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error('Error getting services:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.getServiceList = getServiceList;
async function getServicesWithFiles(req, res) {
    try {
        if (!req.body.userId) {
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }
        const client = await db_1.default.connect();
        const result = await client.query(`SELECT s.id, s.title AS name, f.name AS original_name, f.file_name, f.type, f.id AS file_id, f.updated_at, f.special_type
       FROM services s
       LEFT JOIN files f ON s.id = f.service_id AND f.is_deleted = false
       WHERE s.is_deleted = false`);
        client.release();
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error('Error getting projects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.getServicesWithFiles = getServicesWithFiles;
