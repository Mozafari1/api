"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyToken_1 = __importDefault(require("../jwt/verifyToken")); // Importer verifyToken-funksjonen
const services_1 = require("../controllers/services");
const router = express_1.default.Router();
// Endepunkter som krever tokenverifisering
router.post('/create-service', (req, res, next) => {
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
}, services_1.createService); // Bruk createBlog-kontrolleren
router.put('/update-service/:id', (req, res, next) => {
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
}, services_1.updateService);
router.delete('/delete-service/:id', (req, res, next) => {
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
}, services_1.deleteService);
router.get('/get-services-files', (req, res, next) => {
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
}, services_1.getServicesWithFiles);
router.get('/get-service-list', services_1.getServiceList);
// Andre ruter
router.get('/get-services', services_1.getServices);
exports.default = router;
