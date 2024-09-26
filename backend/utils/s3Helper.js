const { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Upload to S3
const uploadToS3 = async (userId, file) => {
  const fileName = `${userId}/${file.originalname}`;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    Metadata: {
      userId: userId.toString(),
    },
  };
  const command = new PutObjectCommand(params);
  return await s3.send(command);
};

// List files from S3
const listS3Objects = async (userId) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Prefix: `${userId}/`,
  };
  const command = new ListObjectsV2Command(params);
  const data = await s3.send(command);
  return data.Contents.map((file) => ({
    name: path.basename(file.Key),
    size: file.Size,
    location: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.Key}`,
  }));
};

// Get S3 object stream
const getS3ObjectStream = (userId, fileName) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${userId}/${fileName}`,
  };
  const command = new GetObjectCommand(params);
  return s3.send(command).then(data => data.Body);
};

// Delete S3 object
const deleteS3Object = async (userId, fileName) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${userId}/${fileName}`,
  };
  const command = new DeleteObjectCommand(params);
  await s3.send(command);
};

module.exports = {
  uploadToS3,
  listS3Objects,
  getS3ObjectStream,
  deleteS3Object,
};

