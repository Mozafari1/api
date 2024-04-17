import express from 'express';
import verifyToken from '../jwt/verifyToken'; // Importer verifyToken-funksjonen
import { createProject, deleteProject, getProjects, getProjectsWithFiles, updateProject } from '../controllers/projects';


const router = express.Router();

// Endepunkter som krever tokenverifisering
router.post('/create-project', (req, res, next) => {
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
}, createProject); // Bruk createBlog-kontrolleren

router.put('/update-project/:id', (req, res, next) => { 
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
}, updateProject);

router.delete('/delete-project/:id', (
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
        
}, deleteProject);

router.get('/get-projects-files',(
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
        
}, getProjectsWithFiles);
router.get('/get-projects', getProjects);


export default router;