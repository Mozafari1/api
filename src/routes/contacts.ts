import express from 'express';
import verifyToken from '../jwt/verifyToken'; // Importer verifyToken-funksjonen
import { createContact, deleteContact, getContactList, getContacts, updateContact, getContactsWithFiles } from '../controllers/contacts';


const router = express.Router();

// Endepunkter som krever tokenverifisering
router.post('/create-contact', (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Hent JWT-token fra Authorization-header
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
    const decodedToken = verifyToken(token); // Verifiser JWT-tokenet
    
  if (!decodedToken) {
    return res.status(403).json({ error: 'Failed to authenticate token' });
  }
  // Legg til bruker-ID i forespørselsobjektet
  req.body.userId = decodedToken.userId;
  // Fortsett til neste mellomvare/rutebehandling
  next();
}, createContact); // Bruk createBlog-kontrolleren

router.put('/update-contact/:id', (req, res, next) => { 
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
}, updateContact);

router.delete('/delete-contact/:id', (
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
        
}, deleteContact);


router.get('/get-contacts',  (
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
        
}, getContacts);
router.get('/get-contact-list',  (
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
        
}, getContactList);

    router.get('/get-contacts-files',(
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
        
}, getContactsWithFiles);
export default router;