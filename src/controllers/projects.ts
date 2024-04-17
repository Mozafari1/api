
import { Request, Response } from 'express';
import Project from '../models/Project';
import  pool from '../services/db';
import File from '../models/File';


export async function createProject(req: Request, res: Response): Promise<void> {
  try {
   if (!req.body.userId ) {
      res.status(400).json({ error: 'Something went wrong' });
      return;
   }
    const userId = req.body.userId;

  // Extract other form data from req.body
    const {name, domain_name, status, service_type,contact_id  } = req.body;

      if (name && domain_name && status && service_type && contact_id ) {
   
        // Now you can save the file path to the database along with other form data
        const client = await pool.connect();
          const result = await client.query<Project>(
              'INSERT INTO projects(name, domain_name, status, service_type, contact_id, created_by) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
              [name, domain_name, status, service_type, contact_id, userId] 
            );
        client.release();
        res.status(201).json(result.rows[0]);
      } else {
        res.status(400).json({ error: 'Something went wrong' });
      }

  } catch (error) {
    console.error('Error creating price:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


export async function updateProject(req: Request, res: Response): Promise<void> {
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
        const client = await pool.connect();
        const result = await client.query<Project>(
        'UPDATE projects SET name = $1, domain_name = $2, status = $3, service_type = $4, contact_id = $5, updated_at = $6, updated_by = $7 WHERE id = $8 RETURNING *',
        [name, domain_name, status, service_type, contact_id, new Date(), userId, id]
        );
        client.release();
        if (result.rowCount === 0) {
        res.status(404).json({ error: 'Project not found' });
        } else {
        res.status(200).json(result.rows[0]);
        }
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function deleteProject(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.body.userId;
    if (!userId || !id) { 
      res.status(400).json({ error: 'Something went wrong' });
      return;
    }
    const client = await pool.connect();
    const result = await client.query<Project>(
      'UPDATE projects SET is_deleted = true, updated_at = $1, updated_by = $2 WHERE id = $3 RETURNING *',
      [new Date(), userId, id]
    );
    client.release();
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Project not found' });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
export async function getProjects(req: Request, res: Response): Promise<void> {
  try {
    const client = await pool.connect();
    const result = await client.query<Project>('SELECT p.id,p.name, p.domain_name, p.status, p.service_type, p.updated_at, p.contact_id, c.first_name, c.last_name, c.email, c.phone_number FROM projects p JOIN contacts c ON p.contact_id = c.id WHERE p.is_deleted = false');
    client.release();
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getProjectsWithFiles(req: Request, res: Response): Promise<void> {
  try {
    if (!req.body.userId) {
      res.status(400).json({ error: 'Something went wrong' });
      return;
    }

    const client = await pool.connect();
  
    const result = await client.query<Project & File>(
      `SELECT p.id, p.name, f.name AS original_name, f.file_name, f.type, f.id AS file_id, f.updated_at, f.special_type
       FROM projects p
       LEFT JOIN files f ON p.id = f.project_id AND f.is_deleted = false
       WHERE p.is_deleted = false`
    );
    client.release();
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
