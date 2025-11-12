import React from 'react';

interface PatientGuideProps {
  totalPatients?: number;
  verificationStats?: {
    verified: number;
    inProgress: number;
    pending: number;
    notStarted: number;
  };
}

const PatientGuide: React.FC<PatientGuideProps> = ({
  totalPatients = 0,
  verificationStats = { verified: 0, inProgress: 0, pending: 0, notStarted: 0 }
}) => {
  return (
    <section className="hidden w-0 flex-1 flex-col bg-background-light dark:bg-background-dark lg:flex lg:w-[75%] overflow-y-auto">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Insurance Verification Overview
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Select a patient from the list to view detailed information
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Total Patients */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <span className="material-symbols-outlined text-3xl text-primary">
                  groups
                </span>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Patients</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalPatients}</p>
              </div>
            </div>
          </div>

          {/* Fully Verified */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-status-green/10 p-3">
                <span className="material-symbols-outlined text-3xl text-status-green">
                  verified
                </span>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Fully Verified</p>
                <p className="text-3xl font-bold text-status-green">{verificationStats.verified}</p>
              </div>
            </div>
          </div>

          {/* In Progress */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <span className="material-symbols-outlined text-3xl text-primary">
                  pending
                </span>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">In Progress</p>
                <p className="text-3xl font-bold text-primary">{verificationStats.inProgress}</p>
              </div>
            </div>
          </div>

          {/* Pending Action */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-status-orange/10 p-3">
                <span className="material-symbols-outlined text-3xl text-status-orange">
                  schedule
                </span>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Pending Action</p>
                <p className="text-3xl font-bold text-status-orange">{verificationStats.pending}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Progress Chart */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 mb-8">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
            Verification Status Breakdown
          </h3>
          <div className="space-y-4">
            {/* Verified Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Fully Verified</span>
                <span className="text-sm font-semibold text-status-green">{verificationStats.verified} patients</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-status-green h-2 rounded-full transition-all duration-300"
                  style={{ width: `${totalPatients > 0 ? (verificationStats.verified / totalPatients) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* In Progress Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">In Progress</span>
                <span className="text-sm font-semibold text-primary">{verificationStats.inProgress} patients</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${totalPatients > 0 ? (verificationStats.inProgress / totalPatients) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Pending Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Pending Action</span>
                <span className="text-sm font-semibold text-status-orange">{verificationStats.pending} patients</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-status-orange h-2 rounded-full transition-all duration-300"
                  style={{ width: `${totalPatients > 0 ? (verificationStats.pending / totalPatients) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Not Started Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Not Started</span>
                <span className="text-sm font-semibold text-slate-400">{verificationStats.notStarted} patients</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-slate-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${totalPatients > 0 ? (verificationStats.notStarted / totalPatients) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-6 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <span className="material-symbols-outlined text-3xl text-primary">
                task_alt
              </span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200 text-center">
                Verify Insurance
              </span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-6 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <span className="material-symbols-outlined text-3xl text-primary">
                receipt_long
              </span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200 text-center">
                Check Coverage
              </span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-6 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <span className="material-symbols-outlined text-3xl text-primary">
                request_quote
              </span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200 text-center">
                Submit Claim
              </span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-6 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <span className="material-symbols-outlined text-3xl text-primary">
                assessment
              </span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200 text-center">
                Coverage Report
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PatientGuide;
