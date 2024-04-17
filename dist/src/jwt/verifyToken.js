"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
// Verify JWT token
const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        return decoded;
    }
    catch (error) {
        // Log error for debugging purposes
        console.error('Error verifying JWT token:', error);
        return null;
    }
};
exports.default = verifyToken;
