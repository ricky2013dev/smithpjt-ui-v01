import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // Check if screen size is desktop (width >= 1024px)
        if (window.innerWidth < 1024) {
            setErrorMessage('Desktop access only. This application is not available on your devices.');
            return;
        }

        setErrorMessage('');
        setIsLoading(true);

        // Simulate authentication delay (800ms)
        setTimeout(() => {
            navigate('/dashboard');
            onClose();
            setIsLoading(false);
        }, 800);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                    <span className="material-symbols-outlined text-2xl">close</span>
                </button>

                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-2xl text-orange-600 dark:text-orange-500">
                            lock
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome To Smith AI Center</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Sign in to access</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value="smithai.demo.user@gmail.com"
                            required
                            disabled={isLoading}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value="SmithAIDemo@123"
                            required
                            disabled={isLoading}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <div className="flex items-start gap-2">
                                <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-lg">error</span>
                                <p className="text-sm text-red-600 dark:text-red-400 font-medium">{errorMessage}</p>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg shadow-md shadow-orange-500/20 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                                <span>Signing In...</span>
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;
