const express = require('express');
const connectDB = require('./src/config/db');
const userRoutes = require('./src/routes/userRoutes');
const cors = require('cors'); //

const app = express();
// Connect to Database
connectDB();

// Configure CORS
app.use(cors({
    origin: 'http://localhost:3000', // Allow only the frontend to access
    credentials: true // Allow cookies and credentials
}));

// Middleware for parsing JSON bodies
app.use(express.json({ extended: false }));

// Define routes
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
