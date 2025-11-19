import React from 'react';
import { Patient, FilterType } from '../types/patient';

interface PatientListProps {
  patients: Patient[];
  selectedPatientId: string | null;
  searchQuery: string;
  activeFilters: string[];
  onSelectPatient: (id: string) => void;
  onSearchChange: (query: string) => void;
  onRemoveFilter: (filter: string) => void;
  onAddFilter: (filter: FilterType) => void;
  isAdmin?: boolean;
}

const PatientList: React.FC<PatientListProps> = ({
  patients,
  selectedPatientId,
  searchQuery,
  activeFilters,
  onSelectPatient,
  onSearchChange,
  onRemoveFilter,
  onAddFilter,
  isAdmin = false,
}) => {
  const toggleFilter = (filter: FilterType) => {
    if (activeFilters.includes(filter)) {
      onRemoveFilter(filter);
    } else {
      onAddFilter(filter);
    }
  };

  const getFullName = (patient: Patient) => {
    const given = patient.name.given.join(' ');
    return `${given} ${patient.name.family}`.trim();
  };

  const getInitials = (patient: Patient) => {
    const given = patient.name.given[0] || '';
    const family = patient.name.family || '';
    return `${given.charAt(0)}${family.charAt(0)}`.toUpperCase();
  };

  const getVerificationStatus = (patient: Patient) => {
    if (!patient.verificationStatus) {
      return { text: 'Not Started', color: 'text-slate-400', step: 0, percentage: 0 };
    }

    const { eligibilityCheck, benefitsVerification, aiCallVerification, sendToPMS } = patient.verificationStatus;

    if (sendToPMS === 'completed') {
      return { text: 'Verified', color: 'text-status-green', step: 4, percentage: 100 };
    }
    if (sendToPMS === 'in_progress') {
      return { text: 'Sending to PMS', color: 'text-primary', step: 4, percentage: 87 };
    }
    if (aiCallVerification === 'completed') {
      return { text: 'PMS Pending', color: 'text-status-orange', step: 4, percentage: 75 };
    }
    if (aiCallVerification === 'in_progress') {
      return { text: 'AI Call Verification', color: 'text-primary', step: 3, percentage: 62 };
    }
    if (benefitsVerification === 'completed') {
      return { text: 'AI Call Pending', color: 'text-status-orange', step: 3, percentage: 50 };
    }
    if (benefitsVerification === 'in_progress') {
      return { text: 'Benefits Check', color: 'text-primary', step: 2, percentage: 37 };
    }
    if (eligibilityCheck === 'completed') {
      return { text: 'Benefits Pending', color: 'text-status-orange', step: 2, percentage: 25 };
    }
    if (eligibilityCheck === 'in_progress') {
      return { text: 'Eligibility Check', color: 'text-primary', step: 1, percentage: 12 };
    }

    return { text: 'Not Started', color: 'text-slate-400', step: 0, percentage: 0 };
  };

  return (
    <aside className="flex w-full flex-col border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 lg:w-[15%] lg:shrink-0">
      {/* Search and Filters */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <label className="flex flex-col min-w-40 h-10 w-full">
          <div className="flex w-full flex-1 items-stretch rounded-md h-full">
            <div className="text-slate-400 flex border border-r-0 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 items-center justify-center pl-3 rounded-l-md">
              <span className="material-symbols-outlined text-lg">search</span>
            </div>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-slate-900 dark:text-white focus:outline-0 focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-600 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 h-full placeholder:text-slate-400 px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal"
              placeholder="Search by name"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </label>

        {/* Filter Chips - Only visible for admin */}
        {isAdmin && (
          <div className="flex gap-2 pt-3 overflow-x-auto pb-1">
            {/* Active/Inactive Filters */}
            <button
              onClick={() => toggleFilter('Active')}
              className={`flex h-7 shrink-0 items-center justify-center px-3 rounded-md text-xs font-medium transition-colors ${
                activeFilters.includes('Active')
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => toggleFilter('Inactive')}
              className={`flex h-7 shrink-0 items-center justify-center px-3 rounded-md text-xs font-medium transition-colors ${
                activeFilters.includes('Inactive')
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Inactive
            </button>

            <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 self-center mx-1"></div>

            {/* Verification Step Filters */}
            <button
              onClick={() => toggleFilter('Eligibility')}
              className={`flex h-7 shrink-0 items-center justify-center px-3 rounded-md text-xs font-medium transition-colors ${
                activeFilters.includes('Eligibility')
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Eligibility
            </button>
            <button
              onClick={() => toggleFilter('Verification')}
              className={`flex h-7 shrink-0 items-center justify-center px-3 rounded-md text-xs font-medium transition-colors ${
                activeFilters.includes('Verification')
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Verification
            </button>

          </div>
        )}
      </div>

      {/* Column Headers */}
      <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
        <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          Patients
        </div>
      </div>

      {/* Patient List */}
      <div className="flex-1 overflow-y-auto">
        {patients.map((patient) => {
          const fullName = getFullName(patient);
          const verificationStatus = getVerificationStatus(patient);
          const isSelected = selectedPatientId === patient.id;

          return (
            <div
              key={patient.id}
              onClick={() => onSelectPatient(patient.id)}
              className={`cursor-pointer px-3 py-3 border-b border-slate-100 dark:border-slate-800 ${
                isSelected
                  ? 'bg-slate-100 dark:bg-slate-800 border-l-2 border-l-slate-900 dark:border-l-white'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              {/* Patient Info */}
              <div className="flex items-center gap-2">
                <div className={`rounded-full h-8 w-8 flex items-center justify-center shrink-0 ${
                  verificationStatus.percentage === 100
                    ? 'bg-status-green/20'
                    : verificationStatus.percentage >= 50
                      ? 'bg-status-orange/20'
                      : 'bg-slate-100 dark:bg-slate-800'
                }`}>
                  <span className={`text-xs font-medium ${
                    verificationStatus.percentage === 100
                      ? 'text-status-green'
                      : verificationStatus.percentage >= 50
                        ? 'text-status-orange'
                        : 'text-slate-700 dark:text-slate-300'
                  }`}>
                    {getInitials(patient)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-900 dark:text-white text-xs font-medium truncate mb-1">
                    {fullName}
                  </p>
                  {/* Verification Progress Bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-700">
                      <div
                        className={`h-1 transition-all ${
                          verificationStatus.percentage > 0
                            ? 'bg-slate-400 dark:bg-slate-500'
                            : 'bg-slate-300 dark:bg-slate-600'
                        }`}
                        style={{ width: `${verificationStatus.percentage}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-900 dark:text-white shrink-0">
                      {verificationStatus.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default PatientList;
