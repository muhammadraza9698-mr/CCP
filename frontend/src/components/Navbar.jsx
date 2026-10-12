import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                     mfruit
                </Link>

                <div className="navbar-links">
                    <Link to="/" className="nav-link">
                        Home
                    </Link>

                    {user ? (
                        <>
                            <Link to="/cart" className="nav-link cart-link">
                                🛒 Cart
                                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                            </Link>
                            <Link to="/orders" className="nav-link">
                                Orders
                            </Link>
                            {isAdmin() && (
                                <Link to="/admin" className="nav-link admin-link">
                                    Admin Dashboard
                                </Link>
                            )}
                            <button onClick={handleLogout} className="nav-button">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-button">
                                Login
                            </Link>
                            <Link to="/register" className="nav-button">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
