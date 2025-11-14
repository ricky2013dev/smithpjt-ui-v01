import React from 'react';

interface HeaderProps {
  onLogoClick?: () => void;
  isAdmin?: boolean;
  onToggleAdmin?: (isAdmin: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick, isAdmin = false, onToggleAdmin }) => {
  return (
    <header className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 px-6 py-4 shrink-0">
      <div className="flex items-center justify-between">
        <div
          className="flex items-center gap-4 cursor-pointer hover:opacity-90 transition-opacity w-fit"
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
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
            <span className="material-symbols-outlined text-4xl text-white drop-shadow-lg">
              smart_toy
            </span>
          </div>

          {/* Title and Subtitle */}
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight drop-shadow-lg">
              Smith AI Center
            </h1>
            <p className="text-cyan-50 text-sm font-medium drop-shadow">
              Real-time Insurance Verification & Coverage Monitoring
            </p>
          </div>
        </div>

        {/* Admin Toggle - Small, compact version */}
        {onToggleAdmin && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleAdmin(!isAdmin)}
              className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${
                isAdmin ? 'bg-red-500' : 'bg-slate-400'
              }`}
              aria-label="Toggle admin mode"
              title={isAdmin ? 'Admin Mode - Click to switch to User Mode' : 'User Mode - Click to switch to Admin Mode'}
            >
              <span
                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                  isAdmin ? 'translate-x-[18px]' : 'translate-x-0.5'
                }`}
              />
            </button>
            <span className="material-symbols-outlined text-white text-base drop-shadow">
              {isAdmin ? 'admin_panel_settings' : 'person'}
            </span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
