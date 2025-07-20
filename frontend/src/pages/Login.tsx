/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { apiRequest, type TokenResponse, type ErrorResponse } from '../utils/api';

interface LoginPageProps {
    onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate(); // Initialize useNavigate

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const formBody = new URLSearchParams();
            formBody.append('username', username);
            formBody.append('password', password);

            const response = await fetch(`${API_BASE_URL}/token`, { // Use API_BASE_URL directly
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formBody.toString(),
            });

            const data: TokenResponse | ErrorResponse = await response.json();

            if (!response.ok) {
                setError((data as ErrorResponse).detail || 'Login failed');
                return;
            }

            localStorage.setItem('accessToken', (data as TokenResponse).access_token);
            onLoginSuccess();
            navigate('/tasks'); // Navigate to tasks page on success
        } catch (err: any) {
            setError(err.message || 'Network error, please try again.');
        } finally {
            setLoading(false);
        }
    };

    const API_BASE_URL = 'http://localhost:8000'; // Define here as it's not imported from utils/api directly for fetch

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-200 to-pink-200 flex items-center justify-center p-4 font-inter">
            <div className="flex flex-col lg:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden max-w-6xl w-full">
                {/* Left Section - Image/Illustration */}
                <div className="lg:w-1/2 p-8 bg-yellow-100 flex items-center justify-center relative overflow-hidden rounded-l-3xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 to-pink-200 opacity-20"></div>
                    <div className="relative z-10 text-center">
                        <h1 className="text-4xl font-extrabold text-pink-600 mb-4">WHAT TO DO?</h1>
                        <p className="text-2xl font-semibold text-gray-800 leading-tight">
                            TELL ME WHAT <br /> YOU GONNA DO
                        </p>
                        <img
                            src="https://placehold.co/500x300/FEE440/333333?text=Illustration"
                            alt="Illustration"
                            className="mt-8 rounded-xl shadow-lg"
                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/500x300/FEE440/333333?text=Illustration"; }}
                        />
                        <p className="text-sm text-gray-600 mt-4">Art by Peter Tarka</p>
                    </div>
                </div>

                {/* Right Section - Login Form */}
                <div className="lg:w-1/2 p-10 flex flex-col justify-center">
                    <div className="text-right mb-8">
                        <span className="text-gray-600 text-sm">Don't have an account? </span>
                        <button
                            onClick={() => navigate('/signup')} // Use navigate to go to signup
                            className="text-pink-600 hover:underline font-semibold text-sm"
                        >
                            Sign Up
                        </button>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-800 mb-8">Sign in to <span className="text-pink-600">WHAT TO DO?</span></h2>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2 uppercase">Username</label>
                            <input
                                type="text"
                                className="shadow appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-pink-300"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2 uppercase">Password</label>
                            <input
                                type="password"
                                className="shadow appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-pink-300"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button
                            type="submit"
                            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:shadow-outline transition duration-200 ease-in-out transform hover:scale-105"
                            disabled={loading}
                        >
                            {loading ? 'SIGNING IN...' : 'SIGN IN'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
