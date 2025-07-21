import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest, type TokenResponse, type ErrorResponse } from '../utils/api';
import signupImage from '../assets/signup.png'; // Import the image

interface LoginPageProps {
    onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const formBody = new URLSearchParams();
            formBody.append('username', username);
            formBody.append('password', password);

            const API_BASE_URL = 'http://localhost:8000'; // Define here as it's not imported from utils/api directly for fetch
            const response = await fetch(`${API_BASE_URL}/token`, {
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
            navigate('/tasks');
        } catch (err: any) {
            setError(err.message || 'Network error, please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex font-inter shadow-2xl overflow-hidden">
            <div className="absolute top-5 right-8 text-right z-20">
                <span className="text-gray-600 font-semibold text-sm">Don't have an account? </span>
                <button
                    onClick={() => navigate('/signup')}
                    className="text-primary hover:underline font-semibold text-sm"
                >
                    Sign Up
                </button>
            </div>
            <div className="flex flex-col lg:flex-row w-full">
                <div className="lg:w-3/6 p-8 flex items-center justify-center relative">
                    <div className="relative z-10 text-left">
                        <h1 className='font-extrabold'><span className="text-w">W</span>
                    <span>HAT </span>
                    <span className='text-t'>T</span>
                    <span>O </span>
                    <span className='text-d'>D</span>
                    <span className='text-o'>O</span></h1>
                        <h1 className="mt-8 text-4xl font-extrabold tracking-widest leading-normal">WHAT TO DO? <br />
                            TELL ME WHAT <br /> 
                            YOU GONNA DO
                        </h1>
                        <img
                            src={signupImage}
                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/500x300/FEE440/333333?text=Illustration"; }}
                        />
                        <p className="text-s font-semibold mt-4 justify-self-start">Art by Peter Tarka</p>
                    </div>
                </div>

                {/* Right Section - Login Form */}
                <div className="lg:w-3/4 px-80 flex flex-col justify-center bg-white shadow-2xl">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8">Sign in to
                    <span className="text-w"> W</span>
                    <span>HAT </span>
                    <span className='text-t'>T</span>
                    <span>O </span>
                    <span className='text-d'>D</span>
                    <span className='text-o'>O</span>
                    </h2>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2 uppercase">Username</label>
                            <input
                                type="text"
                                className="appearance-none rounded-xl w-full py-3 px-4 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-pink-300"
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
                                className="appearance-none rounded-xl w-full py-3 px-4 text-gray-700 bg-gray-100 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-pink-300"
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
