import React from 'react';

interface HeaderProps {
  onLogoClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
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
      </div>
    </header>
  );
};

export default Header;
