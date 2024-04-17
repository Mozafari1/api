"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyToken_1 = __importDefault(require("../jwt/verifyToken")); // Importer verifyToken-funksjonen
const feedbacks_1 = require("../controllers/feedbacks");
const verifyFeedbackToken_1 = __importDefault(require("../jwt/verifyFeedbackToken"));
const router = express_1.default.Router();
// Endepunkter som krever tokenverifisering
router.post('/create-feedback', (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Hent JWT-token fra Authorization-header
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const decodedToken = (0, verifyToken_1.default)(token); // Verifiser JWT-tokenet
    if (!decodedToken) {
        return res.status(403).json({ error: 'Failed to authenticate token' });
    }
    // Legg til bruker-ID i forespørselsobjektet
    req.body.userId = decodedToken.userId;
    // Fortsett til neste mellomvare/rutebehandling
    next();
}, feedbacks_1.createFeedback); // Bruk createBlog-kontrolleren
router.put('/approve-feedback/:id', (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const decodedToken = (0, verifyToken_1.default)(token);
    if (!decodedToken) {
        return res.status(403).json({ error: 'Failed to authenticate token' });
    }
    console.log(decodedToken);
    req.body.userId = decodedToken.userId;
    next();
}, feedbacks_1.approveFeedback);
router.delete('/delete-feedback/:id', (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const decodedToken = (0, verifyToken_1.default)(token);
    if (!decodedToken) {
        return res.status(403).json({ error: 'Failed to authenticate token' });
    }
    req.body.userId = decodedToken.userId;
    next();
}, feedbacks_1.deleteFeedback);
router.get('/get-all-feedbacks', (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const decodedToken = (0, verifyToken_1.default)(token);
    if (!decodedToken) {
        return res.status(403).json({ error: 'Failed to authenticate token' });
    }
    req.body.userId = decodedToken.userId;
    next();
}, feedbacks_1.getAllFeedbacks);
// Endepunkter som ikke krever tokenverifisering
router.get('/get-feedbacks', feedbacks_1.getFeedbacks);
router.put('/feedback-from-token', async (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const decodedToken = await (0, verifyFeedbackToken_1.default)(token);
    if (!decodedToken) {
        return res.status(403).json({ error: 'Failed to authenticate token' });
    }
    req.body.feedbackId = decodedToken.feedbackId;
    next();
}, feedbacks_1.updateFeedbackFromToken);
exports.default = router;
