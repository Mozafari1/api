
const jwt = require('jsonwebtoken');

interface DecodedToken {
  userId: number;
  userEmail: string;
  userFirstName: string;
  userLastName: string;
}

// Verify JWT token
const verifyToken = (
  token: string
): DecodedToken | null => {
  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as DecodedToken;
    return decoded;
  } catch (error) {
    // Log error for debugging purposes
    console.error('Error verifying JWT token:', error);
    return null;
  }
}
export default verifyToken;

