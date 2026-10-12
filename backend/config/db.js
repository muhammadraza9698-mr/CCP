const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB connection options
    const options = {
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
      socketTimeoutMS: 20000, // Socket timeout
      maxPoolSize: 10, // Connection pool size
      minPoolSize: 2,
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Full error:', error);

    // Provide helpful error messages
    if (error.message.includes('buffering timed out')) {
      console.error('\n⚠️  CONNECTION TIMEOUT - Possible causes:');
      console.error('1. MongoDB Atlas cluster is paused or doesn\'t exist');
      console.error('2. IP address not whitelisted in MongoDB Atlas');
      console.error('3. Incorrect credentials in MONGODB_URI');
      console.error('4. Network/firewall blocking connection');
      console.error('\n💡 Solutions:');
      console.error('- Check MongoDB Atlas dashboard: https://cloud.mongodb.com');
      console.error('- Verify cluster is running');
      console.error('- Add 0.0.0.0/0 to IP whitelist (Network Access)');
      console.error('- Verify username/password in .env file\n');
    }

    process.exit(1);
  }
};

module.exports = connectDB;
