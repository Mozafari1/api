import express from 'express';
import verifyToken from '../jwt/verifyToken'; // Importer verifyToken-funksjonen
import { createPrice, deletePrice, getPrices, updatePrice,getPricesWithFiles } from '../controllers/prices';

const router = express.Router();

router.post('/create-price', (req, res, next) => {
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
}, createPrice); 

router.put('/price-update/:id', (req, res, next) => { 
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
}, updatePrice);

router.delete('/price-delete/:id', (
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
        
}, deletePrice);

 router.get('/get-prices-files',(
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
        
 }, getPricesWithFiles);

router.get('/get-prices', getPrices);

export default router;