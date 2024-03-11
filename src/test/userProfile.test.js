const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel'); // Ensure the path is correct
const { getUserProfile } = require('../controllers/userController'); // Ensure the path is correct

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    process.env.JWT_SECRET = 'test_secret';

    // Creating a user with tokens for testing
    const hashedPassword = await bcrypt.hash('password123', 8);
    const user = new User({
        firstname: 'Alice',
        lastname: 'Smith',
        school_class: '10B',
        email: 'alice.smith@example.com',
        password: hashedPassword,
        access_code: 'YBQuPmfwxo',
        tokens: [{ token: jwt.sign({ id: 'someUserId' }, process.env.JWT_SECRET, { expiresIn: '1h' }) }]
    });
    await user.save();
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

test('Should return the user profile correctly', async () => {
    // Mocking the user found by the auth middleware
    const user = await User.findOne({ email: 'alice.smith@example.com' });
    const req = { user };
    const res = {
        status: jest.fn(() => res),
        json: jest.fn(() => res),
    };

    await getUserProfile(req, res);

    // Check if the status was called with 200
    expect(res.status).toHaveBeenCalledWith(200);

    // Check if the json was called with an object that doesn't include _id and __v
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        firstname: 'Alice',
        lastname: 'Smith',
        school_class: '10B',
        email: 'alice.smith@example.com',
    }));

    // Ensure _id and __v are not included
    expect(res.json.mock.calls[0][0]).not.toHaveProperty('_id');
    expect(res.json.mock.calls[0][0]).not.toHaveProperty('__v');
});
