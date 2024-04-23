import express from 'express';
import cors from 'cors';
import router from '../routes';
import verifyToken from '../jwt/verifyToken';
import * as dotenv from 'dotenv';
import checkFeedbackTokenValidity from '../jwt/verifyFeedbackToken';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000 ;


app.use(cors());
app.use(express.json());


// API endpoint for user token validation
app.post("/api/validate-token", (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return res.status(403).json({ error: 'Failed to authenticate token' });
  }

  // If token is valid, proceed with the request
  next();
}, (req: express.Request, res: express.Response) => {
  res.status(200).json({ message: "Token is valid" });
});

// API endpoint for feedback token validation
app.post("/api/validate-feedback-token", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]; 
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const decodedToken = await checkFeedbackTokenValidity(token); // Legg til await her
  if (!decodedToken) {
    return res.status(403).json({ error: 'Failed to authenticate token' });
  }
  next();
}, (req: express.Request, res: express.Response) => {
  
  res.status(200).json({ message: "Token is valid" });
});


app.use(router);

app.get('/', (req, res) => {
  console.log('Root route hit');  // Logg dette for å bekrefte at ruten treffes
  res.send('Welcome to the API');
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
