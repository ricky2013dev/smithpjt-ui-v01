import React from 'react';

interface HeaderProps {
  onLogoClick?: () => void;
  currentUser?: {
    name: string;
    email: string;
    username: string;
  } | null;
  onLogout?: () => void;
  onLoginClick?: () => void;
  showLoginButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick, currentUser, onLogout, onLoginClick }) => {
  return (
    <header className="bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 px-6 py-3 shrink-0 sticky top-0 z-50">
      <div className="flex items-center justify-between w-full">
        <div
          className="flex items-center gap-3 cursor-pointer hover:opacity-70 transition-opacity w-fit"
          onClick={onLogoClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onLogoClick?.();
            }
          }}
        >
          {/* Robot Logo */}
          <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl text-slate-700 dark:text-slate-300">
              smart_toy
            </span>
          </div>

          {/* Title and Subtitle */}
          <div>
            <h1 className="flex items-baseline gap-1">

              <span className="font-handwriting tracking-wide rotate-[-0deg] font-bold text-orange-600 dark:text-orange-500 tracking-tight text-lg">Smith</span>
              <span className="text-sm font-medium text-slate-900 dark:text-white">AI Center</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] font-medium uppercase tracking-wider mt-0.5">
              Insurance Verification
            </p>
          </div>
        </div>

        {/* User Info and Logout */}
        {onLogout ? (
          <div className="flex items-center gap-4">
            {/* User Info */}
            {currentUser && (
              <div className="text-right">
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-md">person</span>
                  <span className="text-xs ml-1">{currentUser.name}</span>
                </div>
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1.5 text-xs font-medium transition-colors"
              title="Logout"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              Logout
            </button>
          </div>
        ) : onLoginClick ? (
          /* Login Button for Home Page */
          <button
            onClick={onLoginClick}
            className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-medium rounded-lg shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 flex items-center gap-2 group"
          >
            <span>B2B Demo Login</span>
            <span className="material-symbols-outlined text-sm group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
          </button>
        ) : null}
      </div>
    </header>
  );
};

export default Header;
