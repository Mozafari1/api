import express from 'express';
import { createInbox, deleteInbox, getInboxes, updateInbox, updateInboxStatus } from '../controllers/inboxes';
import verifyToken from '../jwt/verifyToken';
const router = express.Router();

router.post('/create-inbox',createInbox );

router.get('/get-inboxes',  (
    req, res, next) => { 
        const token = req.headers.authorization?.split(' ')[1]; 
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const decodedToken = verifyToken(token); 
        if (!decodedToken) {
            return res.status(403).json({ error: 'Failed to authenticate token' });
        }
        
        req.body.userId = decodedToken.userId;
        next();
        
}, getInboxes);

//update 
router.put('/update-inbox/:id', (req, res, next) => { 
    const token = req.headers.authorization?.split(' ')[1]; 
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const decodedToken = verifyToken(token); 
    if (!decodedToken) {
        return res.status(403).json({ error: 'Failed to authenticate token' });
    }
    
    req.body.userId = decodedToken.userId;
    next();
}, updateInbox);

router.put('/update-inbox-status/:id', (req, res, next) => { 
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = verifyToken(token); 
    if (!decodedToken) {
        return res.status(403).json({ error: 'Failed to authenticate token' });
    }
    
    req.body.userId = decodedToken.userId;
    next();
}, updateInboxStatus);


//delete
router.delete('/delete-inbox/:id', (
    req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1]; 
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const decodedToken = verifyToken(token); 
        if (!decodedToken) {
            return res.status(403).json({ error: 'Failed to authenticate token' });
        }
        
        req.body.userId = decodedToken.userId;
        next();
        
    }
    , deleteInbox);
    
export default router;
