const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });
const User = require('../models/User');
const config = require('../config');

/**
 * Create Admin User Script
 * Creates an admin user for testing the admin panel
 */

const createAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(config.mongodbUri);
        console.log('✅ MongoDB Connected');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@durgaartzone.com' });
        if (existingAdmin) {
            console.log('❌ Admin user already exists');
            process.exit(0);
        }

        // Create admin user
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@durgaartzone.com',
            password: 'admin123456',
            role: 'admin',
            phone: '1234567890'
        });

        console.log('✅ Admin user created successfully:');
        console.log('   Email: admin@durgaartzone.com');
        console.log('   Password: admin123456');
        console.log('   Role: admin');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
};

// Run the function
createAdmin();
