import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest, type User } from '../utils/api';

const SignUpPage: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        if (!termsAccepted) {
            setError('You must accept the terms of service and privacy policy.');
            setLoading(false);
            return;
        }

        try {
            const userData = { username, email, password };
            await apiRequest<User>('POST', '/users/', userData);
            setSuccessMessage('Account created successfully! Please sign in.');
            setUsername('');
            setEmail('');
            setPassword('');
            setTermsAccepted(false);
            navigate('/login'); // Navigate to login after successful signup
        } catch (err: any) {
            setError(err.message || 'Sign up failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex font-inter shadow-2xl overflow-hidden">
            <div className="flex flex-col lg:flex-row w-full">
                <div className="lg:w-2/5 p-8 flex items-center justify-center relative">
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

                {/* Right Section - Sign Up Form */}
                <div className="lg:w-3/5 px-80 flex flex-col justify-center bg-white shadow-2xl"> {/* Changed lg:w-1/2 to lg:w-3/5 */}
                    <div className="text-right mb-8">
                        <span className="text-gray-600 text-sm">Already a member? </span>
                        <button
                            onClick={() => navigate('/login')}
                            className="text-pink-600 hover:underline font-semibold text-sm"
                        >
                            Sign In
                        </button>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-800 mb-8">Sign up to <span className="text-pink-600">WHAT TO DO?</span></h2>

                    <form onSubmit={handleSignUp} className="space-y-6">
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
                            <label className="block text-gray-700 text-sm font-bold mb-2 uppercase">Email</label>
                            <input
                                type="email"
                                className="shadow appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-pink-300"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2 uppercase">Password</label>
                            <input
                                type="password"
                                className="shadow appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-pink-300"
                                placeholder="6+ characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex items-center size">
                            <input
                                type="checkbox"
                                id="terms"
                                className="form-checkbox h-4 w-4 text-pink-600 rounded"
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                            />
                            <label htmlFor="terms" className="ml-2 text-gray-700 text-sm">
                                Creating an account means you're okay with our{' '}
                                <a href="#" className="text-primary hover:underline font-semibold">Terms of Service</a>,{' '}
                                <a href="#" className="text-primary hover:underline font-semibold">Privacy Policy</a>, and our default{' '}
                                <a href="#" className="text-primary hover:underline font-semibold">Notification Settings</a>.
                            </label>
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
                        <button
                            type="submit"
                            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:shadow-outline transition duration-200 ease-in-out transform hover:scale-105"
                            disabled={loading}
                        >
                            {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
