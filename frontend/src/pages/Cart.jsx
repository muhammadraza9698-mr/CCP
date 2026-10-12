import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cart, updateCartItem, removeFromCart } = useCart();
    const navigate = useNavigate();

    const handleQuantityChange = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
        await updateCartItem(productId, newQuantity);
    };

    const handleRemove = async (productId) => {
        if (window.confirm('Remove this item from cart?')) {
            await removeFromCart(productId);
        }
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (!cart || cart.items.length === 0) {
        return (
            <div className="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Add some fresh produce to get started!</p>
                <button onClick={() => navigate('/')} className="continue-shopping-btn">
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h1>Shopping Cart</h1>

            <div className="cart-content">
                <div className="cart-items">
                    {cart.items.map((item) => (
                        <div key={item.product._id} className="cart-item">
                            <img src={item.product.image} alt={item.product.name} />
                            <div className="cart-item-details">
                                <h3>{item.product.name}</h3>
                                <p className="cart-item-category">{item.product.category}</p>
                                <p className="cart-item-price">₹{item.price.toFixed(2)} each</p>
                            </div>
                            <div className="cart-item-actions">
                                <div className="quantity-controls">
                                    <button
                                        onClick={() =>
                                            handleQuantityChange(item.product._id, item.quantity - 1)
                                        }
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() =>
                                            handleQuantityChange(item.product._id, item.quantity + 1)
                                        }
                                    >
                                        +
                                    </button>
                                </div>
                                <p className="cart-item-total">
                                    ₹{(item.price * item.quantity).toFixed(2)}
                                </p>
                                <button
                                    className="remove-btn"
                                    onClick={() => handleRemove(item.product._id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <h2>Order Summary</h2>
                    <div className="summary-row">
                        <span>Subtotal:</span>
                        <span>₹{cart.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total:</span>
                        <span>₹{cart.totalAmount.toFixed(2)}</span>
                    </div>
                    <button className="checkout-btn" onClick={handleCheckout}>
                        Proceed to Checkout
                    </button>
                    <button
                        className="continue-shopping-btn"
                        onClick={() => navigate('/')}
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
