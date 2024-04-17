import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import pool from '../services/db';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import File from '../models/File';
import ConnectionsType from '../models/ConnectionsType';
type FileInfo = {
  file_name: string;
  type: string;
};

// Define the upload directory path
const uploadDirectory = path.join(__dirname, process.env.UPLOAD_PATH || "../../uploads");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}


// Define storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory); // Save files to the uploads directory
  },
  filename: function (req, file, cb) {
    const uuid = uuidv4(); // Generate UUID version 4
    const extension = path.extname(file.originalname); // Extract file extension
    cb(null, `${uuid}${extension}`); // Use UUID as the filename
  }
});

// Create multer instance with defined storage
const upload = multer({ storage: storage });

export async function uploadImage(req: Request, res: Response): Promise<void> {
  try {
   if (!req.body.userId ) {
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
        const client = await pool.connect();
        const connection = await client.query<ConnectionsType>(
            'SELECT * FROM connections_type WHERE name = $1',
          ['Tjenester']
        );

        const fileResult = await client.query<File>(
                'INSERT INTO files(name, size, type, created_by, service_id,connection_type_id , file_name) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [req.file.filename, req.file.size, req.file.mimetype, userId, connection_id, connection.rows[0].id,req.file.filename]
            );
    
        const result = await client.query<File>(
            'UPDATE files SET is_deleted = true, updated_by = $1, updated_at = $2 WHERE id = $3 RETURNING *',
          [userId, new Date(), id]
        );
        client.release();
        res.status(201).json(fileResult.rows[0]);
        
      } else if (req.file && id && connection_id && type === 'blog') {
       const client = await pool.connect();
        const connection = await client.query<ConnectionsType>(
            'SELECT * FROM connections_type WHERE name = $1',
          [ 'Blogg']
        );

        const fileResult = await client.query<File>(
                'INSERT INTO files(name, size, type, created_by, blog_id,connection_type_id , file_name) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [req.file.filename, req.file.size, req.file.mimetype, userId, connection_id, connection.rows[0].id,req.file.filename]
            );

        const result = await client.query<File>(
            'UPDATE files SET is_deleted = true, updated_by = $1, updated_at = $2 WHERE id = $3 RETURNING *',
          [userId, new Date(), id]
        );
        client.release();
        res.status(201).json(fileResult.rows[0]);
      } else if (req.file && id && connection_id && type === 'profile') {
        const client = await pool.connect();
        const connection = await client.query<ConnectionsType>(
            'SELECT * FROM connections_type WHERE name = $1',
          ['Brukere']
        );
      
        const fileResult = await client.query<File>(
                'INSERT INTO files(name, size, type, created_by, user_id,connection_type_id , file_name) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [req.file.filename, req.file.size, req.file.mimetype, userId, connection_id, connection.rows[0].id,req.file.filename]
            );

        client.release();
        if (id !== 0) {
        const client = await pool.connect();
        const result = await client.query<File>(
            'UPDATE files SET is_deleted = true, updated_by = $1, updated_at = $2 WHERE id = $3 RETURNING *',
          [userId, new Date(), id]
        );
        client.release();
        }
        res.status(201).json(fileResult.rows[0]);

    } else {
        res.status(400).json({ error: 'No file uploaded' });
      }
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


export async function uploadProfileImage(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.body.userId;
   if (!userId ) {
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
        const client = await pool.connect();
        const connection = await client.query<ConnectionsType>(
            'SELECT * FROM connections_type WHERE name = $1',
          ['Brukere']
        );
      
            const fileResult = await client.query<File>(
                'INSERT INTO files(name, size, type, created_by, user_id,connection_type_id , file_name) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [req.file.filename, req.file.size, req.file.mimetype, userId, userId, connection.rows[0].id,req.file.filename]
            );
        client.release();
        res.status(201).json(fileResult.rows[0]);
        
    } else {
        res.status(400).json({ error: 'No file uploaded' });
      }
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


export async function uploadProjectFile(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.body.userId;
   if (!userId ) {
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

        const client = await pool.connect();
        const connection = await client.query<ConnectionsType>(
            'SELECT * FROM connections_type WHERE name = $1',
          ['Prosjekter']
        );
        const fileResult = await client.query<File>(
                'INSERT INTO files(name, file_name, size, type, created_by, project_id,connection_type_id ,special_type) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
                [req.file.originalname, req.file.filename, req.file.size, req.file.mimetype, userId, id, connection.rows[0].id , special_type?special_type:null]
            );
        client.release();
        res.status(201).json(fileResult.rows[0]);
        
    } else {
        res.status(400).json({ error: 'No file uploaded' });
      }
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function UpdateProjectFile(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.body.userId;
    const { id } = req.params;
    const { project_id, name, special_type } = req.body;
   if (!userId || !id || !project_id || !name) {
      res.status(400).json({ error: 'Something went wrong' });
      return;
   }
        const client = await pool.connect();
       
    // update file 
    const result = await client.query<File>(
        'UPDATE files SET name = $1, updated_at = $2, updated_by = $3, special_type = $4, project_id = $5 WHERE id = $6 RETURNING *',
        [name, new Date(), userId, special_type?special_type: null, project_id, id]
    );
    client.release();
    if (result.rowCount === 0) {
        res.status(404).json({ error: 'File not found' });
    } else {
        res.status(200).json(result.rows[0]);
    }

  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


// blog file upload
export async function uploadBlogFile(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.body.userId;
   if (!userId ) {
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

        const client = await pool.connect();
        const connection = await client.query<ConnectionsType>(
            'SELECT * FROM connections_type WHERE name = $1',
          ['Blogg']
        );
        const fileResult = await client.query<File>(
                'INSERT INTO files(name, file_name, size, type, created_by, blog_id,connection_type_id ,special_type) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
                [req.file.originalname, req.file.filename, req.file.size, req.file.mimetype, userId, id, connection.rows[0].id , special_type?special_type:null]
            );
        client.release();
        res.status(201).json(fileResult.rows[0]);
        
    } else {
        res.status(400).json({ error: 'No file uploaded' });
      }
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function UpdateBlogFile(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.body.userId;
    const { id } = req.params;
    const { blog_id, name, special_type } = req.body;
   if (!userId || !id || !blog_id || !name) {
      res.status(400).json({ error: 'Something went wrong' });
      return;
   }
        const client = await pool.connect();
       
    // update file 
    const result = await client.query<File>(
        'UPDATE files SET name = $1, updated_at = $2, updated_by = $3, special_type = $4, blog_id = $5 WHERE id = $6 RETURNING *',
        [name, new Date(), userId, special_type?special_type: null, blog_id, id]
    );
    client.release();
    if (result.rowCount === 0) {
        res.status(404).json({ error: 'File not found' });
    } else {
        res.status(200).json(result.rows[0]);
    }

  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// service file upload

export async function uploadServiceFile(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.body.userId;
   if (!userId ) {
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

        const client = await pool.connect();
        const connection = await client.query<ConnectionsType>(
            'SELECT * FROM connections_type WHERE name = $1',
          ['Tjenester']
        );
        const fileResult = await client.query<File>(
                'INSERT INTO files(name, file_name, size, type, created_by, service_id,connection_type_id ,special_type) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
                [req.file.originalname, req.file.filename, req.file.size, req.file.mimetype, userId, id, connection.rows[0].id , special_type?special_type:null]
            );
        client.release();
        res.status(201).json(fileResult.rows[0]);
        
    } else {
        res.status(400).json({ error: 'No file uploaded' });
      }
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function UpdateServiceFile(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.body.userId;
    const { id } = req.params;
    const { service_id, name, special_type } = req.body;
   if (!userId || !id || !service_id || !name) {
      res.status(400).json({ error: 'Something went wrong' });
      return;
   }
        const client = await pool.connect();
       
    // update file 
    const result = await client.query<File>(
        'UPDATE files SET name = $1, updated_at = $2, updated_by = $3, special_type = $4, service_id = $5 WHERE id = $6 RETURNING *',
        [name, new Date(), userId, special_type?special_type: null, service_id, id]
    );
    client.release();
    if (result.rowCount === 0) {
        res.status(404).json({ error: 'File not found' });
    } else {
        res.status(200).json(result.rows[0]);
    }

  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// User file upload

export async function uploadUserFile(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.body.userId;
   if (!userId ) {
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

        const client = await pool.connect();
        const connection = await client.query<ConnectionsType>(
            'SELECT * FROM connections_type WHERE name = $1',
          ['Brukere']
        );
        const fileResult = await client.query<File>(
                'INSERT INTO files(name, file_name, size, type, created_by, user_id,connection_type_id ,special_type) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
                [req.file.originalname, req.file.filename, req.file.size, req.file.mimetype, userId, id, connection.rows[0].id , special_type?special_type:null]
            );
        client.release();
        res.status(201).json(fileResult.rows[0]);
        
    } else {
        res.status(400).json({ error: 'No file uploaded' });
      }
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function UpdateUserFile(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.body.userId;
    const { id } = req.params;
    const { user_id, name, special_type } = req.body;
   if (!userId || !id || !user_id || !name) {
      res.status(400).json({ error: 'Something went wrong' });
      return;
   }
        const client = await pool.connect();
       
    // update file 
    const result = await client.query<File>(
        'UPDATE files SET name = $1, updated_at = $2, updated_by = $3, special_type = $4, user_id = $5 WHERE id = $6 RETURNING *',
        [name, new Date(), userId, special_type?special_type: null, user_id, id]
    );
    client.release();
    if (result.rowCount === 0) {
        res.status(404).json({ error: 'File not found' });
    } else {
        res.status(200).json(result.rows[0]);
    }

  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Price file upload

export async function uploadPriceFile(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.body.userId;
   if (!userId ) {
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

        const client = await pool.connect();
        const connection = await client.query<ConnectionsType>(
            'SELECT * FROM connections_type WHERE name = $1',
          ['Priser']
        );
        const fileResult = await client.query<File>(
                'INSERT INTO files(name, file_name, size, type, created_by, price_id,connection_type_id ,special_type) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
                [req.file.originalname, req.file.filename, req.file.size, req.file.mimetype, userId, id, connection.rows[0].id , special_type?special_type:null]
            );
        client.release();
        res.status(201).json(fileResult.rows[0]);
        
    } else {
        res.status(400).json({ error: 'No file uploaded' });
      }
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function UpdatePriceFile(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.body.userId;
    const { id } = req.params;
    const { price_id, name, special_type } = req.body;
   if (!userId || !id || !price_id || !name) {
      res.status(400).json({ error: 'Something went wrong' });
      return;
   }
        const client = await pool.connect();
       
    // update file 
    const result = await client.query<File>(
        'UPDATE files SET name = $1, updated_at = $2, updated_by = $3, special_type = $4, price_id = $5 WHERE id = $6 RETURNING *',
        [name, new Date(), userId, special_type?special_type: null, price_id, id]
    );
    client.release();
    if (result.rowCount === 0) {
        res.status(404).json({ error: 'File not found' });
    } else {
        res.status(200).json(result.rows[0]);
    }

  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
// contacts file upload

export async function uploadContactFile(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.body.userId;
   if (!userId ) {
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

        const client = await pool.connect();
        const connection = await client.query<ConnectionsType>(
            'SELECT * FROM connections_type WHERE name = $1',
          ['Kontakter']
        );
        const fileResult = await client.query<File>(
                'INSERT INTO files(name, file_name, size, type, created_by, contact_id,connection_type_id ,special_type) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
                [req.file.originalname, req.file.filename, req.file.size, req.file.mimetype, userId, id, connection.rows[0].id , special_type?special_type:null]
            );
        client.release();
        res.status(201).json(fileResult.rows[0]);
        
    } else {
        res.status(400).json({ error: 'No file uploaded' });
      }
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function UpdateContactFile(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.body.userId;
    const { id } = req.params;
    const { contact_id, name, special_type } = req.body;
   if (!userId || !id || !contact_id || !name) {
      res.status(400).json({ error: 'Something went wrong' });
      return;
   }
        const client = await pool.connect();
       
    // update file 
    const result = await client.query<File>(
        'UPDATE files SET name = $1, updated_at = $2, updated_by = $3, special_type = $4, contact_id = $5 WHERE id = $6 RETURNING *',
        [name, new Date(), userId, special_type?special_type: null, contact_id, id]
    );
    client.release();
    if (result.rowCount === 0) {
        res.status(404).json({ error: 'File not found' });
    } else {
        res.status(200).json(result.rows[0]);
    }

  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Inovix file upload

export async function uploadInovixFile(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.body.userId;
   if (!userId ) {
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

        const client = await pool.connect();
        const connection = await client.query<ConnectionsType>(
            'SELECT * FROM connections_type WHERE name = $1',
          ['Kontakter']
        );
        const fileResult = await client.query<File>(
                'INSERT INTO files(name, file_name, size, type, created_by,connection_type_id ,special_type) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [req.file.originalname, req.file.filename, req.file.size, req.file.mimetype, userId, connection.rows[0].id , special_type]
            );
        client.release();
        res.status(201).json(fileResult.rows[0]);
        
    } else {
        res.status(400).json({ error: 'No file uploaded' });
      }
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function UpdateInovixFile(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.body.userId;
    const { id } = req.params;
    const { name, special_type } = req.body;
   if (!userId || !id || !name || !special_type) {
      res.status(400).json({ error: 'Something went wrong' });
      return;
   }
        const client = await pool.connect();
       
    // update file 
    const result = await client.query<File>(
        'UPDATE files SET name = $1, updated_at = $2, updated_by = $3, special_type = $4 WHERE id = $5 RETURNING *',
        [name, new Date(), userId, special_type, id]
    );
    client.release();
    if (result.rowCount === 0) {
        res.status(404).json({ error: 'File not found' });
    } else {
        res.status(200).json(result.rows[0]);
    }

  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getInovixesWithFiles(req: Request, res: Response): Promise<void> {
  try {
    if (!req.body.userId) {
      res.status(400).json({ error: 'Something went wrong' });
      return;
    }

    const client = await pool.connect();
  
    const result = await client.query<File>(
      `SELECT f.name AS original_name, f.file_name, f.type, f.id AS file_id, f.updated_at, f.special_type
       FROM  files f
       WHERE f.is_deleted = false AND f.special_type IS NOT NULL AND service_id IS NULL AND project_id IS NULL AND service_id IS NULL AND blog_id IS NULL AND user_id IS NULL AND price_id IS NULL AND contact_id IS NULL`,
    );
    client.release();
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


export async function softDeleteFile(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const userId = req.body.userId;
        if (!id || !userId) {
          res.status(400).json({ error: 'Missing required fields' });
          return;
         }

        const client = await pool.connect();
        const result = await client.query<File>(
        'UPDATE files SET is_deleted = true, updated_at = $1, updated_by = $2 WHERE id = $3 RETURNING *',
        [new Date(), userId, id]
        );
        client.release();
        if (result.rowCount === 0) {
          res.status(404).json({ error: 'Price not found' });
          return;
        } else {
          res.status(200).json(result.rows[0]);
          return;
        }
    } catch (error) {
        console.error('Error deleting price:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getInovixAboutImage(req: Request, res: Response): Promise<void> {
  try {
        const client = await pool.connect();
        const result = await client.query<File>('SELECT file_name FROM files WHERE special_type = $1', ['inovix-about']);
        client.release();
        if (result.rowCount === 0) {
        res.status(404).json({ error: 'Price not found' });
        } else {
        res.status(200).json(result.rows[0]);
        }
    } catch (error) {
        console.error('Error getting price:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getInovixPrivacyImage(req: Request, res: Response): Promise<void> {
  try {
        const client = await pool.connect();
        const result = await client.query<File>('SELECT file_name, name FROM files WHERE special_type = $1', ['inovix-privacy']);
        client.release();
        if (result.rowCount === 0) {
        res.status(404).json({ error: 'Price not found' });
        } else {
        res.status(200).json(result.rows[0]);
        }
    } catch (error) {
        console.error('Error getting price:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
export async function getInovixLogos(req: Request, res: Response): Promise<void> {
  try {
    const client = await pool.connect();
    const result = await client.query<File>(
      `SELECT file_name, type, special_type AS name 
       FROM files 
       WHERE special_type IN ($1, $2, $3, $4, $5, $6, $7, $8) AND is_deleted = false`, 
      ['HeaderLogo', 'BannerMainPage', 'SubBannerMainPage', 'ServiceMainPage', 'AboutUsMainPage', 'FooterLogo', 'AboutUsPage', 'Privacy']
    );
    client.release();
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Files not found' });
    } else {
      const filesBySpecialType: Record<string, FileInfo[]> = {};
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
  } catch (error) {
    console.error('Error getting files:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}



