const User = require('../models/userModel');
const AccessCode = require('../models/accessCodeModel');

exports.signup = async (req, res) => {
    const { firstname, lastname, school_class, email, password, access_code } = req.body;

    try {
        // Check if the access code is valid and active
        const accessCode = await AccessCode.findOne({ code: access_code, active: true });
        if (!accessCode) {
            return res.status(400).json({ msg: 'Invalid or inactive access code.' });
        }

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists.' });
        }

        // Create a new user
        user = new User({
            firstname,
            lastname,
            school_class,
            email,
            password,
            access_code
        });

        // Save the user
        await user.save();

        // Deactivate the access code
        accessCode.active = false;
        await accessCode.save();

        // Respond with success message
        res.status(201).json({ msg: 'User registered successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
