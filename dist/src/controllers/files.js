"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInovixLogos = exports.getInovixPrivacyImage = exports.getInovixAboutImage = exports.softDeleteFile = exports.getInovixesWithFiles = exports.UpdateInovixFile = exports.uploadInovixFile = exports.UpdateContactFile = exports.uploadContactFile = exports.UpdatePriceFile = exports.uploadPriceFile = exports.UpdateUserFile = exports.uploadUserFile = exports.UpdateServiceFile = exports.uploadServiceFile = exports.UpdateBlogFile = exports.uploadBlogFile = exports.UpdateProjectFile = exports.uploadProjectFile = exports.uploadProfileImage = exports.uploadImage = void 0;
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
async function uploadImage(req, res) {
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
            const { id, connection_id, type } = req.body;
            if (req.file && id && connection_id && type === 'service') {
                const client = await db_1.default.connect();
                const connection = await client.query('SELECT * FROM connections_type WHERE name = $1', ['Tjenester']);
                const fileResult = await client.query('INSERT INTO files(name, size, type, created_by, service_id,connection_type_id , file_name) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *', [req.file.filename, req.file.size, req.file.mimetype, userId, connection_id, connection.rows[0].id, req.file.filename]);
                const result = await client.query('UPDATE files SET is_deleted = true, updated_by = $1, updated_at = $2 WHERE id = $3 RETURNING *', [userId, new Date(), id]);
                client.release();
                res.status(201).json(fileResult.rows[0]);
            }
            else if (req.file && id && connection_id && type === 'blog') {
                const client = await db_1.default.connect();
                const connection = await client.query('SELECT * FROM connections_type WHERE name = $1', ['Blogg']);
                const fileResult = await client.query('INSERT INTO files(name, size, type, created_by, blog_id,connection_type_id , file_name) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *', [req.file.filename, req.file.size, req.file.mimetype, userId, connection_id, connection.rows[0].id, req.file.filename]);
                const result = await client.query('UPDATE files SET is_deleted = true, updated_by = $1, updated_at = $2 WHERE id = $3 RETURNING *', [userId, new Date(), id]);
                client.release();
                res.status(201).json(fileResult.rows[0]);
            }
            else if (req.file && id && connection_id && type === 'profile') {
                const client = await db_1.default.connect();
                const connection = await client.query('SELECT * FROM connections_type WHERE name = $1', ['Brukere']);
                const fileResult = await client.query('INSERT INTO files(name, size, type, created_by, user_id,connection_type_id , file_name) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *', [req.file.filename, req.file.size, req.file.mimetype, userId, connection_id, connection.rows[0].id, req.file.filename]);
                client.release();
                if (id !== 0) {
                    const client = await db_1.default.connect();
                    const result = await client.query('UPDATE files SET is_deleted = true, updated_by = $1, updated_at = $2 WHERE id = $3 RETURNING *', [userId, new Date(), id]);
                    client.release();
                }
                res.status(201).json(fileResult.rows[0]);
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
exports.uploadImage = uploadImage;
async function uploadProfileImage(req, res) {
    try {
        const userId = req.body.userId;
        if (!userId) {
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }
        // Handle file upload using multer
        upload.single('image')(req, res, async (err) => {
            if (err) {
                console.error('Error uploading file:', err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            if (req.file) {
                const client = await db_1.default.connect();
                const connection = await client.query('SELECT * FROM connections_type WHERE name = $1', ['Brukere']);
                const fileResult = await client.query('INSERT INTO files(name, size, type, created_by, user_id,connection_type_id , file_name) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *', [req.file.filename, req.file.size, req.file.mimetype, userId, userId, connection.rows[0].id, req.file.filename]);
                client.release();
                res.status(201).json(fileResult.rows[0]);
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
exports.uploadProfileImage = uploadProfileImage;
async function uploadProjectFile(req, res) {
    try {
        const userId = req.body.userId;
        if (!userId) {
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }
        // Handle file upload using multer
        upload.single('file')(req, res, async (err) => {
            if (err) {
                console.error('Error uploading file:', err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            const { id, special_type } = req.body;
            if (req.file) {
                const client = await db_1.default.connect();
                const connection = await client.query('SELECT * FROM connections_type WHERE name = $1', ['Prosjekter']);
                const fileResult = await client.query('INSERT INTO files(name, file_name, size, type, created_by, project_id,connection_type_id ,special_type) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [req.file.originalname, req.file.filename, req.file.size, req.file.mimetype, userId, id, connection.rows[0].id, special_type ? special_type : null]);
                client.release();
                res.status(201).json(fileResult.rows[0]);
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
exports.uploadProjectFile = uploadProjectFile;
async function UpdateProjectFile(req, res) {
    try {
        const userId = req.body.userId;
        const { id } = req.params;
        const { project_id, name, special_type } = req.body;
        if (!userId || !id || !project_id || !name) {
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }
        const client = await db_1.default.connect();
        // update file 
        const result = await client.query('UPDATE files SET name = $1, updated_at = $2, updated_by = $3, special_type = $4, project_id = $5 WHERE id = $6 RETURNING *', [name, new Date(), userId, special_type ? special_type : null, project_id, id]);
        client.release();
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'File not found' });
        }
        else {
            res.status(200).json(result.rows[0]);
        }
    }
    catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.UpdateProjectFile = UpdateProjectFile;
// blog file upload
async function uploadBlogFile(req, res) {
    try {
        const userId = req.body.userId;
        if (!userId) {
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }
        // Handle file upload using multer
        upload.single('file')(req, res, async (err) => {
            if (err) {
                console.error('Error uploading file:', err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            const { id, special_type } = req.body;
            if (req.file) {
                const client = await db_1.default.connect();
                const connection = await client.query('SELECT * FROM connections_type WHERE name = $1', ['Blogg']);
                const fileResult = await client.query('INSERT INTO files(name, file_name, size, type, created_by, blog_id,connection_type_id ,special_type) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [req.file.originalname, req.file.filename, req.file.size, req.file.mimetype, userId, id, connection.rows[0].id, special_type ? special_type : null]);
                client.release();
                res.status(201).json(fileResult.rows[0]);
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
exports.uploadBlogFile = uploadBlogFile;
async function UpdateBlogFile(req, res) {
    try {
        const userId = req.body.userId;
        const { id } = req.params;
        const { blog_id, name, special_type } = req.body;
        if (!userId || !id || !blog_id || !name) {
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }
        const client = await db_1.default.connect();
        // update file 
        const result = await client.query('UPDATE files SET name = $1, updated_at = $2, updated_by = $3, special_type = $4, blog_id = $5 WHERE id = $6 RETURNING *', [name, new Date(), userId, special_type ? special_type : null, blog_id, id]);
        client.release();
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'File not found' });
        }
        else {
            res.status(200).json(result.rows[0]);
        }
    }
    catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.UpdateBlogFile = UpdateBlogFile;
// service file upload
async function uploadServiceFile(req, res) {
    try {
        const userId = req.body.userId;
        if (!userId) {
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }
        // Handle file upload using multer
        upload.single('file')(req, res, async (err) => {
            if (err) {
                console.error('Error uploading file:', err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            const { id, special_type } = req.body;
            if (req.file) {
                const client = await db_1.default.connect();
                const connection = await client.query('SELECT * FROM connections_type WHERE name = $1', ['Tjenester']);
                const fileResult = await client.query('INSERT INTO files(name, file_name, size, type, created_by, service_id,connection_type_id ,special_type) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [req.file.originalname, req.file.filename, req.file.size, req.file.mimetype, userId, id, connection.rows[0].id, special_type ? special_type : null]);
                client.release();
                res.status(201).json(fileResult.rows[0]);
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
exports.uploadServiceFile = uploadServiceFile;
async function UpdateServiceFile(req, res) {
    try {
        const userId = req.body.userId;
        const { id } = req.params;
        const { service_id, name, special_type } = req.body;
        if (!userId || !id || !service_id || !name) {
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }
        const client = await db_1.default.connect();
        // update file 
        const result = await client.query('UPDATE files SET name = $1, updated_at = $2, updated_by = $3, special_type = $4, service_id = $5 WHERE id = $6 RETURNING *', [name, new Date(), userId, special_type ? special_type : null, service_id, id]);
        client.release();
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'File not found' });
        }
        else {
            res.status(200).json(result.rows[0]);
        }
    }
    catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.UpdateServiceFile = UpdateServiceFile;
// User file upload
async function uploadUserFile(req, res) {
    try {
        const userId = req.body.userId;
        if (!userId) {
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }
        // Handle file upload using multer
        upload.single('file')(req, res, async (err) => {
            if (err) {
                console.error('Error uploading file:', err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            const { id, special_type } = req.body;
            if (req.file) {
                const client = await db_1.default.connect();
                const connection = await client.query('SELECT * FROM connections_type WHERE name = $1', ['Brukere']);
                const fileResult = await client.query('INSERT INTO files(name, file_name, size, type, created_by, user_id,connection_type_id ,special_type) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [req.file.originalname, req.file.filename, req.file.size, req.file.mimetype, userId, id, connection.rows[0].id, special_type ? special_type : null]);
                client.release();
                res.status(201).json(fileResult.rows[0]);
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
exports.uploadUserFile = uploadUserFile;
async function UpdateUserFile(req, res) {
    try {
        const userId = req.body.userId;
        const { id } = req.params;
        const { user_id, name, special_type } = req.body;
        if (!userId || !id || !user_id || !name) {
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }
        const client = await db_1.default.connect();
        // update file 
        const result = await client.query('UPDATE files SET name = $1, updated_at = $2, updated_by = $3, special_type = $4, user_id = $5 WHERE id = $6 RETURNING *', [name, new Date(), userId, special_type ? special_type : null, user_id, id]);
        client.release();
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'File not found' });
        }
        else {
            res.status(200).json(result.rows[0]);
        }
    }
    catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.UpdateUserFile = UpdateUserFile;
// Price file upload
async function uploadPriceFile(req, res) {
    try {
        const userId = req.body.userId;
        if (!userId) {
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }
        // Handle file upload using multer
        upload.single('file')(req, res, async (err) => {
            if (err) {
                console.error('Error uploading file:', err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            const { id, special_type } = req.body;
            if (req.file) {
                const client = await db_1.default.connect();
                const connection = await client.query('SELECT * FROM connections_type WHERE name = $1', ['Priser']);
                const fileResult = await client.query('INSERT INTO files(name, file_name, size, type, created_by, price_id,connection_type_id ,special_type) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [req.file.originalname, req.file.filename, req.file.size, req.file.mimetype, userId, id, connection.rows[0].id, special_type ? special_type : null]);
                client.release();
                res.status(201).json(fileResult.rows[0]);
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
exports.uploadPriceFile = uploadPriceFile;
async function UpdatePriceFile(req, res) {
    try {
        const userId = req.body.userId;
        const { id } = req.params;
        const { price_id, name, special_type } = req.body;
        if (!userId || !id || !price_id || !name) {
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }
        const client = await db_1.default.connect();
        // update file 
        const result = await client.query('UPDATE files SET name = $1, updated_at = $2, updated_by = $3, special_type = $4, price_id = $5 WHERE id = $6 RETURNING *', [name, new Date(), userId, special_type ? special_type : null, price_id, id]);
        client.release();
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'File not found' });
        }
        else {
            res.status(200).json(result.rows[0]);
        }
    }
    catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.UpdatePriceFile = UpdatePriceFile;
// contacts file upload
async function uploadContactFile(req, res) {
    try {
        const userId = req.body.userId;
        if (!userId) {
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }
        // Handle file upload using multer
        upload.single('file')(req, res, async (err) => {
            if (err) {
                console.error('Error uploading file:', err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            const { id, special_type } = req.body;
            if (req.file) {
                const client = await db_1.default.connect();
                const connection = await client.query('SELECT * FROM connections_type WHERE name = $1', ['Kontakter']);
                const fileResult = await client.query('INSERT INTO files(name, file_name, size, type, created_by, contact_id,connection_type_id ,special_type) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [req.file.originalname, req.file.filename, req.file.size, req.file.mimetype, userId, id, connection.rows[0].id, special_type ? special_type : null]);
                client.release();
                res.status(201).json(fileResult.rows[0]);
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
exports.uploadContactFile = uploadContactFile;
async function UpdateContactFile(req, res) {
    try {
        const userId = req.body.userId;
        const { id } = req.params;
        const { contact_id, name, special_type } = req.body;
        if (!userId || !id || !contact_id || !name) {
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }
        const client = await db_1.default.connect();
        // update file 
        const result = await client.query('UPDATE files SET name = $1, updated_at = $2, updated_by = $3, special_type = $4, contact_id = $5 WHERE id = $6 RETURNING *', [name, new Date(), userId, special_type ? special_type : null, contact_id, id]);
        client.release();
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'File not found' });
        }
        else {
            res.status(200).json(result.rows[0]);
        }
    }
    catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.UpdateContactFile = UpdateContactFile;
// Inovix file upload
async function uploadInovixFile(req, res) {
    try {
        const userId = req.body.userId;
        if (!userId) {
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }
        // Handle file upload using multer
        upload.single('file')(req, res, async (err) => {
            if (err) {
                console.error('Error uploading file:', err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            const { special_type } = req.body;
            if (req.file && special_type) {
                const client = await db_1.default.connect();
                const connection = await client.query('SELECT * FROM connections_type WHERE name = $1', ['Kontakter']);
                const fileResult = await client.query('INSERT INTO files(name, file_name, size, type, created_by,connection_type_id ,special_type) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *', [req.file.originalname, req.file.filename, req.file.size, req.file.mimetype, userId, connection.rows[0].id, special_type]);
                client.release();
                res.status(201).json(fileResult.rows[0]);
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
exports.uploadInovixFile = uploadInovixFile;
async function UpdateInovixFile(req, res) {
    try {
        const userId = req.body.userId;
        const { id } = req.params;
        const { name, special_type } = req.body;
        if (!userId || !id || !name || !special_type) {
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }
        const client = await db_1.default.connect();
        // update file 
        const result = await client.query('UPDATE files SET name = $1, updated_at = $2, updated_by = $3, special_type = $4 WHERE id = $5 RETURNING *', [name, new Date(), userId, special_type, id]);
        client.release();
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'File not found' });
        }
        else {
            res.status(200).json(result.rows[0]);
        }
    }
    catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.UpdateInovixFile = UpdateInovixFile;
async function getInovixesWithFiles(req, res) {
    try {
        if (!req.body.userId) {
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }
        const client = await db_1.default.connect();
        const result = await client.query(`SELECT f.name AS original_name, f.file_name, f.type, f.id AS file_id, f.updated_at, f.special_type
       FROM  files f
       WHERE f.is_deleted = false AND f.special_type IS NOT NULL AND service_id IS NULL AND project_id IS NULL AND service_id IS NULL AND blog_id IS NULL AND user_id IS NULL AND price_id IS NULL AND contact_id IS NULL`);
        client.release();
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error('Error getting projects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.getInovixesWithFiles = getInovixesWithFiles;
async function softDeleteFile(req, res) {
    try {
        const { id } = req.params;
        const userId = req.body.userId;
        if (!id || !userId) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        const client = await db_1.default.connect();
        const result = await client.query('UPDATE files SET is_deleted = true, updated_at = $1, updated_by = $2 WHERE id = $3 RETURNING *', [new Date(), userId, id]);
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
exports.softDeleteFile = softDeleteFile;
async function getInovixAboutImage(req, res) {
    try {
        const client = await db_1.default.connect();
        const result = await client.query('SELECT file_name FROM files WHERE special_type = $1', ['inovix-about']);
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
exports.getInovixAboutImage = getInovixAboutImage;
async function getInovixPrivacyImage(req, res) {
    try {
        const client = await db_1.default.connect();
        const result = await client.query('SELECT file_name, name FROM files WHERE special_type = $1', ['inovix-privacy']);
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
exports.getInovixPrivacyImage = getInovixPrivacyImage;
async function getInovixLogos(req, res) {
    try {
        console.log('getInovixLogos');
        const client = await db_1.default.connect();
        const result = await client.query(`SELECT file_name, type, special_type AS name 
       FROM files 
       WHERE special_type IN ($1, $2, $3, $4, $5, $6, $7, $8) AND is_deleted = false`, ['HeaderLogo', 'BannerMainPage', 'SubBannerMainPage', 'ServiceMainPage', 'AboutUsMainPage', 'FooterLogo', 'AboutUsPage', 'Privacy']);
        console.log('result:', result);
        client.release();
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Files not found' });
        }
        else {
            const filesBySpecialType = {};
            result.rows.forEach(row => {
                // If the special_type is not yet in filesBySpecialType, initialize it with an empty array
                if (!filesBySpecialType[row.name]) {
                    filesBySpecialType[row.name] = [];
                }
                // Add the current file to the array for the special_type
                filesBySpecialType[row.name].push({
                    file_name: row.file_name,
                    type: row.type,
                });
            });
            res.status(200).json(filesBySpecialType);
        }
    }
    catch (error) {
        console.error('Error getting files:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.getInovixLogos = getInovixLogos;
