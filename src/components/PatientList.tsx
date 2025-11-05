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

  const getEmail = (patient: Patient) => {
    return patient.telecom.find(t => t.system === 'email')?.value || '';
  };

  const getPhone = (patient: Patient) => {
    return patient.telecom.find(t => t.system === 'phone')?.value || '';
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getVerificationStatus = (patient: Patient) => {
    if (!patient.verificationStatus) {
      return { text: 'Not Started', color: 'text-slate-400', step: 0, percentage: 0 };
    }

    const { eligibilityCheck, benefitsVerification, authorization } = patient.verificationStatus;

    if (authorization === 'completed') {
      return { text: 'Verified', color: 'text-status-green', step: 3, percentage: 100 };
    }
    if (authorization === 'in_progress') {
      return { text: 'Authorization', color: 'text-primary', step: 3, percentage: 83 };
    }
    if (benefitsVerification === 'completed') {
      return { text: 'Authorization Pending', color: 'text-status-orange', step: 3, percentage: 67 };
    }
    if (benefitsVerification === 'in_progress') {
      return { text: 'Benefits Check', color: 'text-primary', step: 2, percentage: 50 };
    }
    if (eligibilityCheck === 'completed') {
      return { text: 'Benefits Pending', color: 'text-status-orange', step: 2, percentage: 33 };
    }
    if (eligibilityCheck === 'in_progress') {
      return { text: 'Eligibility Check', color: 'text-primary', step: 1, percentage: 17 };
    }

    return { text: 'Not Started', color: 'text-slate-400', step: 0, percentage: 0 };
  };

  const getStepDots = (currentStep: number) => {
    return [1, 2, 3].map((step) => {
      if (step < currentStep) {
        return 'bg-status-green';
      } else if (step === currentStep) {
        return 'bg-primary';
      } else {
        return 'bg-slate-300 dark:bg-slate-600';
      }
    });
  };

  return (
    <aside className="flex w-full flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50 lg:w-[30%] lg:shrink-0">
      {/* Search and Filters */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <label className="flex flex-col min-w-40 h-11 w-full">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
            <div className="text-slate-400 flex border border-r-0 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 items-center justify-center pl-3 rounded-l-lg">
              <span className="material-symbols-outlined text-xl">search</span>
            </div>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-full placeholder:text-slate-400 px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal"
              placeholder="Search by name, email..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </label>

        {/* Filter Chips */}
        <div className="flex gap-2 pt-3 overflow-x-auto pb-1">
          {/* Active/Inactive Filters */}
          <button
            onClick={() => toggleFilter('Active')}
            className={`flex h-8 shrink-0 items-center justify-center px-3 rounded-lg text-sm font-medium transition-colors ${
              activeFilters.includes('Active')
                ? 'bg-status-green text-white'
                : 'border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => toggleFilter('Inactive')}
            className={`flex h-8 shrink-0 items-center justify-center px-3 rounded-lg text-sm font-medium transition-colors ${
              activeFilters.includes('Inactive')
                ? 'bg-status-red text-white'
                : 'border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            Inactive
          </button>

          <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 self-center mx-1"></div>

          {/* Verification Step Filters */}
          <button
            onClick={() => toggleFilter('Eligibility')}
            className={`flex h-8 shrink-0 items-center justify-center px-3 rounded-lg text-sm font-medium transition-colors ${
              activeFilters.includes('Eligibility')
                ? 'bg-primary text-white'
                : 'border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            Eligibility
          </button>
          <button
            onClick={() => toggleFilter('Verification')}
            className={`flex h-8 shrink-0 items-center justify-center px-3 rounded-lg text-sm font-medium transition-colors ${
              activeFilters.includes('Verification')
                ? 'bg-primary text-white'
                : 'border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            Verification
          </button>
          <button
            onClick={() => toggleFilter('Authorization')}
            className={`flex h-8 shrink-0 items-center justify-center px-3 rounded-lg text-sm font-medium transition-colors ${
              activeFilters.includes('Authorization')
                ? 'bg-primary text-white'
                : 'border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            Authorization
          </button>
        </div>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-[1fr,200px] gap-4 px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
        <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          Patient Information
        </div>
        <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-center">
          Verification Status
        </div>
      </div>

      {/* Patient List */}
      <div className="flex-1 overflow-y-auto">
        {patients.map((patient) => {
          const fullName = getFullName(patient);
          const email = getEmail(patient);
          const phone = getPhone(patient);
          const age = calculateAge(patient.birthDate);
          const verificationStatus = getVerificationStatus(patient);
          const stepDots = getStepDots(verificationStatus.step);
          const isSelected = selectedPatientId === patient.id;

          return (
            <div
              key={patient.id}
              onClick={() => onSelectPatient(patient.id)}
              className={`grid grid-cols-[1fr,200px] cursor-pointer items-center gap-4 px-4 min-h-[72px] py-3 ${
                isSelected
                  ? 'bg-primary/10 dark:bg-primary/20 border-r-4 border-primary'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              {/* Column 1: Patient Info */}
              <div className="flex items-start gap-4 min-w-0">
                <div className={`rounded-full h-12 w-12 ${patient.active ? 'bg-status-green' : 'bg-status-red'} flex flex-col items-center justify-center shrink-0 relative`}>
                  <span className="material-symbols-outlined text-white text-xl">
                    person
                  </span>
                  <span className="text-white text-[8px] font-semibold uppercase leading-none">
                    {patient.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex flex-col justify-center flex-1 min-w-0">
                  <p className="text-slate-900 dark:text-white text-base font-semibold leading-normal line-clamp-1">
                    {fullName}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal line-clamp-1">
                    {email}
                  </p>
                  {phone && (
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal line-clamp-1">
                      <span className="material-symbols-outlined text-xs align-middle mr-1">phone</span>
                      {phone}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="capitalize">
                      <span className="material-symbols-outlined text-xs align-middle mr-1">person</span>
                      {patient.gender}
                    </span>
                    <span>
                      <span className="material-symbols-outlined text-xs align-middle mr-1">cake</span>
                      {age} years
                    </span>
                    <span className="line-clamp-1">
                      ID: {patient.id}
                    </span>
                  </div>
                </div>
              </div>

              {/* Column 2: Verification Status */}
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="flex items-center gap-2">
                  {stepDots.map((dotColor, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full ${dotColor}`}
                    />
                  ))}
                </div>
                <span className={`text-2xl font-bold ${verificationStatus.color} text-center whitespace-nowrap`}>
                  {verificationStatus.percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default PatientList;
