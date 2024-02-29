require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');

const file = fs.readFileSync('./6C10D3FAEA175C2D5F286451A67B947E.txt');

const app = express();

mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('MongoDB Connected'))
        .catch((err) => console.log(err));

app.use(express.json());

app.use(cors())

app.get('/.well-known/pki-validation/6C10D3FAEA175C2D5F286451A67B947E.txt', (req, res) => {
    res.sendFile('/home/ec2-user/backend_auth/6C10D3FAEA175C2D5F286451A67B947E.txt')
});

const userRouter = require('./routes/auth');
app.use('/', userRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
