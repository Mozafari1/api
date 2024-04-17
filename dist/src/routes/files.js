"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyToken_1 = __importDefault(require("../jwt/verifyToken")); // Importer verifyToken-funksjonen
const files_1 = require("../controllers/files");
const router = express_1.default.Router();
// Endepunkter som krever tokenverifisering
router.post('/upload-image', (req, res, next) => {
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
}, files_1.uploadImage);
router.post('/upload-profile-image', (req, res, next) => {
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
}, files_1.uploadProfileImage);
router.post('/add-project-file', (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Hent JWT-token fra Authorization-header
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const decodedToken = (0, verifyToken_1.default)(token); // Verifiser JWT-tokenet
    if (!decodedToken) {
        return res.status(403).json({ error: 'Failed to authenticate token' });
    }
    req.body.userId = decodedToken.userId;
    // Fortsett til neste mellomvare/rutebehandling
    next();
}, files_1.uploadProjectFile);
router.put('/update-project-file/:id', (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Hent JWT-token fra Authorization-header
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const decodedToken = (0, verifyToken_1.default)(token); // Verifiser JWT-tokenet
    if (!decodedToken) {
        return res.status(403).json({ error: 'Failed to authenticate token' });
    }
    req.body.userId = decodedToken.userId;
    // Fortsett til neste mellomvare/rutebehandling
    next();
}, files_1.UpdateProjectFile);
//blog 
router.post('/add-blog-file', (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Hent JWT-token fra Authorization-header
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const decodedToken = (0, verifyToken_1.default)(token); // Verifiser JWT-tokenet
    if (!decodedToken) {
        return res.status(403).json({ error: 'Failed to authenticate token' });
    }
    req.body.userId = decodedToken.userId;
    // Fortsett til neste mellomvare/rutebehandling
    next();
}, files_1.uploadBlogFile);
router.put('/update-blog-file/:id', (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Hent JWT-token fra Authorization-header
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const decodedToken = (0, verifyToken_1.default)(token); // Verifiser JWT-tokenet
    if (!decodedToken) {
        return res.status(403).json({ error: 'Failed to authenticate token' });
    }
    req.body.userId = decodedToken.userId;
    // Fortsett til neste mellomvare/rutebehandling
    next();
}, files_1.UpdateBlogFile);
// service 
router.post('/add-service-file', (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Hent JWT-token fra Authorization-header
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const decodedToken = (0, verifyToken_1.default)(token); // Verifiser JWT-tokenet
    if (!decodedToken) {
        return res.status(403).json({ error: 'Failed to authenticate token' });
    }
    req.body.userId = decodedToken.userId;
    // Fortsett til neste mellomvare/rutebehandling
    next();
}, files_1.uploadServiceFile);
router.put('/update-service-file/:id', (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Hent JWT-token fra Authorization-header
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const decodedToken = (0, verifyToken_1.default)(token); // Verifiser JWT-tokenet
    if (!decodedToken) {
        return res.status(403).json({ error: 'Failed to authenticate token' });
    }
    req.body.userId = decodedToken.userId;
    // Fortsett til neste mellomvare/rutebehandling
    next();
}, files_1.UpdateServiceFile);
//Price
router.post('/add-price-file', (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Hent JWT-token fra Authorization-header
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const decodedToken = (0, verifyToken_1.default)(token); // Verifiser JWT-tokenet
    if (!decodedToken) {
        return res.status(403).json({ error: 'Failed to authenticate token' });
    }
    req.body.userId = decodedToken.userId;
    // Fortsett til neste mellomvare/rutebehandling
    next();
}, files_1.uploadPriceFile);
router.put('/update-price-file/:id', (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Hent JWT-token fra Authorization-header
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const decodedToken = (0, verifyToken_1.default)(token); // Verifiser JWT-tokenet
    if (!decodedToken) {
        return res.status(403).json({ error: 'Failed to authenticate token' });
    }
    req.body.userId = decodedToken.userId;
    // Fortsett til neste mellomvare/rutebehandling
    next();
}, files_1.UpdatePriceFile);
//User
router.post('/add-user-file', (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Hent JWT-token fra Authorization-header
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const decodedToken = (0, verifyToken_1.default)(token); // Verifiser JWT-tokenet
    if (!decodedToken) {
        return res.status(403).json({ error: 'Failed to authenticate token' });
    }
    req.body.userId = decodedToken.userId;
    // Fortsett til neste mellomvare/rutebehandling
    next();
}, files_1.uploadUserFile);
router.put('/update-user-file/:id', (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Hent JWT-token fra Authorization-header
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const decodedToken = (0, verifyToken_1.default)(token); // Verifiser JWT-tokenet
    if (!decodedToken) {
        return res.status(403).json({ error: 'Failed to authenticate token' });
    }
    req.body.userId = decodedToken.userId;
    // Fortsett til neste mellomvare/rutebehandling
    next();
}, files_1.UpdateUserFile);
//Contact
router.post('/add-contact-file', (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Hent JWT-token fra Authorization-header
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const decodedToken = (0, verifyToken_1.default)(token); // Verifiser JWT-tokenet
    if (!decodedToken) {
        return res.status(403).json({ error: 'Failed to authenticate token' });
    }
    req.body.userId = decodedToken.userId;
    // Fortsett til neste mellomvare/rutebehandling
    next();
}, files_1.uploadContactFile);
router.put('/update-contact-file/:id', (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Hent JWT-token fra Authorization-header
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const decodedToken = (0, verifyToken_1.default)(token); // Verifiser JWT-tokenet
    if (!decodedToken) {
        return res.status(403).json({ error: 'Failed to authenticate token' });
    }
    req.body.userId = decodedToken.userId;
    // Fortsett til neste mellomvare/rutebehandling
    next();
}, files_1.UpdateContactFile);
//Inovix
router.post('/add-inovix-file', (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Hent JWT-token fra Authorization-header
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const decodedToken = (0, verifyToken_1.default)(token); // Verifiser JWT-tokenet
    if (!decodedToken) {
        return res.status(403).json({ error: 'Failed to authenticate token' });
    }
    req.body.userId = decodedToken.userId;
    // Fortsett til neste mellomvare/rutebehandling
    next();
}, files_1.uploadInovixFile);
router.put('/update-inovix-file/:id', (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Hent JWT-token fra Authorization-header
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const decodedToken = (0, verifyToken_1.default)(token); // Verifiser JWT-tokenet
    if (!decodedToken) {
        return res.status(403).json({ error: 'Failed to authenticate token' });
    }
    req.body.userId = decodedToken.userId;
    // Fortsett til neste mellomvare/rutebehandling
    next();
}, files_1.UpdateInovixFile);
router.get('/get-inovixes-files', (req, res, next) => {
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
}, files_1.getInovixesWithFiles);
router.delete('/delete-file-from-folder/:id', (req, res, next) => {
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
}, files_1.softDeleteFile);
router.get('/about-image-invoix', files_1.getInovixAboutImage);
router.get('/privacy-image-invoix', files_1.getInovixPrivacyImage);
router.get('/get-logos', files_1.getInovixLogos);
exports.default = router;
