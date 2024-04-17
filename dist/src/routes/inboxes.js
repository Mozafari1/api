"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inboxes_1 = require("../controllers/inboxes");
const verifyToken_1 = __importDefault(require("../jwt/verifyToken"));
const router = express_1.default.Router();
router.post('/create-inbox', inboxes_1.createInbox);
router.get('/get-inboxes', (req, res, next) => {
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
}, inboxes_1.getInboxes);
//update 
router.put('/update-inbox/:id', (req, res, next) => {
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
}, inboxes_1.updateInbox);
router.put('/update-inbox-status/:id', (req, res, next) => {
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
}, inboxes_1.updateInboxStatus);
//delete
router.delete('/delete-inbox/:id', (req, res, next) => {
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
}, inboxes_1.deleteInbox);
exports.default = router;
