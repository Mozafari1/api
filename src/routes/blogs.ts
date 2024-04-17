import express from 'express';
import { createBlog, getBlog, updateBlog, deleteBlog, getAllBlogs, getBlogsWithFiles } from '../controllers/blogs';
import verifyToken from '../jwt/verifyToken'; // Importer verifyToken-funksjonen

const router = express.Router();

// Endepunkter som krever tokenverifisering
router.post('/create-blog', (req, res, next) => {
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
}, createBlog); // Bruk createBlog-kontrolleren


router.put('/blog-update/:id', (req, res, next) => { 
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
    
},updateBlog);
router.delete('/blog-delete/:id', (
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
    , deleteBlog);

    router.get('/get-blogs-files',(
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
        
}, getBlogsWithFiles);
// Andre ruter
router.get('/blogs', getAllBlogs);
router.get('/blog/:id', getBlog);
export default router;
