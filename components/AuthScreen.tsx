
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';

type AuthView = 'login' | 'register' | 'forgot';

const AuthScreen: React.FC = () => {
    const [view, setView] = useState<AuthView>('login');
    const { login, register } = useAppContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (view === 'login') {
            if (!login(email, password)) {
                setError('Invalid credentials. Please try again.');
            }
        } else if (view === 'register') {
            if (register(email, password)) {
                setSuccess('Registration successful! Your account is pending approval by an administrator.');
                setView('login');
                setEmail('');
                setPassword('');
            } else {
                setError('An account with this email already exists.');
            }
        } else {
            setSuccess('If an account with this email exists, a password reset link has been sent.');
            setView('login');
        }
    };

    const renderForm = () => {
        switch (view) {
            case 'login':
                return (
                    <>
                        <h2 className="text-3xl font-bold font-serif text-center text-accent mb-6">Welcome Back</h2>
                        <input
                            type="text"
                            placeholder="Email or Mobile"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 mb-4 bg-secondary border border-primary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 mb-4 bg-secondary border border-primary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button type="submit" className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors">
                            Login
                        </button>
                        <div className="text-center mt-4">
                            <button onClick={() => setView('forgot')} className="text-sm text-text-light hover:text-accent">Forgot Password?</button>
                        </div>
                        <p className="text-center mt-6 text-text-light">
                            New here? <button onClick={() => setView('register')} className="font-semibold text-accent hover:underline">Create an Account</button>
                        </p>
                    </>
                );
            case 'register':
                return (
                    <>
                        <h2 className="text-3xl font-bold font-serif text-center text-accent mb-6">Join Us</h2>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 mb-4 bg-secondary border border-primary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input
                            type="password"
                            placeholder="Create Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 mb-4 bg-secondary border border-primary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button type="submit" className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors">
                            Register
                        </button>
                         <p className="text-center mt-6 text-text-light">
                            Already have an account? <button onClick={() => setView('login')} className="font-semibold text-accent hover:underline">Login</button>
                        </p>
                    </>
                );
            case 'forgot':
                 return (
                    <>
                        <h2 className="text-3xl font-bold font-serif text-center text-accent mb-6">Reset Password</h2>
                        <input
                            type="email"
                            placeholder="Enter your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 mb-4 bg-secondary border border-primary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button type="submit" className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors">
                            Send Reset Link
                        </button>
                         <p className="text-center mt-6 text-text-light">
                            Remembered your password? <button onClick={() => setView('login')} className="font-semibold text-accent hover:underline">Login</button>
                        </p>
                    </>
                );
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center">{error}</p>}
                    {success && <p className="bg-green-100 text-green-700 p-3 rounded-lg text-center">{success}</p>}
                    {renderForm()}
                </form>
            </div>
        </div>
    );
};

export default AuthScreen;
