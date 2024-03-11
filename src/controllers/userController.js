const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AccessCode = require('../models/accessCodeModel');

// Signup Controller
exports.signup = async (req, res) => {
    const { firstname, lastname, school_class, email, password, access_code } = req.body;

    try {
        const accessCode = await AccessCode.findOne({ code: access_code, active: true });
        if (!accessCode) {
            return res.status(400).json({ msg: 'Invalid or inactive access code.' });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists.' });
        }

        user = new User({
            firstname,
            lastname,
            school_class,
            email,
            password,
            access_code
        });

        // Optional: Automatically log in the user upon signup
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        user.tokens.push({ token }); // Save token to the user document

        await user.save();
        accessCode.active = false;
        await accessCode.save();

        res.status(201).json({
            token,
            user: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                school_class: user.school_class
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Login Controller
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ msg: 'Invalid email or password.' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid email or password.' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        user.tokens.push({ token }); // Save token to the user document
        await user.save();

        res.json({
            token,
            user: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                school_class: user.school_class
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Logout Controller
exports.logout = async (req, res) => {
    try {
        // Remove the token from the user's array of tokens
        req.user.tokens = req.user.tokens.filter((tokenObject) => {
            return tokenObject.token !== req.token;
        });
        await req.user.save();

        // Respond with a success message in JSON format
        res.send({ message: 'You have been logged out successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error during logout' });
    }
};

// User profile Controller
exports.getUserProfile = async (req, res) => {
    try {
        // The req.user is already populated by the auth middleware
        const userObject = req.user.toObject();

        // Delete sensitive information and fields not required in the response
        delete userObject.password;
        delete userObject.tokens;
        delete userObject._id;  // Exclude _id from the response
        delete userObject.__v;  // Exclude __v from the response
        delete userObject.access_code; // Exclude access_code from the response

        res.status(200).json(userObject); // Use json to ensure correct Content-Type
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Unable to fetch profile.' });
    }
};


