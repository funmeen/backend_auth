const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('MongoDB Connected'))
        .catch((err) => console.log(err));

app.use(express.json());


// Define allowed origins
const allowedOrigins = ['https://testauthorization.netlify.app'];

// Configure CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    // Check if the request origin is allowed
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Allow credentials
}));

// Handle preflight requests
app.options('*', cors());

const userRouter = require('./routes/auth');
app.use('/', userRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
