import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/config';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCart(null);
            setCartCount(0);
        }
    }, [user]);

    useEffect(() => {
        if (cart && cart.items) {
            const count = cart.items.reduce((total, item) => total + item.quantity, 0);
            setCartCount(count);
        } else {
            setCartCount(0);
        }
    }, [cart]);

    // Listen for cart updates from other components
    useEffect(() => {
        const handleCartUpdate = () => {
            if (user) {
                fetchCart();
            }
        };

        window.addEventListener('cartUpdated', handleCartUpdate);
        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }, [user]);

    const fetchCart = async () => {
        try {
            const { data } = await api.get('/api/cart');
            setCart(data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    const addToCart = async (productId, quantity = 1) => {
        try {
            const { data } = await api.post('/api/cart/add', {
                productId,
                quantity,
            });
            setCart(data);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to add to cart',
            };
        }
    };

    const updateCartItem = async (productId, quantity) => {
        try {
            const { data } = await api.put(`/api/cart/update/${productId}`, {
                quantity,
            });
            setCart(data);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update cart',
            };
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const { data } = await api.delete(`/api/cart/remove/${productId}`);
            setCart(data);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to remove from cart',
            };
        }
    };

    const clearCart = async () => {
        try {
            const { data } = await api.delete('/api/cart/clear');
            setCart(data);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to clear cart',
            };
        }
    };

    const value = {
        cart,
        cartCount,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
