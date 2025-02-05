const express = require('express');
const mongoose = require('mongoose');
const { PORT } = require('./configs/server.config');
const dbConfig = require('./configs/db.config');
const userModel = require('./models/user.model');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json()); // Middleware for JSON parsing json=> js object

// Connect to MongoDB
mongoose.connect(dbConfig.DB_URL)

const db = mongoose.connection;

db.on('error', () => {
    console.log('❌ Error while connecting to MongoDB');
});

db.once('open', () => {
    console.log('✅ Connected to MongoDB');
    initAdmin(); // Initialize Admin User
});

// Function to create Admin user if not already present
async function initAdmin() {
    try {
        let user = await userModel.findOne({ userId: 'admin' });

        if (user) {
            console.log('⚡ Admin user already exists');
            return;
        }

        // If admin does not exist, create one
        user = await userModel.create({
            name: 'Shubh',
            userId: 'admin',
            email: 'shubh@gmail.com', 
            usertype: 'ADMIN',
            password: bcrypt.hashSync('Shubh#04', 8)
        });

        console.log('✅ Admin user created:', user);
    } catch (err) {
        console.error('❌ Error while creating admin:', err);
    }
}

// Attach authentication routes
require('./routes/auth.route')(app);

//Attach categories routes
require('./routes/category.routes')(app);

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server started at port ${PORT}`);
});
