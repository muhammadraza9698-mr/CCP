const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a product name'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please provide a product description'],
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
        min: 0,
    },
    category: {
        type: String,
        required: [true, 'Please provide a category'],
        enum: ['Fruits', 'Vegetables', 'Herbs', 'Organic', 'Seasonal'],
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/300x300?text=Product+Image',
    },
    stock: {
        type: Number,
        required: [true, 'Please provide stock quantity'],
        min: 0,
        default: 0,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Product', productSchema);
