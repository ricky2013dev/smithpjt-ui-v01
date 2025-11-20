import React, { useState } from 'react';
import Header from './Header';
import LoginModal from './LoginModal';

const HomePage: React.FC = () => {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const handleLoginClick = () => {
        setIsLoginModalOpen(true);
    };

    const handleCloseLoginModal = () => {
        setIsLoginModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans selection:bg-orange-100 dark:selection:bg-orange-900/30">
            <Header onLoginClick={handleLoginClick} showLoginButton={true} />

            <main className="flex-grow flex flex-col items-center justify-center px-6 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-orange-200/20 dark:bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
                    <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '1s' }}></div>
                </div>

                <div className="max-w-4xl w-full z-10 text-center space-y-12">

                    {/* Hero Section */}
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30 text-orange-600 dark:text-orange-400 text-xs font-medium uppercase tracking-wider mb-4">
                            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                            Next Gen Automation
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-slate-400">
                                Multimodal Intelligence
                            </span>
                            <br />
                            <span className="text-4xl md:text-6xl text-slate-400 dark:text-slate-500 font-normal">
                                for Complex Workflows
                            </span>
                        </h1>
                    </div>

                    {/* Mission Statement */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-blue-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                        <div className="relative bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-8 md:p-12 rounded-xl shadow-sm">
                            <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                                Our mission is to solve the challenge of repetitive yet complex business tasks through <span className="text-slate-900 dark:text-white font-medium">multimodal intelligence</span>.
                                By combining <span className="text-slate-900 dark:text-white font-medium">document analysis</span> with <span className="text-slate-900 dark:text-white font-medium">autonomous voice AI</span>,
                                we decipher intricate operational workflows and interrogate live sources to bridge data gaps, providing a complete,
                                crystalline view of transactional status and providing <span className="text-orange-600 dark:text-orange-500 font-semibold">100% end-to-end automation</span>.
                            </p>
                        </div>
                    </div>

                    {/* CTA / Visual Indicator */}
                    <div className="pt-8 flex justify-center gap-6">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-700 flex items-center justify-center text-orange-500">
                                <span className="material-symbols-outlined">description</span>
                            </div>
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Docs</span>
                        </div>
                        <div className="h-px w-12 bg-slate-300 dark:bg-slate-700 self-center"></div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-700 flex items-center justify-center text-blue-500">
                                <span className="material-symbols-outlined">graphic_eq</span>
                            </div>
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Voice</span>
                        </div>
                        <div className="h-px w-12 bg-slate-300 dark:bg-slate-700 self-center"></div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/20 flex items-center justify-center text-white">
                                <span className="material-symbols-outlined">auto_awesome</span>
                            </div>
                            <span className="text-xs font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wide">Solved</span>
                        </div>
                    </div>

                </div>
            </main>

            <footer className="py-6 text-center text-slate-400 dark:text-slate-600 text-sm">
                © {new Date().getFullYear()} Smith AI Center. All rights reserved.
            </footer>

            <LoginModal isOpen={isLoginModalOpen} onClose={handleCloseLoginModal} />
        </div>
    );
};

export default HomePage;
