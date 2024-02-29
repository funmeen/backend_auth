require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');

const file = fs.readFileSync('/17BAD38A48CDD7A3E164DDA9C91C2198.txt');

const app = express();

mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('MongoDB Connected'))
        .catch((err) => console.log(err));

app.use(express.json());

app.use(cors())

const userRouter = require('./routes/auth');
app.use('/', userRouter);

app.get('/.well-known/pki-validation/17BAD38A48CDD7A3E164DDA9C91C2198.txt',(req, res) => {
    res.sendFile('/backend_auth/17BAD38A48CDD7A3E164DDA9C91C2198.txt')
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});


