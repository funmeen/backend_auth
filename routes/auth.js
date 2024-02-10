const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken, permit } = require('../middleware/middleware');

//test
router.get('/test', (req, res) => {
    res.send('The test route is working');
});

//Register User
router.post('/register', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Check for duplicate usernames in the database
        const duplicate = await User.findOne({ username: req.body.username });
        if (duplicate) {
            return res.status(409).send('Username already registered');
        }
        
        // Create a new user instance
        const user = new User({
            username: req.body.username,
            password: hashedPassword,
            role: 'user'
        });

        // Save the new user to the database
        const savedUser = await user.save();

        // Send back only necessary information
        res.status(201).send({
            userId: savedUser._id,
            username: savedUser.username,
            role: savedUser.role
        });
    } catch (error) {
        console.error('Registration failed:', error);
        res.status(500).send('Registration failed');
    }
});


//Login User
router.post('/login', async (req, res) => {
    const user = await User.findOne({
        username: req.body.username
    });
    if (!user) return res.status(400).send('Username or password is wrong');

    const validPass = await bcrypt.compare(req.body.password, user.password); // Await the result of bcrypt.compare()
    if (!validPass) return res.status(400).send('Invalid Password');


    const accessToken = jwt.sign(
        { "UserInfo" : {
            _id: user._id, 
            username: user.username,
            role: user.role
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1m' } // Access token expires in 1 minutes
    );

    const refreshToken = jwt.sign(
        { _id: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '4m' } // Refresh token expires in 4 minutes
    );

    res.header('auth-token', accessToken).send({ accessToken, refreshToken, role: user.role });
});

router.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if(!refreshToken) return res.status(401).send('Access Denied');

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
        if (error) return res.status(403).send('Invalid Refresh Token');

        const accessToken = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '2m' } // Access token expires in 2 minutes
        );

        res.send({ accessToken });
    });
});

router.get('/user', verifyToken, permit('user', 'admin'), (req, res) =>{
    res.send('Welcome, user!');
});

router.get('/admin', verifyToken, permit('admin'), (req, res) =>{
    res.send('Welcome, admin!');
});

module.exports = router;