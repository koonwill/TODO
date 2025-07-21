import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest, type User } from '../utils/api';
import signupImage from '../assets/signup.png'; // Import the image

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
            <div className="absolute top-5 right-8 text-right z-20">
                        <span className="text-gray-600 font-semibold text-sm">Already a member? </span>
                        <button
                            onClick={() => navigate('/login')}
                            className="text-primary hover:underline font-semibold text-sm"
                        >
                            Sign In
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

                {/* Right Section - Sign Up Form */}
                <div className="lg:w-3/4 px-80 flex flex-col justify-center bg-white shadow-2xl leading-loose">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8">Sign up to <span className="text-w">W</span>
                    <span>HAT </span>
                    <span className='text-t'>T</span>
                    <span>O </span>
                    <span className='text-d'>D</span>
                    <span className='text-o'>O</span>
                    </h2>

                    <form onSubmit={handleSignUp} className="space-y-6">
                        <div>
                            <label className="block text-gray-700  text-sm font-bold mb-2 uppercase">Username</label>
                            <input
                                type="text"
                                className="appearance-none bg-gray-100 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-pink-300"
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
                                className="appearance-none rounded-xl w-full py-3 px-4 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-pink-300"
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
                                className="appearance-none rounded-xl w-full py-3 px-4 text-gray-700 bg-gray-100 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-pink-300"
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
