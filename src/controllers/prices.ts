
import { Request, Response } from 'express';
import Price from '../models/Price';
import  pool from '../services/db';


export async function createPrice(req: Request, res: Response): Promise<void> {
  try {
     const userId = req.body.userId;
   if (!userId ) {
      res.status(400).json({ error: 'Something went wrong' });
      return;
   }
   
  // Extract other form data from req.body
    const {package_name, title, price, description, pointA, pointB, pointC, pointD, pointE } = req.body;
      if (package_name && title && price && description && pointA && pointB && pointC && pointD && pointE  ) {
    
        // Now you can save the file path to the database along with other form data
        const client = await pool.connect();
        const result = await client.query<Price>(
          'INSERT INTO prices(package_name, title, price, description, "pointA", "pointB", "pointC", "pointD", "pointE", created_by) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
          [package_name, title, price, description, pointA, pointB, pointC, pointD, pointE, userId, ]
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

export async function updatePrice(req: Request, res: Response): Promise<void> {
  try {
              const { id } = req.params;
        const userId = req.body.userId;
    if (
     !userId || !id
    ) {
      res.status(400).json({ error: 'Something went wrong' });
      return;
    }

        const { package_name, title, price, description, pointA, pointB, pointC, pointD, pointE } = req.body;
        if (!package_name || !title || !price || !description || !pointA || !pointB || !pointC || !pointD || !pointE || !id) { 
        res.status(400).json({ error: 'Missing required fields' });
        return;
        }
        const client = await pool.connect();
        const result = await client.query<Price>(
        'UPDATE prices SET package_name = $1, title = $2, price = $3, description = $4, "pointA" = $5, "pointB" = $6, "pointC" = $7, "pointD" = $8, "pointE" = $9, updated_at = $10, updated_by = $11 WHERE id = $12 RETURNING *',
        [package_name, title, price, description, pointA, pointB, pointC, pointD, pointE, new Date(), userId, id]
        );
        client.release();
        if (result.rowCount === 0) {
        res.status(404).json({ error: 'Price not found' });
        } else {
        res.status(200).json(result.rows[0]);
        }
    } catch (error) {
        console.error('Error updating price:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
    
export async function deletePrice(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const userId = req.body.userId;
        if (!id || !userId) {
          res.status(400).json({ error: 'Missing required fields' });
          return;
         }

        const client = await pool.connect();
        const result = await client.query<Price>(
        'UPDATE prices SET is_deleted = true, updated_at = $1, updated_by = $2 WHERE id = $3 RETURNING *',
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

export async function getPrice(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.body.userId;
    if (!id || !userId) { 
      res.status(400).json({ error: 'Something went wrong' });
      return;
    }
       
        const client = await pool.connect();
        const result = await client.query<Price>('SELECT * FROM prices WHERE id = $1', [id]);
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

export async function getPrices(req: Request, res: Response): Promise<void> {
    try {
        const client = await pool.connect();
        const result = await client.query<Price>('SELECT id, package_name, updated_at, title, price, description, "pointA","pointB", "pointC", "pointD", "pointE"  FROM prices WHERE is_deleted = false order by id ASC');
        client.release();
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error getting prices:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
export async function getPricesWithFiles(req: Request, res: Response): Promise<void> {
  try {
    if (!req.body.userId) {
      res.status(400).json({ error: 'Something went wrong' });
      return;
    }

    const client = await pool.connect();
  
    const result = await client.query<Price & File>(
      `SELECT p.id, p.package_name AS name, f.name AS original_name, f.file_name, f.type, f.id AS file_id, f.updated_at, f.special_type
       FROM prices p
       LEFT JOIN files f ON p.id = f.price_id AND f.is_deleted = false
       WHERE p.is_deleted = false`
    );
    client.release();
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}