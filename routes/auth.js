const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken, permit } = require('../middleware/middleware');

//test
router.get('/', (req, res) => {
    res.send('Welcome to backend');
});

router.get('/.well-known/pki-validation/6C10D3FAEA175C2D5F286451A67B947E.txt', (req, res) => {
    res.sendFile('/home/ec2-user/backend_auth/6C10D3FAEA175C2D5F286451A67B947E.txt')
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
            role: 2001
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
        { expiresIn: '5m' } // Access token expires in 1 minutes
    );

    const refreshToken = jwt.sign(
        { _id: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '4m' } // Refresh token expires in 4 minutes
    );

     // Set the Access-Control-Allow-Origin header
     res.header('Access-Control-Allow-Origin', 'https://testauthorization.netlify.app');

     // Send the response with tokens and user role
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

// Route to fetch user data based on username
router.get('/:username', async (req, res) => {
    try {
      const username = req.params.username;
  
      // Query the database to find the user by username
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Return user data as JSON response
      res.json(user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Define the route to handle user profile update
router.post('/profile', verifyToken, async (req, res) => {
    try {
        const { firstName, middleName, lastName, age } = req.body;

        // Update the user profile in the database
        const userId = req.user._id;
        const user = await User.findByIdAndUpdate(
            userId,
            { firstName, middleName, lastName, age },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;