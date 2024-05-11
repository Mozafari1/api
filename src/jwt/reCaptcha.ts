import axios from 'axios';

export const verifyRecaptcha = async (token: string) => {
  const secretKey = process.env.reCAPTCHA_SECRET_KEY; 
  const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, {}, {
    params: {
      secret: secretKey,
      response: token
    }
  });
  return response.data.success; 
};