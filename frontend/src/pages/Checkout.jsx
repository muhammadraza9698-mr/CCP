import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/config';
import { useCart as useCartContext } from '../context/CartContext';

const Checkout = () => {
    const { cart } = useCartContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
        paymentMethod: 'Cash on Delivery',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const orderData = {
                deliveryAddress: {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode,
                    phone: formData.phone,
                },
                paymentMethod: formData.paymentMethod,
            };

            const { data } = await api.post('/api/orders', orderData);
            window.dispatchEvent(new Event('cartUpdated'));
            navigate(`/order-confirmation/${data._id}`);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to place order');
            setLoading(false);
        }
    };

    if (!cart || cart.items.length === 0) {
        return (
            <div className="empty-cart">
                <h2>Your cart is empty</h2>
                <button onClick={() => navigate('/')} className="continue-shopping-btn">
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <h1>Checkout</h1>

            <div className="checkout-content">
                <div className="checkout-form">
                    <h2>Delivery Address</h2>
                    <form onSubmit={handleSubmit}>
                        {error && <div className="error-message">{error}</div>}

                        <div className="form-group">
                            <label>Street Address</label>
                            <input
                                type="text"
                                name="street"
                                value={formData.street}
                                onChange={handleChange}
                                required
                                placeholder="Enter street address"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter city"
                                />
                            </div>

                            <div className="form-group">
                                <label>State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter state"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>ZIP Code</label>
                                <input
                                    type="text"
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter ZIP code"
                                />
                            </div>

                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter phone number"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Payment Method</label>
                            <select
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleChange}
                                required
                            >
                                <option value="Cash on Delivery">Cash on Delivery</option>
                                <option value="Mock Card Payment">Mock Card Payment</option>
                            </select>
                        </div>

                        <button type="submit" className="place-order-btn" disabled={loading}>
                            {loading ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </form>
                </div>

                <div className="order-summary-checkout">
                    <h2>Order Summary</h2>
                    <div className="checkout-items">
                        {cart.items.map((item) => (
                            <div key={item.product._id} className="checkout-item">
                                <span>
                                    {item.product.name} x {item.quantity}
                                </span>
                                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="checkout-total">
                        <strong>Total:</strong>
                        <strong>₹{cart.totalAmount.toFixed(2)}</strong>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
