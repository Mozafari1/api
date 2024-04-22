// users.ts controller
import { Request, Response } from 'express';
import pool from '../services/db';
import User from '../models/User';
import File from '../models/File';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Funksjon for å generere JWT-token
export const generateToken = (
  userId: number,
  userEmail: string,
  userFirstName: string,
  userLastName: string,
  userRole: string,
  userProfilePictureId?: number,
  userProfilePictureType?: string,
  userProfilePictureName?: string,
): string => {
  const secretKey = process.env.JWT_SECRET_KEY;
  const token = jwt.sign(
    {
      userId,
      userEmail,
      userFirstName,
      userLastName,
      userRole,
      userProfilePictureId,
      userProfilePictureType,
      userProfilePictureName,
    },
    secretKey,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  return token;
};

const UserController = {
    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const { first_name, last_name, email, password, code } = req.body;
            if (!first_name || !last_name || !email || !password || !code) {
                res.status(400).json({ error: 'All fields are required' });
                return;
            }

            // Sjekk om brukeren allerede eksisterer
            const client = await pool.connect();
            const resEx = await client.query<User>(
                `SELECT * FROM users WHERE email = $1`,
                [email]
            );

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

            const newUser: Omit<User, 'id'> = {
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

            const result = await client.query<User>(
                `INSERT INTO users 
                (first_name, last_name, email, password, code, active, is_deleted, failed_login_attempts, created_at, created_by, updated_at, updated_by) 
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
                RETURNING *`,
                [
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

                ]
            );
            client.release();
            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

 
    async RegisterUser(req: Request, res: Response): Promise<void> {
      try {
        const userId = req.body.userId;
        if (!userId) { 
          res.status(400).json({ error: 'Something went wrong' });
          return;
        }
            const { first_name, last_name, email, password, phone_number, role, active } = req.body;
            if ( !first_name || !last_name || !email || !password ) {
                res.status(400).json({ error: 'All fields are required' });
                return;
            }

            // Sjekk om brukeren allerede eksisterer
            const client = await pool.connect();
            const resEx = await client.query<User>(
                `SELECT * FROM users WHERE email = $1`,
                [email]
            );

            if (resEx.rows.length > 0) {
                res.status(400).json({ error: 'Error' });
                return;
            }

            // Code validation
          
            const saltRounds = 14;
            const salt = await bcrypt.genSalt(saltRounds);
            // Hash passordet med det genererte saltet
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser: Omit<User, 'id'> = {
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

            const result = await client.query<User>(
                `INSERT INTO users 
                (first_name, last_name, email, password, role, active, is_deleted, failed_login_attempts, created_at, created_by, updated_at, updated_by, phone_number) 
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12 , $13) 
                RETURNING *`,
                [
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
                ]
            );
            client.release();
            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

   async loginUser(req: Request, res: Response): Promise<Response> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Both email and password are required' });
    }

    // Sjekk om brukeren eksisterer i databasen og om den er aktiv og ikke slettet
    const client = await pool.connect();
    const result = await client.query<User>(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

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
      await client.query(
        'UPDATE users SET failed_login_attempts = failed_login_attempts + 1 WHERE id = $1',
        [user.id]
      );

      const updatedUser = await client.query<User>(
        'SELECT * FROM users WHERE id = $1',
        [user.id]
      );

      if (updatedUser.rows[0].failed_login_attempts >= 3) {
        // Sett en flagg eller blokker brukeren midlertidig
        // Du kan også implementere andre tiltak som å sende en e-post til brukeren eller varsle administratorer
      }

      client.release();
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Logg inn vellykket, oppdater last_login og nullstill mislykkede forsøk
    await client.query(
      'UPDATE users SET last_seen = $1, failed_login_attempts = 0 WHERE id = $2',
      [new Date(), user.id]
    );
    
     const userProfile = await client.query<File>(
      'SELECT id, type, name FROM files WHERE user_id = $1 AND is_deleted = false LIMIT 1',
      [user.id]
     );
    
    client.release();
    // const fileId = userProfile.rows[0]?.id;
    // const fileType = userProfile.rows[0]?.type;
    // const fileName = userProfile.rows[0]?.name;

 console.log('User:', user);
const token = generateToken(
    user.id,
    user.email,
    user.first_name,
    user.last_name,
  user.role || 'user',
  // fileId,
  // fileType,
  // fileName
);
  console.log('Token:', token);
    return res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
  },
  // udpate
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id, first_name, last_name, email, password, phone_number, role , active} = req.body;
      const userId = req.body.userId;
      if (!id || !userId || !first_name || !last_name || !email) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }
     

      if(password !== null){
        const saltRounds = 14;
        const salt = await bcrypt.genSalt(saltRounds);
        // Hash passordet med det genererte saltet
        const hashedPassword = await bcrypt.hash(password, salt);
        const client = await pool.connect();
        const result = await client.query<User>(
          'UPDATE users SET first_name = $1, last_name = $2, email = $3, updated_at = $4, updated_by = $5, phone_number = $6, role = $7, password = $8, active = $9 WHERE id = $10 RETURNING *',
          [first_name, last_name, email, new Date(), userId, phone_number, role, hashedPassword,active, id]
        );
        client.release();
        if (result.rowCount === 0) {
          res.status(404).json({ error: 'User not found' });
        } else {
          res.status(200).json(result.rows[0]);
        }

      } else {
        const client = await pool.connect();
        const result = await client.query<User>(
          'UPDATE users SET first_name = $1, last_name = $2, email = $3, updated_at = $4, updated_by = $5, phone_number = $6, role = $7, active = $8 WHERE id = $9 RETURNING *',
          [first_name, last_name, email, new Date(), userId, phone_number, role, active, id]
        );
        client.release();
        if (result.rowCount === 0) {
          res.status(404).json({ error: 'User not found' });
        } else {
          res.status(200).json(result.rows[0]);
      }
    }
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

    // get user by id
  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      if (!req.body.userId) {
        res.status(400).json({ error: 'Something went wrong' });
        return;
      }
    const client = await pool.connect();
    const result = await client.query<User>('SELECT id, first_name, last_name, email, phone_number, active, role FROM users');
    client.release();
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Internal server error' });
    }
  },

   async getUserProfile(req: Request, res: Response): Promise<Response> {
     try {
        const userId = req.body.userId;
        if (!userId) {
          return res.status(400).json({ error: 'Something went wrong' });
        }
       // join with user with files where user_id on files are equal to id on user
       const client = await pool.connect();
        const result = await client.query<User & File>(
            `SELECT u.id, u.first_name, u.last_name, u.email, u.role, f.name AS file_name, f.type AS file_type, f.id AS file_id
             FROM users u
             LEFT JOIN files f ON u.id = f.user_id
             WHERE u.id = $1`, [userId]
        );
        return res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error getting user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
   },
   
 async getUsersWithFiles(req: Request, res: Response): Promise<void> {
  try {
    if (!req.body.userId) {
      res.status(400).json({ error: 'Something went wrong' });
      return;
    }

    const client = await pool.connect();
  
    const result = await client.query<User & File>(
      `SELECT u.id, u.first_name, u.last_name, f.name AS original_name, f.file_name, f.type, f.id AS file_id, f.updated_at, f.special_type
       FROM users u
       LEFT JOIN files f ON u.id = f.user_id AND f.is_deleted = false
       WHERE u.is_deleted = false`
    );
    client.release();
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 
};

export default UserController;
