import { Request, Response } from 'express';
import  pool from '../services/db';
import Feedback from '../models/Feedback';
const jwt = require('jsonwebtoken');



export async function createFeedback(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.body.userId;
    if (!userId) {
      res.status(400).json({ error: 'Something went wrong' });
      return;
    }

    const { name, contact_id, domain } = req.body;
    if (!name || !contact_id) {
      res.status(400).json({ error: 'Invalid request data' });
      return;
    }

    const client = await pool.connect();
    const result = await client.query<Feedback>(
      'INSERT INTO feedbacks(name, contact_id, created_by,updated_by, is_active, is_sent) VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      [name, contact_id, userId, userId, true, true]
    );

    const feedbackId = result.rows[0].id;

    // Generate JWT token with feedback ID
    const token = jwt.sign({ feedbackId }, process.env.JWT_SECRET_KEY_FEEDBACK);

    // Update the feedback record with the generated URL containing the feedback ID
    await client.query(
      'UPDATE feedbacks SET url = $1 WHERE id = $2',
      [`${domain}/feedback/${token}`, feedbackId]
    );

    client.release();

    // Send the feedback link to the user
    const feedbackLink = `${domain}/feedback/${token}`;
    console.log(feedbackLink);
    // Send feedbackLink to the user...

    res.status(201).json({ id: feedbackId, url: feedbackLink });
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function approveFeedback(req: Request, res: Response): Promise<void> {
    try {
        if (!req.body.userId) { 
        res.status(400).json({ error: 'Something went wrong' });
        return;
        }
        const userId = req.body.userId;
        const { id } = req.params;
       console.log(id);
        if (!id ) { 
        res.status(400).json({ error: 'Missing required fields' });
        return;
        }
        const client = await pool.connect();
        const result = await client.query<Feedback>(
            'UPDATE feedbacks SET is_approved = $1, approved_at = $2, updated_at = $3, updated_by = $4, is_waiting = $5 WHERE id = $6 RETURNING *',
            [true, new Date(), new Date(), userId, false, id]
        );
        client.release();
        if (result.rowCount === 0) {
        res.status(404).json({ error: 'Feedback not found' });
        } else {
        res.status(200).json(result.rows[0]);
        }
    } catch (error) {
        console.error('Error updating feedback:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function deleteFeedback(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const userId = req.body.userId;
        if (!id || !userId) {
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }
            const client = await pool.connect();
            const result = await client.query<Feedback>('UPDATE feedbacks SET is_deleted = true, updated_at = $1, updated_by = $2 WHERE id = $3 RETURNING *', [new Date(), userId, id]);
            client.release();
            if (result.rowCount === 0) {
            res.status(404).json({ error: 'Feedback not found' });
            } else {
            res.status(200).json(result.rows[0]);
            }
        } catch (error) {
            console.error('Error deleting feedback:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
}
    
export async function getAllFeedbacks(req: Request, res: Response): Promise<void> {
    //get all and check user id 
    try {
       if (!req.body.userId) { 
        res.status(400).json({ error: 'Something went wrong' });
           return;
       }
        const client = await pool.connect();
        const result = await client.query<Feedback>('SELECT id, name, role, feedback, created_at, is_sent, url, is_approved, approved_at, is_waiting FROM feedbacks WHERE is_deleted = false');
        client.release();
        res.status(200).json(result.rows);

    } catch (error) {
        console.error('Error getting feedbacks:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getFeedbacks(req: Request, res: Response): Promise<void> {
    try {
        // getlist of feedbacks where is approved is true and is_deleted is false
        const client = await pool.connect();
        const result = await client.query<Feedback>('SELECT id, name, role, feedback FROM feedbacks WHERE is_deleted = false AND is_approved = true');
        client.release();
        res.status(200).json(result.rows);


    } catch (error) {
        console.error('Error getting feedback:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// update feedback

export async function updateFeedbackFromToken(req: Request, res: Response): Promise<void> {
    try {
        const feedbackId = req.body.feedbackId;
        
        if (!feedbackId) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        const { name, role, feedback } = req.body;
        console.log(req.body);
        const client = await pool.connect();
        const result = await client.query<Feedback>(
            'UPDATE feedbacks SET name = $1, role = $2, feedback = $3, updated_at = $4, is_waiting = $5, is_sent = $6, url = $7, is_active = $8  WHERE id = $9 RETURNING *',
            [name, role, feedback, new Date(), true, false, null, false, feedbackId]
        );
        client.release();

        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Feedback not found' });
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (error) {
        console.error('Error updating feedback:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}