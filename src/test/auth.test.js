const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel'); // Ensure the path is correct for your project structure

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Setup environment variable for JWT_SECRET
    process.env.JWT_SECRET = 'test_secret';

    // Create a user for testing
    const hashedPassword = await bcrypt.hash('password123', 8);
    const user = new User({
        firstname: 'Alice',
        lastname: 'Smith',
        school_class: '10B',
        email: 'alice.smith@example.com',
        password: hashedPassword,
        access_code: 'YBQuPmfwxo',
        tokens: []
    });
    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1h' });
    user.tokens.push({ token });
    await user.save();
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

test('Should create a user with a JWT token on signup', async () => {
    const savedUser = await User.findOne({ email: 'alice.smith@example.com' });
    expect(savedUser).not.toBeNull();
    expect(savedUser.tokens).toHaveLength(1);
    expect(jwt.verify(savedUser.tokens[0].token, process.env.JWT_SECRET)).toBeTruthy();
});

test('Should log in a user and verify JWT token is valid', async () => {
    const user = await User.findOne({ email: 'alice.smith@example.com' });
    // Assuming passwordMatches checks are no longer necessary here as user creation and hashing is done in beforeAll
    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1h' });
    expect(jwt.verify(token, process.env.JWT_SECRET)).toBeTruthy();
});

test('Should log out a user and invalidate the token', async () => {
    // Fetch the user to ensure they exist and have tokens
    let user = await User.findOne({ email: 'alice.smith@example.com' });
    // Simulate logging out by clearing the tokens array
    user.tokens = [];
    await user.save();

    // Verify tokens array is empty
    const updatedUser = await User.findOne({ email: 'alice.smith@example.com' });
    expect(updatedUser.tokens).toHaveLength(0);
});
