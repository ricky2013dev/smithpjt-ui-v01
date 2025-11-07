import React, { useState } from 'react';
import PatientList from './PatientList';
import PatientDetail from './PatientDetail';
import Dashboard from './Dashboard';
import PatientGuide from './PatientGuide';
import Header from './Header';
import { Patient, FilterType, TabType } from '../types/patient';
import patientsData from '../data/patients.json';

const patients = patientsData as Patient[];

const PatientsManagement: React.FC = () => {
  const [viewMode, setViewMode] = useState<'dashboard' | 'list'>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilters, setActiveFilters] = useState<FilterType[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('Demographics');

  // Filter and search patients
  const filteredPatients = React.useMemo(() => {
    return patients.filter(patient => {
      // Search filter
      if (searchQuery) {
        const fullName = `${patient.name.given.join(' ')} ${patient.name.family}`.toLowerCase();
        const email = patient.telecom.find(t => t.system === 'email')?.value.toLowerCase() || '';
        const query = searchQuery.toLowerCase();

        if (!fullName.includes(query) && !email.includes(query)) {
          return false;
        }
      }

      // Active/Inactive filters
      if (activeFilters.includes('Active') && !patient.active) return false;
      if (activeFilters.includes('Inactive') && patient.active) return false;

      // Verification step filters (OR logic - if any step filter is active, show patients matching any of those steps)
      const stepFilters = activeFilters.filter(f =>
        f === 'Eligibility' || f === 'Verification' || f === 'Authorization'
      );
      if (stepFilters.length > 0) {
        const getPatientVerificationStep = (p: Patient) => {
          if (!p.verificationStatus) return 0;
          const { eligibilityCheck, benefitsVerification, aiCallVerification, sendToPMS } = p.verificationStatus;

          if (sendToPMS === 'completed' || sendToPMS === 'in_progress') return 4;
          if (aiCallVerification === 'completed' || aiCallVerification === 'in_progress') return 3;
          if (benefitsVerification === 'completed' || benefitsVerification === 'in_progress') return 2;
          if (eligibilityCheck === 'completed' || eligibilityCheck === 'in_progress') return 1;
          return 0;
        };

        const verificationStep = getPatientVerificationStep(patient);
        const matchesAnyStepFilter = stepFilters.some(filter => {
          if (filter === 'Eligibility') return verificationStep === 1;
          if (filter === 'Verification') return verificationStep === 2;
          if (filter === 'Authorization') return verificationStep === 3;
          return false;
        });

        if (!matchesAnyStepFilter) return false;
      }

      return true;
    });
  }, [searchQuery, activeFilters]);

  const selectedPatient = selectedPatientId ? patients.find(p => p.id === selectedPatientId) : null;

  const calculateVerificationStats = () => {
    let verified = 0;
    let inProgress = 0;
    let pending = 0;
    let notStarted = 0;

    patients.forEach(patient => {
      if (!patient.verificationStatus) {
        notStarted++;
        return;
      }

      const { eligibilityCheck, benefitsVerification, aiCallVerification, sendToPMS } = patient.verificationStatus;

      // Fully verified
      if (sendToPMS === 'completed') {
        verified++;
      }
      // In progress (any step in progress)
      else if (
        eligibilityCheck === 'in_progress' ||
        benefitsVerification === 'in_progress' ||
        aiCallVerification === 'in_progress' ||
        sendToPMS === 'in_progress'
      ) {
        inProgress++;
      }
      // Pending (at least one step completed but not all)
      else if (
        eligibilityCheck === 'completed' ||
        benefitsVerification === 'completed' ||
        aiCallVerification === 'completed'
      ) {
        pending++;
      }
      // Not started
      else {
        notStarted++;
      }
    });

    return { verified, inProgress, pending, notStarted };
  };

  const verificationStats = calculateVerificationStats();

  const handleRemoveFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
  };

  const handleAddFilter = (filter: FilterType) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const handleCloseDetail = () => {
    setSelectedPatientId(null);
    setViewMode('dashboard');
  };

  const handleDashboardItemClick = () => {
    setViewMode('list');
    // Do not select any patient - let user choose
    setSelectedPatientId(null);
  };

  const handleBackToDashboard = () => {
    setViewMode('dashboard');
    setSelectedPatientId(null);
  };

  return (
    <div className="flex h-screen w-full flex-col">
      {/* Smith AI Center Header */}
      <Header />

      {/* Sub-header for list view */}
      {viewMode === 'list' && (
        <div className="flex items-center border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 px-4 py-3 shrink-0">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center justify-center p-2 mr-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Back to Dashboard"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 mr-4">
            person
          </span>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex-1">
            Patient Insurance & Coverage
          </h1>
          <button className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90">
            <span className="material-symbols-outlined text-base">add</span>
            Add New Patient
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden">
        {viewMode === 'dashboard' ? (
          <Dashboard patients={patients} onItemClick={handleDashboardItemClick} />
        ) : (
          <div className="flex w-full">
            <PatientList
              patients={filteredPatients}
              selectedPatientId={selectedPatientId}
              searchQuery={searchQuery}
              activeFilters={activeFilters}
              onSelectPatient={setSelectedPatientId}
              onSearchChange={setSearchQuery}
              onRemoveFilter={handleRemoveFilter}
              onAddFilter={handleAddFilter}
            />

            {selectedPatient ? (
              <PatientDetail
                patient={selectedPatient}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onClose={handleCloseDetail}
              />
            ) : (
              <PatientGuide
                totalPatients={patients.length}
                verificationStats={verificationStats}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientsManagement;
