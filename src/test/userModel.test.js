const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/userModel'); // Update the path to where your User model is located

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri); // Make sure not to include deprecated options here
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

test('Should insert a new user into the database', async () => {
    const userData = {
        firstname: 'John',
        lastname: 'Doe',
        school_class: '10A',
        email: 'john.doe@example.com',
        password: 'password123', // In a real app, ensure this is hashed
        access_code: 'YBQuPmfwxo' // Ensure this is unique or managed by your logic
    };

    // Insert the user
    const user = new User(userData);
    await user.save();

    // Retrieve the user by email
    const foundUser = await User.findOne({ email: 'john.doe@example.com' });

    // Assertions to ensure the user was inserted correctly
    expect(foundUser).not.toBeNull();
    expect(foundUser.firstname).toEqual(userData.firstname);
    expect(foundUser.lastname).toEqual(userData.lastname);
    expect(foundUser.class).toEqual(userData.class);
    expect(foundUser.email).toEqual(userData.email);
    // Additional assertions can be made here
});
