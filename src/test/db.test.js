const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

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

test('Should connect to the database', async () => {
    const connectionState = mongoose.connection.readyState;
    expect(connectionState).toBe(1); // 1 for connected
});
