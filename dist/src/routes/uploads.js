"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = express_1.default.Router();
const uploadDirectory = path_1.default.join(__dirname, process.env.UPLOAD_DIRECTORY || "../../uploads"); // Anta at dette er mappen du lagrer opplastede bilder
router.get('/images/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path_1.default.join(uploadDirectory, filename);
    if (fs_1.default.existsSync(filepath)) {
        res.sendFile(filepath);
    }
    else {
        res.status(404).send('File not found');
    }
});
exports.default = router;
