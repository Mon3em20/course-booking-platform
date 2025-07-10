import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// import { logout } from '../slices/authSlice';

const Header = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);

    const logoutHandler = () => {
        dispatch(logout());
    };

    return (
        <header className="bg-primary text-white">
            <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold">
                    Course Booking Platform
                </Link>
                <div className="flex items-center">
                    <Link to="/courses" className="mx-2">
                        Courses
                    </Link>
                    {userInfo ? (
                        <>
                            {userInfo.role === 'instructor' && (
                                <Link to="/instructor/dashboard" className="mx-2">
                                    Instructor Dashboard
                                </Link>
                            )}
                            {userInfo.role === 'admin' && (
                                <Link to="/admin/dashboard" className="mx-2">
                                    Admin Dashboard
                                </Link>
                            )}
                            <div className="dropdown mx-2">
                                <button className="btn dropdown-toggle">
                                    {userInfo.name}
                                </button>
                                <div className="dropdown-menu">
                                    <Link to="/profile" className="dropdown-item">
                                        Profile
                                    </Link>
                                    <Link to="/my-bookings" className="dropdown-item">
                                        My Bookings
                                    </Link>
                                    <button onClick={logoutHandler} className="dropdown-item">
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="mx-2">
                                Sign In
                            </Link>
                            <Link to="/register" className="mx-2 btn-primary">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;