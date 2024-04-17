"use strict";
// //server.ts
// import express from 'express';
// import cors from 'cors';
// import router from '../routes';
// const app = express();
// const PORT = process.env.PORT || 4000;
// app.use(cors());
// app.use(express.json());
// app.use(router);
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
// // src/routes/index.ts
// import express from 'express';
// import blogsRouter from './blogs';
// import usersRouter from './users';
// const router = express.Router();
// router.use(blogsRouter);
// router.use(usersRouter);
// export default router;
// // src/routes/users.ts
// import express from 'express';
// import UserController from '../controllers/users';
// import verifyToken from '../jwt/verifyToken';
// const router = express.Router();
// router.post('/users-create', UserController.createUser);
// router.post('/users-login', UserController.loginUser);
// router.get('/user-by-id', verifyToken, UserController.getUserById);
// export default router;
// // users.ts controller
// import { Request, Response } from 'express';
// import pool from '../services/db';
// import User from '../models/User';
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// // Funksjon for å generere JWT-token
// const generateToken = (
//     userId: number,
//     userEmail: string,
//     userFirstName: string,
//     userLastName: string
// ): string => {
//     const secretKey = process.env.JWT_SECRET
//         ? process.env.JWT_SECRET : 'secret';
//     // Bruk en miljøvariabel for å lagre hemmeligheten
//     const token = jwt.sign({
//         userId,
//         userEmail,
//         userFirstName,
//         userLastName
//     }, secretKey, { expiresIn: '1h' });
//     return token;
// };
// const UserController = {
//        async loginUser(req: Request, res: Response): Promise<Response> {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ error: 'Both email and password are required' });
//     }
//     // Sjekk om brukeren eksisterer i databasen og om den er aktiv og ikke slettet
//     const client = await pool.connect();
//     const result = await client.query<User>(
//       'SELECT * FROM users WHERE email = $1',
//       [email]
//     );
//     if (result.rows.length === 0) {
//       client.release();
//       return res.status(401).json({ error: 'Invalid email or password' });
//     }
//     const user = result.rows[0];
//     if (!user.active) {
//       client.release();
//       return res.status(401).json({ error: 'User account is not active' });
//     }
//     if (user.is_deleted) {
//       client.release();
//       return res.status(401).json({ error: 'User account is deleted' });
//     }
//     const passwordMatch = await bcrypt.compare(password, user.password);
//     if (!passwordMatch) {
//       // Oppdater antall mislykkede forsøk og blokker brukeren hvis nødvendig
//       await client.query(
//         'UPDATE users SET failed_login_attempts = failed_login_attempts + 1 WHERE id = $1',
//         [user.id]
//       );
//       const updatedUser = await client.query<User>(
//         'SELECT * FROM users WHERE id = $1',
//         [user.id]
//       );
//       if (updatedUser.rows[0].failed_login_attempts >= 3) {
//         // Sett en flagg eller blokker brukeren midlertidig
//         // Du kan også implementere andre tiltak som å sende en e-post til brukeren eller varsle administratorer
//       }
//       client.release();
//       return res.status(401).json({ error: 'Invalid email or password' });
//     }
//     // Logg inn vellykket, oppdater last_login og nullstill mislykkede forsøk
//     await client.query(
//       'UPDATE users SET last_login = $1, failed_login_attempts = 0 WHERE id = $2',
//       [new Date(), user.id]
//     );
//     client.release();
//     // Generer JWT-token og returner det
// const token = generateToken(
//     user.id,
//     user.email,
//     user.first_name,
//     user.last_name
// );
//     return res.status(200).json({ token });
//   } catch (error) {
//     console.error('Error logging in user:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// },
// }
// export default UserController;
// // jwt.verify(token, secretOrPublicKey, [options, callback])
// import { Request, Response, NextFunction } from 'express';
// const jwt = require('jsonwebtoken');
// const verifyToken = (req: Request, res: Response, next: NextFunction) => {
//   const token = req.headers.authorization?.split(' ')[1]; // Get token from Authorization header
//   if (!token) {
//     return res.status(401).json({ error: 'No token provided' });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: number }; // Verify token with your secret key
//     req.body.userId = decoded.userId; // Add userId to request body
//     next(); // Move to next middleware
//   } catch (error) {
//     return res.status(403).json({ error: 'Failed to authenticate token' });
//   }
// };
// export default verifyToken;
