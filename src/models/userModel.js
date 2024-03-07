const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User Schema
const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    school_class: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    access_code: { type: String, required: true }
});

// Hash the user's password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        // Hash the password with a salt round of 8
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

// Compile the schema into a model
const User = mongoose.model('User', userSchema);

module.exports = User;
