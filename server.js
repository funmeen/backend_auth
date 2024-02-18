const express = require('express');
const https = require('https');
const fs = require('fs');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Load SSL certificate and private key
const privateKey = fs.readFileSync('/etc/ssl/private/private.key', 'utf8');
const certificate = fs.readFileSync('/etc/ssl/certificate.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err));

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'https://testauthorization.netlify.app',
    credentials: true
}));

// Routes
const userRouter = require('./routes/auth');
app.use('/api/user', userRouter);

// Start HTTPS server
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(4000, () => {
    console.log('Server is running on port 4000');
});
