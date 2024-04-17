
import { Request, Response } from 'express';

import  pool from '../services/db';
import ServiceTypes from '../models/ServiceTypes';


export async function createServiceType(req: Request, res: Response): Promise<void> {
  try {
   if (!req.body.userId ) {
      res.status(400).json({ error: 'Something went wrong' });
      return;
   }
    const userId = req.body.userId;
  // Extract other form data from req.body
    const {value, label } = req.body;
      if ( value && label) {
        // Now you can save the file path to the database along with other form data
        const client = await pool.connect();
        const result = await client.query<ServiceTypes>(
          'INSERT INTO service-types(value, label, created_by) VALUES($1, $2, $3) RETURNING *',
          [value, label, userId, ]
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

export async function updateServiceType(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const userId = req.body.userId;
        const { value, label } = req.body;
        if (!value || !label || !id) { 
        res.status(400).json({ error: 'Missing required fields' });
        return;
        }
        const client = await pool.connect();
        const result = await client.query<ServiceTypes>(
        'UPDATE service-types SET value = $1, label = $2, updated_at = $3, updated_by = $4 WHERE id = $5 RETURNING *',
        [value, label, new Date(), userId, id]
        );
        client.release();
        if (result.rowCount === 0) {
        res.status(404).json({ error: 'Service Type not found' });
        } else {
        res.status(200).json(result.rows[0]);
        }
    } catch (error) {
        console.error('Error updating service type:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function deleteServiceType(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const client = await pool.connect();
        const result = await client.query<ServiceTypes>('DELETE FROM service-types WHERE id = $1 RETURNING *', [id]);
        client.release();
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Service Type not found' });
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (error) {
        console.error('Error deleting service type:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getServiceType(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const client = await pool.connect();
        const result = await client.query<ServiceTypes>('SELECT * FROM service-types WHERE id = $1', [id]);
        client.release();
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Service Type not found' });
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (error) {
        console.error('Error getting service type:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getServiceTypes(req: Request, res: Response): Promise<void> {
    try {
        const client = await pool.connect();
        const result = await client.query<ServiceTypes>('SELECT * FROM service-types WHERE is_deleted = false');
        client.release();
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error getting service types:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
