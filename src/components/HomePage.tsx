import React, { useState, useEffect } from 'react';
import Header from './Header';
import LoginModal from './LoginModal';
import mermaid from 'mermaid';

const HomePage: React.FC = () => {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [showDesktopWarning, setShowDesktopWarning] = useState(false);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: true,
            theme: 'default',
            securityLevel: 'loose',
        });
        mermaid.contentLoaded();
    }, []);

    const handleLoginClick = () => {
        // Check if screen size is mobile (width < 768px) - allow tablets and desktop
        if (window.innerWidth < 768) {
            setShowDesktopWarning(true);
            setTimeout(() => setShowDesktopWarning(false), 5000); // Auto-hide after 5 seconds
            return;
        }
        setIsLoginModalOpen(true);
    };

    const handleCloseLoginModal = () => {
        setIsLoginModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans selection:bg-orange-100 dark:selection:bg-orange-900/30">
            <Header onLoginClick={handleLoginClick} showLoginButton={true} showNavigation={false} />

            {/* Desktop Warning Toast */}
            {showDesktopWarning && (
                <div className="fixed inset-x-4 top-20 md:left-1/2 md:transform md:-translate-x-1/2 z-50 animate-fade-in md:w-auto">
                    <div className="bg-red-600 text-white px-4 py-5 md:px-6 md:py-4 rounded-xl shadow-2xl md:max-w-md mx-auto">
                        <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-3xl md:text-2xl flex-shrink-0">error</span>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg md:text-lg mb-2">Mobile Not Supported</h3>
                                <p className="text-sm md:text-sm leading-relaxed">This application is not available on mobile devices. Please access from a tablet or desktop computer.</p>
                            </div>
                            <button
                                onClick={() => setShowDesktopWarning(false)}
                                className="text-white hover:text-red-200 transition-colors flex-shrink-0 p-1 -mr-1 -mt-1"
                                aria-label="Close"
                            >
                                <span className="material-symbols-outlined text-2xl">close</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

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

                    {/* Mermaid Diagram
                     <div className="relative group w-full">
                        <div className="relative bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 md:p-16 rounded-xl shadow-sm">
                            <pre className="mermaid text-center" style={{ transform: 'scale(1.2)', transformOrigin: 'center' }}>
{`
flowchart TD
  C[Multimodal Intelligence]:::pillar
    
    C --> D[Document Analysis]:::component
    C --> E[Autonomous Voice AI]:::component

    D --> F[Decipher Intricate Operational Workflows]:::action
    E --> G[Interrogate Live Sources]:::action

    F --> H[Bridge Data Gaps]:::result
    G --> H

    H --> I[Crystalline View of Transactional Status]:::outcome
    I --> J[100% End-to-End Automation]:::final

    classDef mission fill:#4b9cd3,stroke:#2c6690,color:#fff;
    classDef goal fill:#6fbf73,stroke:#3f7f47,color:#fff;
    classDef pillar fill:#f4b860,stroke:#c68a2e,color:#fff;
    classDef component fill:#e38cb7,stroke:#a0567b,color:#fff;
    classDef action fill:#c792ea,stroke:#8c57b8,color:#fff;
    classDef result fill:#ffcc66,stroke:#cc9a33,color:#000;
    classDef outcome fill:#7cd1b8,stroke:#4a8e78,color:#000;
    classDef final fill:#4ccece,stroke:#2fa0a0,color:#fff;

    `}
                            </pre>
                        </div>
                    </div>  */}

                    {/* CTA / Visual Indicator - Formula Style */}
                    <div className="pt-4 flex justify-center items-center gap-4 flex-wrap">

 


                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-700 flex items-center justify-center text-blue-500">
                               <span className="material-symbols-outlined">description</span>
                            </div>
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Document Analysis AI</span>
                        </div>

                        <div className="text-3xl font-bold text-slate-400 dark:text-slate-600 mt-[-2rem]">
                              <span className="material-symbols-outlined"> add</span>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-700 flex items-center justify-center text-blue-500">
                                <span className="material-symbols-outlined">graphic_eq</span>
                            </div>
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Autonomous Voice AI</span>
                        </div>

                       <div className="text-3xl font-bold text-slate-400 dark:text-slate-600 mt-[-2rem]"> 
                           
                             <span className="material-symbols-outlined"> Keyboard_Double_Arrow_Right</span>
                        </div>
               <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/20 flex items-center justify-center text-white">
                                <span className="material-symbols-outlined">auto_awesome</span>
                            </div>
                            <span className="text-xs font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wide">Multimodal Intelligence</span>
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
