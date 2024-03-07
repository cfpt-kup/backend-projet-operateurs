const mongoose = require('mongoose');

// Define the Access Code Schema
const accessCodeSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    active: { type: Boolean, required: true }
});

// Compile the schema into a model
const AccessCode = mongoose.model('AccessCode', accessCodeSchema);

module.exports = AccessCode;
