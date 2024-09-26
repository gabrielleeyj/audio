// Mock AWS SDK
jest.mock('@aws-sdk/client-s3', () => ({
    S3Client: jest.fn(),
    PutObjectCommand: jest.fn(),
    ListObjectsV2Command: jest.fn(),
    GetObjectCommand: jest.fn(),
    DeleteObjectCommand: jest.fn(),
  }));
  
  // Mock the s3Helper module
  jest.mock('../../utils/s3Helper', () => ({
    uploadToS3: jest.fn(),
    listS3Objects: jest.fn(),
    getS3ObjectStream: jest.fn(),
    deleteS3Object: jest.fn(),
  }));
  
const request = require('supertest');
const express = require('express');
const path = require('path');

// Mock the required modules
jest.mock('../../middleware/auth');
jest.mock('fs', () => ({
  existsSync: jest.fn(() => true),
  readdirSync: jest.fn(() => ['test.mp3']),
  statSync: jest.fn(() => ({ size: 1024 })),
  createReadStream: jest.fn(() => ({
    pipe: jest.fn(),
    on: jest.fn((event, callback) => {
      if (event === 'end') {
        callback();
      }
    }),
  })),
  createWriteStream: jest.fn(() => ({ 
    write: jest.fn(),
    end: jest.fn(),
    on: jest.fn(),
    once: jest.fn(),
    removeListener: jest.fn(),
  })),
  unlinkSync: jest.fn(),
  mkdirSync: jest.fn(),
}));

// Mock multer
jest.mock('multer', () => {
    const multer = () => ({
      single: () => (req, res, next) => {
        req.file = {
          fieldname: 'audio',
          originalname: 'test.mp3',
          encoding: '7bit',
          mimetype: 'audio/mpeg',
          buffer: Buffer.from('fake audio content'),
          size: 123
        };
        next();
      }
    });
    multer.diskStorage = jest.fn(() => ({}));
    multer.memoryStorage = jest.fn(() => ({}));
    return multer;
  });

const audioRouter = require('../../routes/audio');
const { authenticateToken } = require('../../middleware/auth');

const app = express();
app.use(express.json());
app.use('/audio', audioRouter);

describe('Audio Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    authenticateToken.mockImplementation((req, res, next) => {
      req.user = { id: '123' };
      next();
    });
  });

  test('POST /audio/upload should upload a file locally', async () => {
    const response = await request(app)
      .post('/audio/upload')
      .attach('audio', Buffer.from('fake audio content'), 'test.mp3');

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('File uploaded locally');
    expect(response.body.metadata).toBeDefined();
  }, 10000);
  
    test('GET /audio should list audio files', async () => {
      const response = await request(app).get('/audio');
  
      expect(response.statusCode).toBe(200);
      expect(response.body.files).toBeInstanceOf(Array);
      if (response.body.files.length > 0) {
        expect(response.body.files[0]).toHaveProperty('name');
        expect(response.body.files[0]).toHaveProperty('size');
        expect(response.body.files[0]).toHaveProperty('location');
      }
    });
  
    test('GET /audio/play/:filename should return 404 for non-existent file', async () => {
      const fs = require('fs');
      fs.existsSync.mockReturnValueOnce(false);
      const response = await request(app).get('/audio/play/nonexistent.mp3');
  
      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe('File not found');
    });
  
    test('DELETE /audio/:filename should delete audio file', async () => {
      const response = await request(app).delete('/audio/test.mp3');
  
      expect(response.statusCode).toBe(204);
    });

  });