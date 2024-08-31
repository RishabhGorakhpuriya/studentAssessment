const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';

// Generate a salt
const generateSalt = () => crypto.randomBytes(16).toString('hex');

// Function to create a new user
// Function to create a new user
exports.createUser = async (req, res) => {
    try {
        const { fullName, emailId, role, password } = req.body;

        // Validate the request
        if (!fullName || !emailId || !password) {
            return res.status(400).json({ message: 'All fields (fullName, emailId, password) are required' });
        }

        // Generate a new salt
        const salt = generateSalt();

        // Hash the password with the salt
        crypto.pbkdf2(password, salt, 310000, 32, 'sha256', async (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ message: 'Server error', error: err.message });
            }

            // Create a new user
            const newUser = new User({
                fullName,
                emailId,
                role,
                password: hashedPassword.toString('hex'), // Ensure password is in hex format
                salt // Store the salt
            });

            // Save the user to the database
            const savedUser = await newUser.save();

            // Respond with the saved user
            res.status(201).json(savedUser);
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Function to handle user login
exports.loginUser = async (req, res) => {
    try {
        const { emailId, password } = req.body;

        // Validate the request
        if (!emailId || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ emailId });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ message: 'Server error', error: err.message });
            }

            if (hashedPassword.toString('hex') !== user.password) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Create a JWT token
            const token = jwt.sign({ id: user._id, emailId: user.emailId, role: user.role, fullname: user.fullName, date : user.createdAt }, SECRET_KEY, { expiresIn: '1h' });

            // Respond with the token
            res.json({ token });
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


exports.UserList = async (req, res) => {
    try {
        // Extract token from headers
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify token and extract user ID
        let userId;
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            userId = decoded.id;
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Fetch all users with the role 'student'
        const students = await User.find({ role: 'student' });

        // Respond with the list of students
        res.status(200).json(students);

    } catch (err) {
        console.error('Error fetching user list:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


