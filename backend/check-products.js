const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

async function checkProducts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 30000,
        });

        console.log('✅ Connected to MongoDB\n');

        // Count products
        const count = await Product.countDocuments();
        console.log(`📦 Total products in database: ${count}\n`);

        if (count > 0) {
            // Get all products
            const products = await Product.find({}).limit(10);
            console.log('Products:');
            products.forEach((p, i) => {
                console.log(`${i + 1}. ${p.name} - $${p.price} (${p.category})`);
            });
        } else {
            console.log('⚠️  No products found in database!');
            console.log('\n💡 Run the seed script to populate data:');
            console.log('   node seed.js');
        }

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkProducts();
