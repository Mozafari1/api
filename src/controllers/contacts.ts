
import { Request, Response } from 'express';
import  pool from '../services/db';
import Contact from '../models/Contact';


export async function createContact(req: Request, res: Response): Promise<void> {
  try {
   if (!req.body.userId ) {
      res.status(400).json({ error: 'Something went wrong' });
      return;
   }
    const userId = req.body.userId;

  // Extract other form data from req.body
      const {
        first_name, last_name, email, phone_number, address,is_company, company_name, company_address, company_phone_number, company_email, company_website, company_logo
     } = req.body;
      if (
          first_name && last_name && email && phone_number
      ) {
        
        // Now you can save the file path to the database along with other form data
        const client = await pool.connect();
            const result = await client.query<Contact>(
                'INSERT INTO contacts(first_name, last_name, email, phone_number, address, is_company, company_name, company_address, company_phone_number, company_email, company_website, company_logo, created_by) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
                [first_name, last_name, email, phone_number, address, is_company, company_name, company_address, company_phone_number, company_email, company_website, company_logo, userId] 
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


export async function updateContact(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.body.userId;
      if (!userId || !id) { 
        res.status(400).json({ error: 'Something went wrong' });
        return;
      }
        const { first_name, last_name, email, phone_number, address, is_company, company_name, company_address, company_phone_number, company_email, company_website, company_logo } = req.body;
        if (!first_name || !last_name || !email || !phone_number ||!id) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        const client = await pool.connect();
        const result = await client.query<Contact>(
            'UPDATE contacts SET first_name = $1, last_name = $2, email = $3, phone_number = $4, address = $5, is_company = $6, company_name = $7, company_address = $8, company_phone_number = $9, company_email = $10, company_website = $11, company_logo = $12, updated_at = $13, updated_by = $14 WHERE id = $15 RETURNING *',
            [first_name, last_name, email, phone_number, address, is_company, company_name, company_address, company_phone_number, company_email, company_website, company_logo, new Date(), userId, id]
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

export async function deleteContact(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.body.userId;
    if (!userId || !id) {
      res.status(400).json({ error: 'Something went wrong' });
      return;
    }
    const client = await pool.connect();
    const result = await client.query<Contact>(
      'UPDATE contacts SET is_deleted = true, updated_at = $1, updated_by = $2 WHERE id = $3 RETURNING *',
      [new Date(), userId, id]
    );
    client.release();
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Contact not found' });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getContacts(req: Request, res: Response): Promise<void> {
  try {
    const client = await pool.connect();
    const result = await client.query<Contact>('SELECT * FROM contacts WHERE is_deleted = false');
    client.release();
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting contacts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}



export async function getContactList(req: Request, res: Response): Promise<void> {
  try {
    const client = await pool.connect();
    const result = await client.query<Contact>('SELECT id, first_name, last_name, email FROM contacts WHERE is_deleted = false');
    client.release();
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting contacts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getContactsWithFiles(req: Request, res: Response): Promise<void> {
  try {
    if (!req.body.userId) {
      res.status(400).json({ error: 'Something went wrong' });
      return;
    }

    const client = await pool.connect();
  
    const result = await client.query<Contact & File>(
      `SELECT c.id, c.first_name,c.last_name, f.name AS original_name, f.file_name, f.type, f.id AS file_id, f.updated_at, f.special_type
       FROM contacts c
       LEFT JOIN files f ON c.id = f.contact_id AND f.is_deleted = false
       WHERE c.is_deleted = false`
    );
    client.release();
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}