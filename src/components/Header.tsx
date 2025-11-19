import React from 'react';

interface HeaderProps {
  onLogoClick?: () => void;
  isAdmin?: boolean;
  onToggleAdmin?: (isAdmin: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick, isAdmin = false, onToggleAdmin }) => {
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
            <h1 className="text-sm font-bold text-orange-600 dark:text-orange-500 tracking-tight uppercase">
              Smith AI Center
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] tracking-wide">
              Real-time Insurance Verification & Coverage Monitoring
            </p>
          </div>
        </div>

        {/* Admin Toggle - Minimal version */}
        {onToggleAdmin && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              {isAdmin ? 'Admin' : 'User'}
            </span>
            <button
              onClick={() => onToggleAdmin(!isAdmin)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                isAdmin ? 'bg-slate-900 dark:bg-white' : 'bg-slate-200 dark:bg-slate-700'
              }`}
              aria-label="Toggle admin mode"
              title={isAdmin ? 'Admin Mode - Click to switch to User Mode' : 'User Mode - Click to switch to Admin Mode'}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full transition-transform ${
                  isAdmin ? 'translate-x-[19px] bg-white dark:bg-slate-900' : 'translate-x-0.5 bg-white dark:bg-slate-400'
                }`}
              />
            </button>
            <span className="material-symbols-outlined text-slate-600 dark:text-slate-400 text-lg">
              {isAdmin ? 'admin_panel_settings' : 'person'}
            </span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
