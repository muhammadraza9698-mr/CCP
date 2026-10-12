import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrder } from '../api/hooks';

const OrderConfirmation = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { order, isLoading, isError } = useOrder(orderId);

    if (isLoading) {
        return <div className="loading">Loading order details...</div>;
    }

    if (isError || !order) {
        return <div className="error-message">Order not found</div>;
    }

    return (
        <div className="order-confirmation-container">
            <div className="success-icon">✓</div>
            <h1>Order Placed Successfully!</h1>
            <p className="order-id">Order ID: {order._id}</p>

            <div className="order-details-card">
                <h2>Order Details</h2>

                <div className="order-items">
                    <h3>Items:</h3>
                    {order.items.map((item, index) => (
                        <div key={index} className="order-item-row">
                            <span>
                                {item.name} x {item.quantity}
                            </span>
                            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>

                <div className="order-total">
                    <strong>Total Amount:</strong>
                    <strong>₹{order.totalAmount.toFixed(2)}</strong>
                </div>

                <div className="delivery-info">
                    <h3>Delivery Address:</h3>
                    <p>{order.deliveryAddress.street}</p>
                    <p>
                        {order.deliveryAddress.city}, {order.deliveryAddress.state}{' '}
                        {order.deliveryAddress.zipCode}
                    </p>
                    <p>Phone: {order.deliveryAddress.phone}</p>
                </div>

                <div className="payment-info">
                    <p>
                        <strong>Payment Method:</strong> {order.paymentMethod}
                    </p>
                    <p>
                        <strong>Payment Status:</strong>{' '}
                        <span className={`status-badge ${order.paymentStatus}`}>
                            {order.paymentStatus}
                        </span>
                    </p>
                    <p>
                        <strong>Order Status:</strong>{' '}
                        <span className={`status-badge ${order.orderStatus}`}>
                            {order.orderStatus}
                        </span>
                    </p>
                </div>
            </div>

            <div className="confirmation-actions">
                <button onClick={() => navigate('/orders')} className="view-orders-btn">
                    View All Orders
                </button>
                <button onClick={() => navigate('/')} className="continue-shopping-btn">
                    Continue Shopping
                </button>
            </div>
        </div>
    );
};

export default OrderConfirmation;
