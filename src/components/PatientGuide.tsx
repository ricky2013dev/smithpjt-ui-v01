import React from 'react';

interface PatientGuideProps {
  totalPatients?: number;
  verificationStats?: {
    verified: number;
    inProgress: number;
    pending: number;
    notStarted: number;
  };
  onAddNewPatient?: () => void;
}

const PatientGuide: React.FC<PatientGuideProps> = ({
  totalPatients = 0,
  verificationStats = { verified: 0, inProgress: 0, pending: 0, notStarted: 0 },
  onAddNewPatient
}) => {
  return (
    <section className="hidden w-0 flex-1 flex-col bg-background-light dark:bg-background-dark lg:flex lg:w-[75%] overflow-y-auto">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            Insurance Verification Overview
          </h2>
          <div className="flex items-center gap-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Select a patient from the list to review their insurance verification status, or add a new patient to begin the verification process.
            </p>
            <button
              onClick={onAddNewPatient}
              className="px-3 py-1.5 bg-slate-900 dark:bg-slate-800 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-700 flex items-center gap-1.5 text-xs font-medium shrink-0"
            >
              <span className="material-symbols-outlined text-base">add</span>
              Add New Patient
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Total Patients */}
          <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-xl text-slate-600 dark:text-slate-400">
                  groups
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Total Patients</p>
                <p className="text-2xl font-semibold text-slate-900 dark:text-white">{totalPatients}</p>
              </div>
            </div>
          </div>

          {/* Fully Verified */}
          <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-status-green/10 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-xl text-status-green">
                  verified
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Fully Verified</p>
                <p className="text-2xl font-semibold text-status-green">{verificationStats.verified}</p>
              </div>
            </div>
          </div>

          {/* In Progress */}
          <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-xl text-slate-600 dark:text-slate-400">
                  pending
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">In Progress</p>
                <p className="text-2xl font-semibold text-slate-900 dark:text-white">{verificationStats.inProgress}</p>
              </div>
            </div>
          </div>

          {/* Pending Action */}
          <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-status-orange/10 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-xl text-status-orange">
                  schedule
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Pending Action</p>
                <p className="text-2xl font-semibold text-status-orange">{verificationStats.pending}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Progress Chart */}
        <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 mb-8">
          <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-4">
            Verification Status Breakdown
          </h3>
          <div className="space-y-3">
            {/* Verified Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Fully Verified</span>
                <span className="text-xs font-medium text-status-green">{verificationStats.verified} patients</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5">
                <div
                  className="bg-status-green h-1.5 transition-all duration-300"
                  style={{ width: `${totalPatients > 0 ? (verificationStats.verified / totalPatients) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* In Progress Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">In Progress</span>
                <span className="text-xs font-medium text-slate-900 dark:text-white">{verificationStats.inProgress} patients</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5">
                <div
                  className="bg-slate-900 dark:bg-white h-1.5 transition-all duration-300"
                  style={{ width: `${totalPatients > 0 ? (verificationStats.inProgress / totalPatients) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Pending Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Pending Action</span>
                <span className="text-xs font-medium text-status-orange">{verificationStats.pending} patients</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5">
                <div
                  className="bg-status-orange h-1.5 transition-all duration-300"
                  style={{ width: `${totalPatients > 0 ? (verificationStats.pending / totalPatients) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Not Started Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Not Started</span>
                <span className="text-xs font-medium text-slate-400">{verificationStats.notStarted} patients</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5">
                <div
                  className="bg-slate-300 dark:bg-slate-600 h-1.5 transition-all duration-300"
                  style={{ width: `${totalPatients > 0 ? (verificationStats.notStarted / totalPatients) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
};

export default PatientGuide;
