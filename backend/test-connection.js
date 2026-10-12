const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log('🔍 Testing MongoDB Connection...\n');

// Check if MONGODB_URI exists
if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env file');
    process.exit(1);
}

// Hide password in logs
const sanitizedUri = process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':****@');
console.log('Connection URI:', sanitizedUri);
console.log('');

const options = {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 20000,
    maxPoolSize: 10,
    minPoolSize: 2,
};

async function testConnection() {
    try {
        console.log('⏳ Attempting to connect...');
        const startTime = Date.now();

        const conn = await mongoose.connect(process.env.MONGODB_URI, options);

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        console.log('✅ Connection successful!');
        console.log(`   Host: ${conn.connection.host}`);
        console.log(`   Database: ${conn.connection.name}`);
        console.log(`   Connection time: ${duration}s`);
        console.log('');

        // Test a simple query
        console.log('🔍 Testing database query...');
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`✅ Found ${collections.length} collections:`);
        collections.forEach(col => console.log(`   - ${col.name}`));

        await mongoose.connection.close();
        console.log('\n✅ Connection test completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Connection failed!');
        console.error(`Error: ${error.message}\n`);

        if (error.message.includes('buffering timed out') || error.message.includes('Server selection timed out')) {
            console.error('⚠️  CONNECTION TIMEOUT - Possible causes:\n');
            console.error('1. MongoDB Atlas cluster is paused or doesn\'t exist');
            console.error('   → Go to https://cloud.mongodb.com and check cluster status');
            console.error('');
            console.error('2. IP address not whitelisted in MongoDB Atlas');
            console.error('   → In Atlas: Network Access → Add IP Address → Add 0.0.0.0/0 (allow all)');
            console.error('');
            console.error('3. Incorrect credentials in MONGODB_URI');
            console.error('   → Verify username and password in .env file');
            console.error('');
            console.error('4. Network/firewall blocking connection');
            console.error('   → Check your firewall or VPN settings');
            console.error('');
        } else if (error.message.includes('authentication failed')) {
            console.error('⚠️  AUTHENTICATION FAILED\n');
            console.error('→ Check username and password in your .env file');
            console.error('→ In MongoDB Atlas: Database Access → verify user credentials');
            console.error('');
        }

        process.exit(1);
    }
}

testConnection();
