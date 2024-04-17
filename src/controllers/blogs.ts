import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import pool from '../services/db';
import Blog from '../models/Blog';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import ConnectionsType from '../models/ConnectionsType';

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

export async function createBlog(req: Request, res: Response): Promise<void> {
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

      // Extract other form data from req.body
      const { title, description, sub_description, sub_sub_description } = req.body;
    
      // If file is uploaded, save the file to the server
      if (req.file && title && description ) {
  
     
        // Now you can save the file path to the database along with other form data
        const client = await pool.connect();
        const connection_id = await client.query<ConnectionsType>(
            'SELECT * FROM connections_type WHERE name = $1',
          ['Blogg']
        );

        const result = await client.query<Blog>(
          'INSERT INTO blogs(title, description, sub_description, sub_sub_description, created_by, updated_by) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
          [title, description, sub_description, sub_sub_description, userId, userId]
        );
      
        const fileResult = await client.query<File>(
                'INSERT INTO files(name, size, type, created_by, blog_id, connection_type_id, file_name) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [req.file.filename, req.file.size, req.file.mimetype, userId, result.rows[0].id, connection_id.rows[0].id, req.file.filename]
            );
       client.release();
        res.status(201).json(result.rows[0]);
      } else {
        res.status(400).json({ error: 'No file uploaded' });
      }
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}



export async function updateBlog(req: Request, res: Response): Promise<void> {
  try {
    if (!req.body.userId) { 
      res.status(400).json({ error: 'Something went wrong' });
      return;
    }
    const userId = req.body.userId;
    const { id } = req.params;
    const { title, description, sub_description, sub_sub_description } = req.body;
    if (!title || !description || !id) { 
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    const client = await pool.connect();
    const result = await client.query<Blog>(
      'UPDATE blogs SET title = $1, description = $2, sub_description = $3, sub_sub_description = $4, updated_at = $5, updated_by = $6 WHERE id = $7 RETURNING *',
      [title, description, sub_description, sub_sub_description, new Date(), userId, id]
    );
    client.release();
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Blog not found' });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteBlog(req: Request, res: Response): Promise<void> {
  try {
      const { id } = req.params;
      const userId = req.body.userId;
    if (!id || !userId) {
        res.status(400).json({ error: 'Something went wrong' });
        return;
    }
    const client = await pool.connect();
    const result = await client.query<Blog>('UPDATE blogs SET is_deleted = true, updated_by = $1, updated_at = $2 WHERE id = $3 RETURNING *', [userId, new Date(), id]);
    client.release();
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Blog not found' });
    } else {
      res.status(200).json({ message: 'Blog deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getBlog(req: Request, res: Response): Promise<void> {
  try {
    if (!req.params.id) { 
      res.status(400).json({ error: 'Something went wrong' });
      return;
    }
    const { id } = req.params;
    const client = await pool.connect();
   
     const result = await client.query<Blog & File>(
      `SELECT b.id, b.title, b.description, b.sub_description, b.sub_sub_description, f.name AS file_name, f.type AS file_type, f.id AS file_id
       FROM blogs b
       LEFT JOIN files f ON b.id = f.blog_id
       WHERE b.is_deleted = false AND f.is_deleted = false AND b.id = $1`,
      [id]
    );
    client.release();
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Blog not found' });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getAllBlogs(req: Request, res: Response): Promise<void> {
  try {
    const client = await pool.connect();
    // join the files table to get the file details
    const result = await client.query<Blog & File>(
      `SELECT b.id, b.title, b.description, b.sub_description, b.sub_sub_description ,b.updated_at, b.created_at, f.name AS file_name, f.type AS file_type, f.id AS file_id
       FROM blogs b
       LEFT JOIN files f ON b.id = f.blog_id
       WHERE b.is_deleted = false AND f.is_deleted = false`
    );
    client.release();
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getBlogsWithFiles(req: Request, res: Response): Promise<void> {
  try {
    if (!req.body.userId) {
      res.status(400).json({ error: 'Something went wrong' });
      return;
    }

    const client = await pool.connect();
  
    const result = await client.query<Blog & File>(
      `SELECT b.id, b.title AS name, f.name AS original_name, f.file_name, f.type, f.id AS file_id, f.updated_at, f.special_type
       FROM blogs b
       LEFT JOIN files f ON b.id = f.blog_id AND f.is_deleted = false
       WHERE b.is_deleted = false`
    );
    client.release();
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}