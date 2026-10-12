const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Product.deleteMany({});
        console.log('Cleared existing data');

        // Create admin user
        const admin = await User.create({
            name: 'Admin',
            email: 'admin@mfruit.com',
            password: 'admin123',
            role: 'admin',
        });
        console.log('Admin user created');

        // Create sample customer
        const customer = await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            role: 'customer',
        });
        console.log('Sample customer created');

        // Create sample products
        const products = [
            {
                name: 'Fresh Apples',
                description: 'Crisp and sweet red apples, perfect for snacking or baking.',
                price: 120,
                category: 'Fruits',
                image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=500',
                stock: 50,
                isAvailable: true,
            },
            {
                name: 'Organic Bananas',
                description: 'Naturally ripened organic bananas, rich in potassium.',
                price: 60,
                category: 'Fruits',
                image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=500',
                stock: 100,
                isAvailable: true,
            },
            {
                name: 'Fresh Tomatoes',
                description: 'Juicy red tomatoes, locally sourced and farm fresh.',
                price: 40,
                category: 'Vegetables',
                image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500',
                stock: 75,
                isAvailable: true,
            },
            {
                name: 'Green Spinach',
                description: 'Fresh organic spinach leaves, packed with nutrients.',
                price: 30,
                category: 'Vegetables',
                image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500',
                stock: 40,
                isAvailable: true,
            },
            {
                name: 'Sweet Oranges',
                description: 'Juicy Valencia oranges, perfect for fresh juice.',
                price: 100,
                category: 'Fruits',
                image: 'https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=500',
                stock: 60,
                isAvailable: true,
            },
            {
                name: 'Fresh Carrots',
                description: 'Crunchy orange carrots, great for salads and cooking.',
                price: 50,
                category: 'Vegetables',
                image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500',
                stock: 80,
                isAvailable: true,
            },
            {
                name: 'Strawberries',
                description: 'Sweet and fresh strawberries, handpicked daily.',
                price: 150,
                category: 'Fruits',
                image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500',
                stock: 30,
                isAvailable: true,
            },
            {
                name: 'Fresh Mint',
                description: 'Aromatic fresh mint leaves for cooking and beverages.',
                price: 20,
                category: 'Herbs',
                image: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=500',
                stock: 25,
                isAvailable: true,
            },
            {
                name: 'Organic Broccoli',
                description: 'Fresh organic broccoli crowns, rich in vitamins.',
                price: 70,
                category: 'Organic',
                image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=500',
                stock: 35,
                isAvailable: true,
            },
            {
                name: 'Seasonal Mangoes',
                description: 'Sweet Alphonso mangoes, the king of fruits.',
                price: 200,
                category: 'Seasonal',
                image: 'https://images.unsplash.com/photo-1605027990121-cbae9d3ce6bb?w=500',
                stock: 20,
                isAvailable: true,
            },
            {
                name: 'Fresh Cucumbers',
                description: 'Cool and crispy cucumbers, perfect for salads.',
                price: 35,
                category: 'Vegetables',
                image: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=500',
                stock: 50,
                isAvailable: true,
            },
            {
                name: 'Fresh Basil',
                description: 'Fragrant basil leaves, essential for Italian cooking.',
                price: 25,
                category: 'Herbs',
                image: 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=500',
                stock: 30,
                isAvailable: true,
            },
        ];

        await Product.insertMany(products);
        console.log('Sample products created');

        console.log('\n=== Seed Data Summary ===');
        console.log('Admin Email: admin@mfruit.com');
        console.log('Admin Password: admin123');
        console.log('Customer Email: john@example.com');
        console.log('Customer Password: password123');
        console.log(`Total Products: ${products.length}`);
        console.log('========================\n');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

connectDB().then(seedData);
