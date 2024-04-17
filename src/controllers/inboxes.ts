
import { Request, Response } from 'express';
import  pool from '../services/db';
import Inboxes from '../models/Inboxes';

export async function createInbox(req: Request, res: Response): Promise<void> {
  try {


  // Extract other form data from req.body
      const {
       name, email, message, phone_number, service_type, created_from_ip
     } = req.body;
      if (
            name && email && message
      ) {
        
        // Now you can save the file path to the database along with other form data
        const client = await pool.connect();
          
            const result = await client.query<Inboxes>(
                'INSERT INTO inboxes(name, email, phone_number, service_type, message, created_from_ip) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
                [name, email, phone_number, service_type, message, created_from_ip] 
                );
          
        client.release();
        res.status(201).json(result.rows[0]);
      } else {
        res.status(400).json({ error: 'Something went wrong' });
      }

  } catch (error) {
    console.error('Error creating inbox:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// update
export async function updateInbox(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const userId = req.body.userId;
      if (!id || !userId) { 
        res.status(400).json({ error: 'Something went wrong' });
        return;
      }
        const {
            is_customer, is_responded,
        } = req.body;

        const client = await pool.connect();
        const result = await client.query<Inboxes>(
            'UPDATE inboxes SET is_customer = $1 updated_at = $2 WHERE id = $4 RETURNING *',
            [is_customer, new Date(), id]
        );
        
        client.release();
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Inbox not found' });
        }

    } catch (error) {
        console.error('Error updating inbox:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function updateInboxStatus(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const userId = req.body.userId;
      if (!id || !userId) { 
        res.status(400).json({ error: 'Something went wrong' });
        return;
      }
        const {
            is_customer,
            is_responded
        } = req.body;

        const client = await pool.connect();
        const result = await client.query<Inboxes>(
            'UPDATE inboxes SET is_responded = $1, is_customer = $2, updated_at = $3 WHERE id = $4 RETURNING *',
            [is_responded, is_customer, new Date(), id]
        );

        client.release();
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Inbox not found' });
        }

    } catch (error) {
        console.error('Error updating inbox:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

//delete
export async function deleteInbox(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const userId = req.body.userId;
      if (!id || !userId) { 
        res.status(400).json({ error: 'Something went wrong' });
        return;
      }
        const client = await pool.connect();
        const result = await client.query<Inboxes>(
            'UPDATE inboxes SET is_deleted = true, updated_at = $1 WHERE id = $2 RETURNING *',
            [new Date(), id]
        );
        
        client.release();
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Inbox not found' });
        }

    } catch (error) {
        console.error('Error deleting inbox:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// get
export async function getInboxes(req: Request, res: Response): Promise<void> {
    try {
        const userId = req.body.userId;
      if (!userId) { 
        res.status(400).json({ error: 'Something went wrong' });
        return;
      }
        const client = await pool.connect();
        const result = await client.query<Inboxes>('SELECT * FROM inboxes  WHERE is_deleted = false ORDER BY created_at DESC');
        client.release();
        res.json(result.rows);

    } catch (error) {
        console.error('Error getting inboxes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}