import express from 'express';
import verifyToken from '../jwt/verifyToken'; // Importer verifyToken-funksjonen
import { createServiceType } from '../controllers/servicetypes';

const router = express.Router();

// Endepunkter som krever tokenverifisering
router.post('/create-service-type', (req, res, next) => {
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
}, createServiceType); // Bruk createBlog-kontrolleren


export default router;