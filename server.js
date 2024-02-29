require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Import the path module

const app = express();

mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('MongoDB Connected'))
        .catch((err) => console.log(err));

app.use(express.json());
app.use(cors());

//const userRouter = require('./routes/auth');
//app.use('/', userRouter);

// Define the file path to the validation file
const validationFilePath = path.join(__dirname, '17BAD38A48CDD7A3E164DDA9C91C2198.txt');

app.get('/.well-known/pki-validation/17BAD38A48CDD7A3E164DDA9C91C2198.txt', (req, res) => {
    // Send the validation file
    res.sendFile(validationFilePath);
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
