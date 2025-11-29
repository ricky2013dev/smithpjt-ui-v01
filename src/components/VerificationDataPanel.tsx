import React, { useState } from 'react';

export interface VerificationDataRow {
  saiCode: string;
  refInsCode: string;
  category: string;
  fieldName: string;
  preStepValue: string;
  missing: string;
  aiCallValue: string;
  verifiedBy: string;
  isUpdating?: boolean;
  isChecking?: boolean;
}

interface VerificationDataPanelProps {
  data: VerificationDataRow[];
  showTabs?: boolean;
  title?: string;
  subtitle?: string;
  activeTab?: 'missing' | 'verified';
  onTabChange?: (tab: 'missing' | 'verified') => void;
}

const VerificationDataPanel: React.FC<VerificationDataPanelProps> = ({
  data,
  showTabs = true,
  title = "Live Verification Data Updates",
  subtitle = "Watching",
  activeTab: propActiveTab,
  onTabChange: propOnTabChange
}) => {
  const [internalTab, setInternalTab] = useState<'missing' | 'verified'>('verified');
  const verificationTab = propActiveTab ?? internalTab;
  const setVerificationTab = (tab: 'missing' | 'verified') => {
    setInternalTab(tab);
    propOnTabChange?.(tab);
  };

  const filteredData = showTabs
    ? data.filter(row =>
        verificationTab === 'missing'
          ? row.missing === 'Y'
          : row.missing === 'N'
      )
    : data;

  const missingCount = data.filter(r => r.missing === 'Y').length;
  const verifiedCount = data.filter(r => r.missing === 'N').length;

  return (
    <div className="flex-1 bg-white dark:bg-slate-900 overflow-hidden flex flex-col border border-slate-200 dark:border-slate-700 rounded-lg">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {subtitle} {data.length} fields
        </p>
      </div>

      {/* Verification Tabs - Only show if showTabs is true */}
      {showTabs && (
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setVerificationTab('missing')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-2 ${
              verificationTab === 'missing'
                ? 'bg-status-red/10 text-status-red border border-status-red/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-sm">pending</span>
            Missing Fields ({missingCount})
          </button>
          <button
            onClick={() => setVerificationTab('verified')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-2 ${
              verificationTab === 'verified'
                ? 'bg-status-green/10 text-status-green border border-status-green/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-sm">check_circle</span>
            Verified Fields ({verifiedCount})
          </button>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/50 sticky top-0">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-slate-600 dark:text-slate-400">Insurance Code</th>
              <th className="px-3 py-2 text-left font-medium text-slate-600 dark:text-slate-400">Field Name</th>
              <th className="px-3 py-2 text-left font-medium text-slate-600 dark:text-slate-400">Value</th>
              <th className="px-3 py-2 text-center font-medium text-slate-600 dark:text-slate-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredData.map((row, index) => (
              <tr
                key={index}
                className={`transition-colors ${row.isUpdating
                  ? 'bg-green-50 dark:bg-green-900/20'
                  : row.isChecking
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
              >
                <td className="px-3 py-2 font-mono text-slate-900 dark:text-white">
                  <div className="flex items-center gap-2">
                    {row.isChecking && (
                      <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {row.refInsCode}
                  </div>
                </td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    {row.fieldName}
                    {row.isChecking && (
                      <span className="text-blue-600 dark:text-blue-400 text-[10px] font-semibold animate-pulse">
                        Checking...
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2 text-slate-900 dark:text-white font-medium">
                  {row.aiCallValue || (
                    <span className="text-slate-400 dark:text-slate-500 italic">Pending...</span>
                  )}
                </td>
                <td className="px-3 py-2 text-center">
                  <span className={`text-xs font-semibold ${row.aiCallValue
                    ? 'text-status-green'
                    : 'text-status-red'
                    }`}>
                    {row.aiCallValue ? 'Yes' : 'No'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VerificationDataPanel;
