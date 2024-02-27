require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();

// Load SSL/TLS certificates
const privateKey = fs.readFileSync(path.resolve(__dirname, 'private.key'), 'utf8');
const certificate = fs.readFileSync(path.resolve(__dirname, 'certificate.crt'), 'utf8');
const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app);

mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('MongoDB Connected'))
        .catch((err) => console.log(err));

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

const userRouter = require('./routes/auth');
app.use('/', userRouter);

// Start the HTTPS server
httpsServer.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});