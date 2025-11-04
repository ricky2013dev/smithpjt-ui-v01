import React, { useState } from 'react';
import PatientList from './PatientList';
import PatientDetail from './PatientDetail';
import { Patient, FilterType, TabType } from '../types/patient';
import patientsData from '../data/patients.json';

const patients = patientsData as Patient[];

const PatientsManagement: React.FC = () => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>('1001');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilters, setActiveFilters] = useState<FilterType[]>(['Status: Active', 'Joined: Last 30 Days']);
  const [activeTab, setActiveTab] = useState<TabType>('Demographics');

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  const handleRemoveFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
  };

  return (
    <div className="flex h-screen w-full flex-col">
      {/* Header */}
      <header className="flex items-center border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 px-4 py-3 shrink-0">
        <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 mr-4">
          person
        </span>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex-1">
          Patient Management
        </h1>
        <button className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90">
          <span className="material-symbols-outlined text-base">add</span>
          Add New Patient
        </button>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden">
        <div className="flex w-full">
          <PatientList
            patients={patients}
            selectedPatientId={selectedPatientId}
            searchQuery={searchQuery}
            activeFilters={activeFilters}
            onSelectPatient={setSelectedPatientId}
            onSearchChange={setSearchQuery}
            onRemoveFilter={handleRemoveFilter}
          />

          {selectedPatient && (
            <PatientDetail
              patient={selectedPatient}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default PatientsManagement;
