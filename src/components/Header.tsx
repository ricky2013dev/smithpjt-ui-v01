import React from 'react';

interface HeaderProps {
  onLogoClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <header className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 px-6 py-4 shrink-0">
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
    </header>
  );
};

export default Header;
