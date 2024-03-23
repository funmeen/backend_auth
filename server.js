require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('MongoDB Connected'))
        .catch((err) => console.log(err));

app.use(express.json());

// CORS middleware configuration
app.use(cors({
    origin: 'https://testauthorization.netlify.app',
    credentials: true,
}));

// Additional CORS headers for preflight requests
app.options('*', cors({
    origin: 'https://testauthorization.netlify.app',
    credentials: true,
}));

const userRouter = require('./routes/auth');
app.use('/', userRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});


