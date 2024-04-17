import express from 'express';
import verifyToken from '../jwt/verifyToken'; // Importer verifyToken-funksjonen
import { approveFeedback, createFeedback, deleteFeedback, getAllFeedbacks, getFeedbacks, updateFeedbackFromToken } from '../controllers/feedbacks';
import checkFeedbackTokenValidity from '../jwt/verifyFeedbackToken';


const router = express.Router();

// Endepunkter som krever tokenverifisering
router.post('/create-feedback', (req, res, next) => {
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
}
    , createFeedback); // Bruk createBlog-kontrolleren

    router.put('/approve-feedback/:id', (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; 
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const decodedToken = verifyToken(token); 
    if (!decodedToken) {
        return res.status(403).json({ error: 'Failed to authenticate token' });
    }
    console.log(decodedToken);
    req.body.userId = decodedToken.userId;
    next();
    
}
        , approveFeedback);
    
router.delete('/delete-feedback/:id', (
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
    , deleteFeedback);

router.get('/get-all-feedbacks', (
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
    , getAllFeedbacks);

                
// Endepunkter som ikke krever tokenverifisering

router.get('/get-feedbacks', getFeedbacks);

router.put('/feedback-from-token',async (
    req, res, next) => { 
        const token = req.headers.authorization?.split(' ')[1]; 
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const decodedToken = await checkFeedbackTokenValidity(token); 
        if (!decodedToken) {
            return res.status(403).json({ error: 'Failed to authenticate token' });
        }
        req.body.feedbackId = decodedToken.feedbackId;
        next();
        
}
, updateFeedbackFromToken);

export default router;