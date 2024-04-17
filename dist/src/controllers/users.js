"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const db_1 = __importDefault(require("../services/db"));
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// Funksjon for å generere JWT-token
const generateToken = (userId, userEmail, userFirstName, userLastName, userRole, userProfilePictureId, userProfilePictureType, userProfilePictureName) => {
    const secretKey = process.env.JWT_SECRET_KEY;
    const token = jwt.sign({
        userId,
        userEmail,
        userFirstName,
        userLastName,
        userRole,
        userProfilePictureId,
        userProfilePictureType,
        userProfilePictureName,
    }, secretKey, { expiresIn: process.env.JWT_EXPIRES_IN });
    return token;
};
exports.generateToken = generateToken;
const UserController = {
    async createUser(req, res) {
        try {
            const { first_name, last_name, email, password, code } = req.body;
            if (!first_name || !last_name || !email || !password || !code) {
                res.status(400).json({ error: 'All fields are required' });
                return;
            }
            // Sjekk om brukeren allerede eksisterer
            const client = await db_1.default.connect();
            const resEx = await client.query(`SELECT * FROM users WHERE email = $1`, [email]);
            if (resEx.rows.length > 0) {
                res.status(400).json({ error: 'Error' });
                return;
            }
            // Code validation
            if (code !== "jf45F!fo2@") {
                res.status(400).json({ error: 'Error' });
                return;
            }
            const saltRounds = 14;
            const salt = await bcrypt.genSalt(saltRounds);
            // Hash passordet med det genererte saltet
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = {
                first_name,
                last_name,
                email,
                password: hashedPassword,
                code,
                active: true,
                is_deleted: false,
                failed_login_attempts: 0,
                created_at: new Date(),
                created_by: 1,
                updated_at: new Date(),
                updated_by: 1,
            };
            const result = await client.query(`INSERT INTO users 
                (first_name, last_name, email, password, code, active, is_deleted, failed_login_attempts, created_at, created_by, updated_at, updated_by) 
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
                RETURNING *`, [
                newUser.first_name,
                newUser.last_name,
                newUser.email,
                newUser.password,
                newUser.code,
                newUser.active,
                newUser.is_deleted,
                newUser.failed_login_attempts,
                newUser.created_at,
                newUser.created_by,
                newUser.updated_at,
                newUser.updated_by
            ]);
            client.release();
            res.status(201).json(result.rows[0]);
        }
        catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async RegisterUser(req, res) {
        try {
            const userId = req.body.userId;
            if (!userId) {
                res.status(400).json({ error: 'Something went wrong' });
                return;
            }
            const { first_name, last_name, email, password, phone_number, role, active } = req.body;
            if (!first_name || !last_name || !email || !password) {
                res.status(400).json({ error: 'All fields are required' });
                return;
            }
            // Sjekk om brukeren allerede eksisterer
            const client = await db_1.default.connect();
            const resEx = await client.query(`SELECT * FROM users WHERE email = $1`, [email]);
            if (resEx.rows.length > 0) {
                res.status(400).json({ error: 'Error' });
                return;
            }
            // Code validation
            const saltRounds = 14;
            const salt = await bcrypt.genSalt(saltRounds);
            // Hash passordet med det genererte saltet
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = {
                first_name,
                last_name,
                email,
                password: hashedPassword,
                active: active,
                phone_number: phone_number,
                role: role,
                is_deleted: false,
                failed_login_attempts: 0,
                created_at: new Date(),
                created_by: userId,
                updated_at: new Date(),
                updated_by: userId,
            };
            const result = await client.query(`INSERT INTO users 
                (first_name, last_name, email, password, role, active, is_deleted, failed_login_attempts, created_at, created_by, updated_at, updated_by, phone_number) 
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12 , $13) 
                RETURNING *`, [
                newUser.first_name,
                newUser.last_name,
                newUser.email,
                newUser.password,
                newUser.role,
                newUser.active,
                newUser.is_deleted,
                newUser.failed_login_attempts,
                newUser.created_at,
                newUser.created_by,
                newUser.updated_at,
                newUser.updated_by,
                newUser.phone_number
            ]);
            client.release();
            res.status(201).json(result.rows[0]);
        }
        catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async loginUser(req, res) {
        var _a, _b, _c;
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: 'Both email and password are required' });
            }
            // Sjekk om brukeren eksisterer i databasen og om den er aktiv og ikke slettet
            const client = await db_1.default.connect();
            const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
            if (result.rows.length === 0) {
                client.release();
                return res.status(401).json({ error: 'Invalid email or password' });
            }
            const user = result.rows[0];
            if (!user.active) {
                client.release();
                return res.status(401).json({ error: 'User account is not active' });
            }
            if (user.is_deleted) {
                client.release();
                return res.status(401).json({ error: 'User account is deleted' });
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                // Oppdater antall mislykkede forsøk og blokker brukeren hvis nødvendig
                await client.query('UPDATE users SET failed_login_attempts = failed_login_attempts + 1 WHERE id = $1', [user.id]);
                const updatedUser = await client.query('SELECT * FROM users WHERE id = $1', [user.id]);
                if (updatedUser.rows[0].failed_login_attempts >= 3) {
                    // Sett en flagg eller blokker brukeren midlertidig
                    // Du kan også implementere andre tiltak som å sende en e-post til brukeren eller varsle administratorer
                }
                client.release();
                return res.status(401).json({ error: 'Invalid email or password' });
            }
            // Logg inn vellykket, oppdater last_login og nullstill mislykkede forsøk
            await client.query('UPDATE users SET last_seen = $1, failed_login_attempts = 0 WHERE id = $2', [new Date(), user.id]);
            const userProfile = await client.query('SELECT id, type, name FROM files WHERE user_id = $1 AND is_deleted = false LIMIT 1', [user.id]);
            client.release();
            const fileId = (_a = userProfile.rows[0]) === null || _a === void 0 ? void 0 : _a.id;
            const fileType = (_b = userProfile.rows[0]) === null || _b === void 0 ? void 0 : _b.type;
            const fileName = (_c = userProfile.rows[0]) === null || _c === void 0 ? void 0 : _c.name;
            const token = (0, exports.generateToken)(user.id, user.email, user.first_name, user.last_name, user.role || 'user', fileId, fileType, fileName);
            return res.status(200).json({ token });
        }
        catch (error) {
            console.error('Error logging in user:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    // udpate
    async updateUser(req, res) {
        try {
            const { id, first_name, last_name, email, password, phone_number, role, active } = req.body;
            const userId = req.body.userId;
            if (!id || !userId || !first_name || !last_name || !email) {
                res.status(400).json({ error: 'Missing required fields' });
                return;
            }
            if (password !== null) {
                const saltRounds = 14;
                const salt = await bcrypt.genSalt(saltRounds);
                // Hash passordet med det genererte saltet
                const hashedPassword = await bcrypt.hash(password, salt);
                const client = await db_1.default.connect();
                const result = await client.query('UPDATE users SET first_name = $1, last_name = $2, email = $3, updated_at = $4, updated_by = $5, phone_number = $6, role = $7, password = $8, active = $9 WHERE id = $10 RETURNING *', [first_name, last_name, email, new Date(), userId, phone_number, role, hashedPassword, active, id]);
                client.release();
                if (result.rowCount === 0) {
                    res.status(404).json({ error: 'User not found' });
                }
                else {
                    res.status(200).json(result.rows[0]);
                }
            }
            else {
                const client = await db_1.default.connect();
                const result = await client.query('UPDATE users SET first_name = $1, last_name = $2, email = $3, updated_at = $4, updated_by = $5, phone_number = $6, role = $7, active = $8 WHERE id = $9 RETURNING *', [first_name, last_name, email, new Date(), userId, phone_number, role, active, id]);
                client.release();
                if (result.rowCount === 0) {
                    res.status(404).json({ error: 'User not found' });
                }
                else {
                    res.status(200).json(result.rows[0]);
                }
            }
        }
        catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    // get user by id
    async getUsers(req, res) {
        try {
            if (!req.body.userId) {
                res.status(400).json({ error: 'Something went wrong' });
                return;
            }
            const client = await db_1.default.connect();
            const result = await client.query('SELECT id, first_name, last_name, email, phone_number, active, role FROM users');
            client.release();
            res.status(200).json(result.rows);
        }
        catch (error) {
            console.error('Error getting users:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async getUserProfile(req, res) {
        try {
            const userId = req.body.userId;
            if (!userId) {
                return res.status(400).json({ error: 'Something went wrong' });
            }
            // join with user with files where user_id on files are equal to id on user
            const client = await db_1.default.connect();
            const result = await client.query(`SELECT u.id, u.first_name, u.last_name, u.email, u.role, f.name AS file_name, f.type AS file_type, f.id AS file_id
             FROM users u
             LEFT JOIN files f ON u.id = f.user_id
             WHERE u.id = $1`, [userId]);
            return res.status(200).json(result.rows[0]);
        }
        catch (error) {
            console.error('Error getting user:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    async getUsersWithFiles(req, res) {
        try {
            if (!req.body.userId) {
                res.status(400).json({ error: 'Something went wrong' });
                return;
            }
            const client = await db_1.default.connect();
            const result = await client.query(`SELECT u.id, u.first_name, u.last_name, f.name AS original_name, f.file_name, f.type, f.id AS file_id, f.updated_at, f.special_type
       FROM users u
       LEFT JOIN files f ON u.id = f.user_id AND f.is_deleted = false
       WHERE u.is_deleted = false`);
            client.release();
            res.status(200).json(result.rows);
        }
        catch (error) {
            console.error('Error getting projects:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};
exports.default = UserController;
