import express from 'express';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const uploadDirectory = path.join(__dirname, process.env.UPLOAD_DIRECTORY || "../../uploads"); // Anta at dette er mappen du lagrer opplastede bilder

router.get('/images/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(uploadDirectory, filename);
  if (fs.existsSync(filepath)) {
    res.sendFile(filepath);
  } else {
    res.status(404).send('File not found');
  }
});

export default router;