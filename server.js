require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const https = require('https');
const fs = require('fs');

const app = express();

mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('MongoDB Connected'))
        .catch((err) => console.log(err));

app.use(express.json());

app.use(cors({
    origin: 'https://testauthorization.netlify.app',
    credentials: true
}))

const userRouter = require('./routes/auth');
app.use('/api/user', userRouter);

const privateKey = fs.readFileSync('/etc/ssl/private.key', 'utf8');
const certificate = fs.readFileSync('/etc/ssl/certificate.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
