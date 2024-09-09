const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const { errorHandler } = require('./middleware/errorHandler');

// Routes
const userRoutes = require('./routes/user'); // user routes
const audioRoutes = require('./routes/audio');  // Audio routes

require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// User Routes (create, update, read, delete)
app.use('/user', userRoutes);
// Audio Routes (upload, list, play, delete)
app.use('/audio', audioRoutes); 

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

