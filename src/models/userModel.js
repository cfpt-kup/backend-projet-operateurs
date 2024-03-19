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
    tokens: [{
        token: { type: String, required: true },
        expiresAt: { type: Date, required: true } // Add this line to include expiry information
    }]
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

// Add a method to cleanup expired JWT tokens from the database
userSchema.methods.removeExpiredTokens = function () {
    const now = new Date();
    this.tokens = this.tokens.filter(token => token.expiresAt > now);
};

// Compile the schema into a model
const User = mongoose.model('User', userSchema);

module.exports = User;
