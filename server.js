const express = require('express');
const connectDB = require('./src/config/db');

const app = express();
// Connect to Database
connectDB();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
