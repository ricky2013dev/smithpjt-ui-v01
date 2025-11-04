import React from 'react';
import { Patient } from '../types/patient';

interface PatientListProps {
  patients: Patient[];
  selectedPatientId: string;
  searchQuery: string;
  activeFilters: string[];
  onSelectPatient: (id: string) => void;
  onSearchChange: (query: string) => void;
  onRemoveFilter: (filter: string) => void;
}

const PatientList: React.FC<PatientListProps> = ({
  patients,
  selectedPatientId,
  searchQuery,
  activeFilters,
  onSelectPatient,
  onSearchChange,
  onRemoveFilter,
}) => {
  const getFullName = (patient: Patient) => {
    const given = patient.name.given.join(' ');
    return `${given} ${patient.name.family}`.trim();
  };

  const getEmail = (patient: Patient) => {
    return patient.telecom.find(t => t.system === 'email')?.value || '';
  };

  const getStatusStyle = (active: boolean) => {
    return active
      ? {
          bg: 'bg-status-green/20',
          text: 'text-status-green',
          label: 'Active'
        }
      : {
          bg: 'bg-status-red/20',
          text: 'text-status-red',
          label: 'Inactive'
        };
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
        <div className="flex gap-2 pt-3 overflow-x-auto">
          <button className="flex h-8 shrink-0 items-center justify-center gap-x-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 hover:bg-slate-100 dark:hover:bg-slate-700">
            <span className="material-symbols-outlined text-base text-slate-600 dark:text-slate-300">
              filter_list
            </span>
            <p className="text-slate-700 dark:text-slate-200 text-sm font-medium">
              Filter
            </p>
          </button>
          {activeFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => onRemoveFilter(filter)}
              className="flex h-8 shrink-0 items-center justify-center gap-x-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <p className="text-slate-700 dark:text-slate-200 text-sm font-medium">
                {filter}
              </p>
              <span className="material-symbols-outlined text-base text-slate-600 dark:text-slate-300">
                close
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Patient List */}
      <div className="flex-1 overflow-y-auto">
        {patients.map((patient) => {
          const fullName = getFullName(patient);
          const email = getEmail(patient);
          const statusStyle = getStatusStyle(patient.active);
          const isSelected = selectedPatientId === patient.id;

          return (
            <div
              key={patient.id}
              onClick={() => onSelectPatient(patient.id)}
              className={`flex cursor-pointer items-center gap-4 px-4 min-h-[72px] py-2 justify-between ${
                isSelected
                  ? 'bg-primary/10 dark:bg-primary/20 border-r-4 border-primary'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="rounded-full h-12 w-12 bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white text-2xl">
                    person
                  </span>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-slate-900 dark:text-white text-base font-semibold leading-normal line-clamp-1">
                    {fullName}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal line-clamp-2">
                    {email}
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                <div className={`flex items-center justify-center rounded-full ${statusStyle.bg} px-2.5 py-1`}>
                  <p className={`text-xs font-semibold ${statusStyle.text}`}>
                    {statusStyle.label}
                  </p>
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
