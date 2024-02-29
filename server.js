require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path'); // Import the path module

const app = express();

mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('MongoDB Connected'))
        .catch((err) => console.log(err));

app.use(express.json());
app.use(cors());

// Read the file asynchronously and store it in a variable
let fileContent;
fs.readFile(path.join(__dirname, '6C10D3FAEA175C2D5F286451A67B947E.txt'), (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
    } else {
        fileContent = data;
    }
});

// Endpoint to serve the file
app.get('/.well-known/pki-validation/6C10D3FAEA175C2D5F286451A67B947E.txt', (req, res) => {
    if (fileContent) {
        res.send(fileContent); // Send the file content
    } else {
        res.status(500).send('File not found'); // Handle the case when fileContent is not available
    }
});

const userRouter = require('./routes/auth');
app.use('/', userRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
