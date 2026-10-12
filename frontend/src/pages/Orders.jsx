import React from 'react';
import { useMyOrders } from '../api/hooks';

const Orders = () => {
    const { orders, isLoading, isError } = useMyOrders();

    if (isLoading) {
        return <div className="loading">Loading orders...</div>;
    }

    if (isError) {
        return <div className="error-message">Failed to load orders</div>;
    }

    if (orders.length === 0) {
        return (
            <div className="empty-orders">
                <h2>No orders yet</h2>
                <p>Start shopping to place your first order!</p>
            </div>
        );
    }

    return (
        <div className="orders-container">
            <h1>My Orders</h1>

            <div className="orders-list">
                {orders.map((order) => (
                    <div key={order._id} className="order-card">
                        <div className="order-header">
                            <div>
                                <h3>Order #{order._id.slice(-8)}</h3>
                                <p className="order-date">
                                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                            <div className="order-status-badges">
                                <span className={`status-badge ${order.orderStatus}`}>
                                    {order.orderStatus}
                                </span>
                                <span className={`status-badge ${order.paymentStatus}`}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                        </div>

                        <div className="order-items-summary">
                            {order.items.map((item, index) => (
                                <div key={index} className="order-item-summary">
                                    <span>
                                        {item.name} x {item.quantity}
                                    </span>
                                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="order-footer">
                            <div className="order-address">
                                <strong>Delivery to:</strong> {order.deliveryAddress.street},{' '}
                                {order.deliveryAddress.city}
                            </div>
                            <div className="order-total">
                                <strong>Total: ₹{order.totalAmount.toFixed(2)}</strong>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
