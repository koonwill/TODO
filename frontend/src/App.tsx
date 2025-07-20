import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import your page components
import LoginPage from './pages/Login';
import SignUpPage from './pages/Signup';
import TaskPage from './pages/Task';

// Main App Component
const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [authChecked, setAuthChecked] = useState<boolean>(false); // New state to ensure auth check is complete

    // Check for existing token on app load
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setIsLoggedIn(true);
        }
        setAuthChecked(true); // Mark authentication check as complete
    }, []);

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        setIsLoggedIn(false);
    };

    // PrivateRoute component to protect routes
    const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
        if (!authChecked) {
            return null; // Or a loading spinner
        }
        return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
    };

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/signup" element={<SignUpPage />} />

                {/* Protected Route */}
                <Route
                    path="/tasks"
                    element={
                        <PrivateRoute>
                            <TaskPage onLogout={handleLogout} />
                        </PrivateRoute>
                    }
                />

                {/* Redirect to /tasks if logged in, otherwise to /login */}
                <Route
                    path="*"
                    element={
                        authChecked ? (
                            isLoggedIn ? <Navigate to="/tasks" replace /> : <Navigate to="/login" replace />
                        ) : null // Or a loading spinner while auth is checked
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
