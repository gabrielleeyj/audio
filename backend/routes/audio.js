const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { authenticateToken } = require('../middleware/auth');
const { uploadToS3, listS3Objects, getS3ObjectStream, deleteS3Object } = require('../utils/s3Helper'); // S3 helpers
require('dotenv').config();

const router = express.Router();

// Set up multer storage and file size limit (2MB) for local storage
const storageLocal = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.user.id;
    const userDir = `./audio/${userId}`;

    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    cb(null, userDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// Configure in-memory storage for S3 uploads
const storageS3 = multer.memoryStorage();

// Configure multer with a 2MB limit
const upload = multer({
  storage: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? storageS3 : storageLocal,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('audio/')) {
      return cb(new Error('Only audio files are allowed'), false);
    }
    cb(null, true);
  }
});

// Upload an audio file (POST /audio/upload)
router.post('/upload', authenticateToken, upload.single('audio'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const userId = req.user.id;

    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      // Upload to S3
      const s3Result = await uploadToS3(userId, req.file);
      const metadata = {
        name: req.file.originalname,
        size: req.file.size,
        location: s3Result.Location
      };
      res.status(201).json({ message: 'File uploaded to S3', metadata });
    } else {
      // Save locally
      const userDir = `./audio/${userId}`;
      const filePath = path.join(userDir, req.file.originalname);
      
      const metadata = {
        name: req.file.originalname,
        size: req.file.size,
        location: filePath
      };
      res.status(201).json({ message: 'File uploaded locally', metadata });
    }
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Get list of audio files uploaded by the user (GET /audio)
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    // List files from S3
    try {
      const files = await listS3Objects(userId);
      res.json({ files });
    } catch (err) {
      res.status(500).json({ error: 'Failed to list files from S3' });
    }
  } else {
    // List files from local directory
    const userDir = `./audio/${userId}`;

    if (fs.existsSync(userDir)) {
      const files = fs.readdirSync(userDir).map((fileName) => {
        const filePath = path.join(userDir, fileName);
        const stats = fs.statSync(filePath);
        return {
          name: fileName,
          size: stats.size,
          location: filePath
        };
      });
      res.json({ files });
    } else {
      res.json({ files: [] });
    }
  }
});

// Play an audio file (GET /audio/play/:fileName)
router.get('/play/:fileName', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const fileName = req.params.fileName;

  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    // Stream audio file from S3
    try {
      const stream = await getS3ObjectStream(userId, fileName);
      stream.pipe(res);
    } catch (err) {
      res.status(404).json({ error: 'File not found in S3' });
    }
  } else {
    // Serve the file from the local filesystem
    const filePath = path.join(__dirname, `../audio/${userId}/${fileName}`);

    if (fs.existsSync(filePath)) {
      res.sendFile(filePath, { root: '.' });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  }
});

// Delete an audio file (DELETE /audio/:fileName)
router.delete('/:fileName', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const fileName = req.params.fileName;

  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    // Delete file from S3
    try {
      await deleteS3Object(userId, fileName);
      res.status(204).send();
    } catch (err) {
      res.status(404).json({ error: 'File not found in S3' });
    }
  } else {
    // Delete the file locally
    const filePath = path.join(__dirname, `../audio/${userId}/${fileName}`);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  }
});

module.exports = router;

