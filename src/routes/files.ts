import express from 'express';
import verifyToken from '../jwt/verifyToken'; // Importer verifyToken-funksjonen
import { UpdateBlogFile, getInovixesWithFiles, softDeleteFile,UpdateContactFile, UpdateInovixFile, UpdatePriceFile, UpdateProjectFile, UpdateServiceFile, UpdateUserFile, uploadBlogFile, uploadContactFile, uploadImage, uploadInovixFile, uploadPriceFile, uploadProfileImage, uploadProjectFile, uploadServiceFile, uploadUserFile, getInovixAboutImage, getInovixPrivacyImage, getInovixLogos } from '../controllers/files';

const router = express.Router();

// Endepunkter som krever tokenverifisering
router.post('/upload-image', (req, res, next) => {
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
}, uploadImage); 

router.post('/upload-profile-image', (req, res, next) => {
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
}, uploadProfileImage); 

router.post('/add-project-file', (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Hent JWT-token fra Authorization-header
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const decodedToken = verifyToken(token); // Verifiser JWT-tokenet
  if (!decodedToken) {
    return res.status(403).json({ error: 'Failed to authenticate token' });
  }
  req.body.userId = decodedToken.userId;
  // Fortsett til neste mellomvare/rutebehandling
  next();
}, uploadProjectFile); 

router.put('/update-project-file/:id', (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Hent JWT-token fra Authorization-header
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const decodedToken = verifyToken(token); // Verifiser JWT-tokenet
  if (!decodedToken) {
    return res.status(403).json({ error: 'Failed to authenticate token' });
  }
  req.body.userId = decodedToken.userId;
  // Fortsett til neste mellomvare/rutebehandling
  next();
}, UpdateProjectFile); 
//blog 
router.post('/add-blog-file', (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Hent JWT-token fra Authorization-header
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const decodedToken = verifyToken(token); // Verifiser JWT-tokenet
  if (!decodedToken) {
    return res.status(403).json({ error: 'Failed to authenticate token' });
  }
  req.body.userId = decodedToken.userId;
  // Fortsett til neste mellomvare/rutebehandling
  next();
}, uploadBlogFile); 
router.put('/update-blog-file/:id', (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Hent JWT-token fra Authorization-header
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const decodedToken = verifyToken(token); // Verifiser JWT-tokenet
  if (!decodedToken) {
    return res.status(403).json({ error: 'Failed to authenticate token' });
  }
  req.body.userId = decodedToken.userId;
  // Fortsett til neste mellomvare/rutebehandling
  next();
}, UpdateBlogFile); 


// service 
router.post('/add-service-file', (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Hent JWT-token fra Authorization-header
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const decodedToken = verifyToken(token); // Verifiser JWT-tokenet
  if (!decodedToken) {
    return res.status(403).json({ error: 'Failed to authenticate token' });
  }
  req.body.userId = decodedToken.userId;
  // Fortsett til neste mellomvare/rutebehandling
  next();
}, uploadServiceFile); 
router.put('/update-service-file/:id', (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Hent JWT-token fra Authorization-header
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const decodedToken = verifyToken(token); // Verifiser JWT-tokenet
  if (!decodedToken) {
    return res.status(403).json({ error: 'Failed to authenticate token' });
  }
  req.body.userId = decodedToken.userId;
  // Fortsett til neste mellomvare/rutebehandling
  next();
}, UpdateServiceFile); 

//Price
router.post('/add-price-file', (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Hent JWT-token fra Authorization-header
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const decodedToken = verifyToken(token); // Verifiser JWT-tokenet
  if (!decodedToken) {
    return res.status(403).json({ error: 'Failed to authenticate token' });
  }
  req.body.userId = decodedToken.userId;
  // Fortsett til neste mellomvare/rutebehandling
  next();
}, uploadPriceFile); 
router.put('/update-price-file/:id', (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Hent JWT-token fra Authorization-header
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const decodedToken = verifyToken(token); // Verifiser JWT-tokenet
  if (!decodedToken) {
    return res.status(403).json({ error: 'Failed to authenticate token' });
  }
  req.body.userId = decodedToken.userId;
  // Fortsett til neste mellomvare/rutebehandling
  next();
}, UpdatePriceFile); 

//User
router.post('/add-user-file', (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Hent JWT-token fra Authorization-header
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const decodedToken = verifyToken(token); // Verifiser JWT-tokenet
  if (!decodedToken) {
    return res.status(403).json({ error: 'Failed to authenticate token' });
  }
  req.body.userId = decodedToken.userId;
  // Fortsett til neste mellomvare/rutebehandling
  next();
}, uploadUserFile); 
router.put('/update-user-file/:id', (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Hent JWT-token fra Authorization-header
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const decodedToken = verifyToken(token); // Verifiser JWT-tokenet
  if (!decodedToken) {
    return res.status(403).json({ error: 'Failed to authenticate token' });
  }
  req.body.userId = decodedToken.userId;
  // Fortsett til neste mellomvare/rutebehandling
  next();
}, UpdateUserFile); 

//Contact
router.post('/add-contact-file', (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Hent JWT-token fra Authorization-header
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const decodedToken = verifyToken(token); // Verifiser JWT-tokenet
  if (!decodedToken) {
    return res.status(403).json({ error: 'Failed to authenticate token' });
  }
  req.body.userId = decodedToken.userId;
  // Fortsett til neste mellomvare/rutebehandling
  next();
}, uploadContactFile); 
router.put('/update-contact-file/:id', (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Hent JWT-token fra Authorization-header
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const decodedToken = verifyToken(token); // Verifiser JWT-tokenet
  if (!decodedToken) {
    return res.status(403).json({ error: 'Failed to authenticate token' });
  }
  req.body.userId = decodedToken.userId;
  // Fortsett til neste mellomvare/rutebehandling
  next();
}, UpdateContactFile); 


//Inovix
router.post('/add-inovix-file', (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Hent JWT-token fra Authorization-header
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const decodedToken = verifyToken(token); // Verifiser JWT-tokenet
  if (!decodedToken) {
    return res.status(403).json({ error: 'Failed to authenticate token' });
  }
  req.body.userId = decodedToken.userId;
  // Fortsett til neste mellomvare/rutebehandling
  next();
}, uploadInovixFile); 

router.put('/update-inovix-file/:id', (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Hent JWT-token fra Authorization-header
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const decodedToken = verifyToken(token); // Verifiser JWT-tokenet
  if (!decodedToken) {
    return res.status(403).json({ error: 'Failed to authenticate token' });
  }
  req.body.userId = decodedToken.userId;
  // Fortsett til neste mellomvare/rutebehandling
  next();
}, UpdateInovixFile); 


router.get('/get-inovixes-files',(
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
        
}, getInovixesWithFiles);

router.delete('/delete-file-from-folder/:id', (
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
        
}, softDeleteFile);

router.get('/about-image-invoix', getInovixAboutImage);
router.get('/privacy-image-invoix', getInovixPrivacyImage);
router.get('/get-logos', getInovixLogos);
export default router;
