import express from 'express';

import verifyToken from '../jwt/verifyToken'; // Importer verifyToken-funksjonen
import { createService, deleteService, getServiceList, getServices, updateService,getServicesWithFiles } from '../controllers/services';

const router = express.Router();

// Endepunkter som krever tokenverifisering
router.post('/create-service', (req, res, next) => {
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
}, createService); // Bruk createBlog-kontrolleren


router.put('/update-service/:id', (req, res, next) => { 
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
    
},updateService);
router.delete('/delete-service/:id', (
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
    , deleteService);

 router.get('/get-services-files',(
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
        
}, getServicesWithFiles);
router.get('/get-service-list', getServiceList);
// Andre ruter
router.get('/get-services', getServices);

export default router;
