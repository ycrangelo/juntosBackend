import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
// import { createRouteHandler } from 'uploadthing/express';
const AWS = require('aws-sdk');

dotenv.config();
//import models

// Import routes
import userRoutes from './routes/userRoutes.mjs';
import commentRoutes from './routes/commentRoutes.mjs'
import savePostRoutes from './routes/savePostRoutes.mjs'
import postRoutes from './routes/postRoutes.mjs'
import { uploadRouter } from './uploadthing.mjs';

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;


// Connect to MongoDB with retry logic
const connectWithRetry = async () => {
  try {
    await mongoose.connect("mongodb+srv://lornayocor:cXqrgEX74ex576j3@juntos.n0m0ol6.mongodb.net/?retryWrites=true&w=majority&appName=juntos");
    console.log('MongoDB connected successfully')
  } catch (err) {
    console.error('MongoDB connection error:', err);
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();

// Middleware
app.use(helmet()); // Security headers
// app.use(compression()); // Compress responses
// app.use(express.json({ limit: '10kb' })); // Limit JSON payload size
// app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// CORS configuration
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400 // Cache preflight requests for 24 hours
}));

// Response headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("X-Content-Type-Options", "nosniff");
  res.header("X-Frame-Options", "DENY");
  next();
});

// Handle preflight requests
app.options('*', (req, res) => {
  res.sendStatus(204);
});

// Test route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Use routes
// With this:
import multer from 'multer';
const upload = multer();

// app.use('/api/uploadthing',
//   upload.single('file'), // Handle multipart/form-data
//   createRouteHandler({
//     router: uploadRouter,
//     config: {
//       uploadthingToken: 'your_token_here',
//       isBodyParserDisabled: true, // Multer handles parsing
//     }
//   })
// );
// AWS Configuration
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const s3 = new AWS.S3();

app.get('/get-presigned-url', (req, res) => {
  const fileName = `image_${Date.now()}.jpg`;
  const s3Path = `ycrangelojuntos/images/${fileName}`;
  
  const params = {
    Bucket: "ycrangelojuntos",
    Key: s3Path,
    Expires: 60, // URL expires in 60 seconds
    ContentType: 'image/jpeg',
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', params, (err, url) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error generating pre-signed URL' });
    }
    res.json({ url });
  });
});
app.use('/api/users', userRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/saves', savePostRoutes);
app.use('/api/post', postRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Handle server shutdown gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
