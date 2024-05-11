"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRecaptcha = void 0;
const axios_1 = __importDefault(require("axios"));
const verifyRecaptcha = async (token) => {
    const secretKey = process.env.reCAPTCHA_SECRET_KEY;
    const response = await axios_1.default.post(`https://www.google.com/recaptcha/api/siteverify`, {}, {
        params: {
            secret: secretKey,
            response: token
        }
    });
    return response.data.success;
};
exports.verifyRecaptcha = verifyRecaptcha;
