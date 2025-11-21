import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientList from './PatientList';
import PatientDetail from './PatientDetail';
import Dashboard from './Dashboard';
import PatientGuide from './PatientGuide';
import Header from './Header';
import { Patient, FilterType, TabType, TAB_TYPES } from '../types/patient';
import patientsData from '../data/patients.json';

const patients = patientsData as Patient[];

const PatientsManagement: React.FC = () => {
  const navigate = useNavigate();
  const isAdmin = false; // Always user mode
  const [viewMode, setViewMode] = useState<'dashboard' | 'list'>('list'); // Default to list for non-admin
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilters, setActiveFilters] = useState<FilterType[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>(TAB_TYPES.PATIENT_BASIC_INFO);

  const handleLogout = () => {
    setSelectedPatientId(null);
    setSearchQuery('');
    setActiveFilters([]);
    navigate('/');
  };

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

  const handleDashboardItemClick = () => {
    setViewMode('list');
    // Do not select any patient - let user choose
    setSelectedPatientId(null);
  };

  const handleHeaderClick = () => {
    // Admin mode: go to dashboard, User mode: go to list
    setViewMode(isAdmin ? 'dashboard' : 'list');
    setSelectedPatientId(null);
  };

  const handleAddNewPatient = () => {
    // Create a new patient ID
    const newPatientId = `new-${Date.now()}`;

    // Create a temporary new patient object
    const newPatient: Patient = {
      id: newPatientId,
      active: true,
      name: {
        given: ['New'],
        family: 'Patient'
      },
      gender: '',
      birthDate: '',
      telecom: [
        { system: 'phone', value: '' },
        { system: 'email', value: '' }
      ],
      address: [{
        line: [''],
        city: '',
        state: '',
        postalCode: ''
      }],
      insurance: [],
      appointments: [],
      treatments: [],
      coverage: {
        annual_maximum: 0,
        annual_used: 0,
        deductible: 0,
        deductible_met: 0,
        procedures: []
      }
    };

    // Add the new patient to the patients array temporarily
    patients.push(newPatient);

    // Select the new patient and switch to Patient Basic tab
    setSelectedPatientId(newPatientId);
    setActiveTab(TAB_TYPES.PATIENT_BASIC_INFO);
  };

  const handleCancelNewPatient = () => {
    // Remove new patient from patients array if it exists
    const index = patients.findIndex(p => p.id.startsWith('new-'));
    if (index !== -1) {
      patients.splice(index, 1);
    }
    // Clear selected patient to return to PatientGuide
    setSelectedPatientId(null);
  };

  return (
    <div className="flex h-screen w-full flex-col">
      {/* Smith AI Center Header */}
      <Header
        onLogoClick={handleHeaderClick}
        onLogout={handleLogout}
      />

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
              isAdmin={isAdmin}
            />

            {selectedPatient ? (
              <PatientDetail
                patient={selectedPatient}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                isAdmin={isAdmin}
                onCancel={selectedPatient.id.startsWith('new-') ? handleCancelNewPatient : undefined}
              />
            ) : (
              <PatientGuide
                totalPatients={patients.length}
                verificationStats={verificationStats}
                onAddNewPatient={handleAddNewPatient}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientsManagement;
