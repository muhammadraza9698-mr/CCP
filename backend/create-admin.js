const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aunabidi002_db_user:mongodb_atlas_pass@cluster0.f85vtg5.mongodb.net/mfruit?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

const createAdmin = async () => {
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@mfruit.com' });
        
        if (existingAdmin) {
            console.log('⚠️  Admin user already exists!');
            console.log('\n📧 Admin Credentials:');
            console.log('   Email: admin@mfruit.com');
            console.log('   Password: admin123');
            console.log('\n💡 To reset the password, delete the user first or use a different email.');
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@mfruit.com',
            password: 'admin123',
            role: 'admin',
        });

        console.log('\n✅ Admin user created successfully!');
        console.log('\n📧 Admin Credentials:');
        console.log('   Email: admin@mfruit.com');
        console.log('   Password: admin123');
        console.log('\n🔐 Use these credentials to login and add products.');
        console.log('⚠️  Please change the password after first login for security.\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error.message);
        process.exit(1);
    }
};

connectDB().then(createAdmin);

