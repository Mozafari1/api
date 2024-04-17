
import { Request, Response } from 'express';

import pool from '../services/db';
import Blog from '../models/Blog';
import Service from '../models/Service';
import Price from '../models/Price';
import User from '../models/User';
import Contact from '../models/Contact';
import Project from '../models/Project';
import Inboxes from '../models/Inboxes';
import Feedback from '../models/Feedback';


export async function getCountedAndNewData(req: Request, res: Response): Promise<void> {
    try {
        if (!req.body.userId) { 
            res.status(400).json({ error: 'Something went wrong' });
            return;
        }
        const client = await pool.connect();
        const services = await client.query<Service>(
            `SELECT 
             COUNT(*) AS total_count,
             COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) AS last_7_days_count,
             MAX(created_at) AS latest
             FROM services WHERE is_deleted = false`
        );
        const prices = await client.query<Price>(
            `SELECT 
             COUNT(*) AS total_count,
             COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) AS last_7_days_count,
             MAX(created_at) AS latest
             FROM prices WHERE is_deleted = false`
        );
        const users = await client.query<User>(
            `SELECT 
             COUNT(*) AS total_count,
             COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) AS last_7_days_count,
             MAX(created_at) AS latest
             FROM users WHERE is_deleted = false`
        );
        const contacts = await client.query<Contact>(
            `SELECT 
             COUNT(*) AS total_count,
             COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) AS last_7_days_count,
             MAX(created_at) AS latest
             FROM contacts WHERE is_deleted = false`
        );
        const projects = await client.query<Project>(
            `SELECT 
             COUNT(*) AS total_count,
             COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) AS last_7_days_count,
             MAX(created_at) AS latest
             FROM projects WHERE is_deleted = false`
        );
        const blogs = await client.query<Blog>(
            `SELECT 
             COUNT(*) AS total_count,
             COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) AS last_7_days_count,
             MAX(created_at) AS latest
             FROM blogs WHERE is_deleted = false`
        );
        const inboxes = await client.query<Inboxes>(
            `SELECT 
             COUNT(*) AS total_count,
             COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) AS last_7_days_count,
             MAX(created_at) AS latest
             FROM inboxes WHERE is_deleted = false`
        );
        const files = await client.query<File>(
            `SELECT 
             COUNT(*) AS total_count,
             COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) AS last_7_days_count,
             MAX(created_at) AS latest
             FROM files WHERE is_deleted = false`
        );

        const feedbacks = await client.query<Feedback>(
            `SELECT 
             COUNT(*) AS total_count,
             COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) AS last_7_days_count,
             MAX(created_at) AS latest
             FROM feedbacks WHERE is_deleted = false`
        );
        client.release();
        res.status(200).json({ services: services.rows[0], prices: prices.rows[0], users: users.rows[0], contacts: contacts.rows[0], projects: projects.rows[0], blogs: blogs.rows[0], inboxes: inboxes.rows[0], files: files.rows[0], feedbacks: feedbacks.rows[0] });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}