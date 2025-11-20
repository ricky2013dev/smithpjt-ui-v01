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
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-3 shrink-0">
      <div className="flex items-center justify-between">
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
          <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center">
            <span className="material-symbols-outlined text-xl text-slate-700 dark:text-slate-300">
              smart_toy
            </span>
          </div>

          {/* Title and Subtitle */}
          <div>
            <h1 className="flex items-baseline gap-1">

              <span className="font-handwriting  tracking-wide rotate-[-0deg] font-bold text-orange-600 dark:text-orange-500 tracking-tight">Smith</span>
              <span className="text-sm font-medium text-slate-900 dark:text-white">AI Center</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-normal mt-0.5">
              Insurance Verification & Coverage Monitoring
            </p>
          </div>
        </div>

        {/* User Info and Logout */}
        {currentUser ? (
          <div className="flex items-center gap-4">
            {/* User Info */}
            <div className="text-right">
              <div className="flex items-center">
                <span className="material-symbols-outlined text-md">person</span>
                <span className="text-xs ml-1">{currentUser.name}</span>
              </div>
            </div>

            {/* Logout Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="px-2 text-xs py-1  rounded-lg hover:bg-slate-800 dark:hover:bg-slate-700 flex items-center gap-1.5 text-sm font-medium transition-colors"
                title="Logout"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                Logout
              </button>
            )}
          </div>
        ) : (
          /* Login Button for Home Page */
          <button
            onClick={onLoginClick}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg shadow-sm shadow-orange-500/20 transition-colors flex items-center gap-2"
          >
            <span>Login</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
