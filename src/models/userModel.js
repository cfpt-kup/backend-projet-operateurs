const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User Schema
const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    school_class: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    access_code: { type: String, required: true },
    tokens: [{ token: { type: String, required: true } }] // Add this line to store multiple tokens
});

// Hash the user's password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        // Hash the password with a salt round of 8
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

// Add a method to compare the entered password with the hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Compile the schema into a model
const User = mongoose.model('User', userSchema);

module.exports = User;
