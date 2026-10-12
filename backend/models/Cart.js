const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },
    price: {
        type: Number,
        required: true,
    },
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    items: [cartItemSchema],
    totalAmount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Calculate total amount before saving
cartSchema.pre('save', function (next) {
    this.totalAmount = this.items.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);
    // Check if next is a function before calling it
    if (typeof next === 'function') {
        next();
    }
});

module.exports = mongoose.model('Cart', cartSchema);
