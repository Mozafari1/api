const jwt = require('jsonwebtoken');
import Feedback from '../models/Feedback';
import  pool from '../services/db';

interface DecodedToken {
  feedbackId: number;
}

const checkFeedbackTokenValidity = async (token: string): Promise<DecodedToken | null> => {
    try {
    
    const client = await pool.connect();
    const feedback = await client.query<Feedback>(
      'SELECT id FROM feedbacks WHERE url = $1',
      [token]
    );
    client.release(); 
    if (feedback.rowCount === 0) {
      return null; // Returnerer null hvis tokenet ikke finnes i databasen
    }
    const tokenData =token.split("/").pop();
    const decodedToken: any = jwt.verify(tokenData, process.env.JWT_SECRET_KEY_FEEDBACK) as DecodedToken; // 'feedback' er din hemmelige nøkkel
    return decodedToken;
  } catch (error) {
    // Hvis det oppstår en feil under validering av tokenet, eller hvis tokenet er ugyldig, returner null
    console.error('Error verifying feedback token:', error);
    return null;
  }
};

export default checkFeedbackTokenValidity;
