"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
const db_1 = __importDefault(require("../services/db"));
const checkFeedbackTokenValidity = async (token) => {
    try {
        const client = await db_1.default.connect();
        const feedback = await client.query('SELECT id FROM feedbacks WHERE url = $1', [token]);
        client.release();
        if (feedback.rowCount === 0) {
            return null; // Returnerer null hvis tokenet ikke finnes i databasen
        }
        const tokenData = token.split("/").pop();
        const decodedToken = jwt.verify(tokenData, process.env.JWT_SECRET_KEY_FEEDBACK); // 'feedback' er din hemmelige nøkkel
        return decodedToken;
    }
    catch (error) {
        // Hvis det oppstår en feil under validering av tokenet, eller hvis tokenet er ugyldig, returner null
        console.error('Error verifying feedback token:', error);
        return null;
    }
};
exports.default = checkFeedbackTokenValidity;
