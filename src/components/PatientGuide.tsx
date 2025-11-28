import React, { useState } from 'react';
import { Patient } from '../types/patient';
import { VERIFICATION_STATUS_LABELS } from '../constants/verificationStatus';
import { mockData } from './SmartAITransactionHistory';

type VerificationFilterType = 'all' | 'verified' | 'in_progress' | 'pending' | 'not_started';

interface PatientGuideProps {
  totalPatients?: number;
  verificationStats?: {
    verified: number;
    inProgress: number;
    pending: number;
    notStarted: number;
  };
  onAddNewPatient?: () => void;
  patients?: Patient[];
  onSelectPatient?: (patientId: string) => void;
}

const PatientGuide: React.FC<PatientGuideProps> = ({
  totalPatients: _totalPatients = 0,
  verificationStats: _verificationStats = { verified: 0, inProgress: 0, pending: 0, notStarted: 0 },
  onAddNewPatient: _onAddNewPatient,
  patients = [],
  onSelectPatient
}) => {
  // Calculate automation statistics from transaction data
  const getAutomationStats = () => {
    const now = new Date('2025-11-28'); // Use current date from context
    const today = now.toISOString().split('T')[0];

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Get start of week (Sunday)
    const startOfWeek = new Date(now);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);
    const startOfWeekStr = startOfWeek.toISOString().split('T')[0];

    const todayRuns = mockData.filter(t => t.startTime.startsWith(today)).length;
    const yesterdayRuns = mockData.filter(t => t.startTime.startsWith(yesterdayStr)).length;
    const thisWeekRuns = mockData.filter(t => {
      const transactionDate = t.startTime.split(' ')[0];
      return transactionDate >= startOfWeekStr && transactionDate <= today;
    }).length;

    return { todayRuns, yesterdayRuns, thisWeekRuns };
  };

  const automationStats = getAutomationStats();

  // Get upcoming appointments from all patients
  const getUpcomingAppointments = () => {
    const now = new Date();
    const allAppointments: Array<{ patient: Patient, appointment: any }> = [];

    patients.forEach(patient => {
      if (patient.appointments) {
        patient.appointments.forEach(apt => {
          const aptDate = new Date(apt.date);
          if (aptDate >= now && apt.status === 'scheduled') {
            allAppointments.push({ patient, appointment: apt });
          }
        });
      }
    });

    // Sort by date (earliest first)
    allAppointments.sort((a, b) => {
      const dateA = new Date(a.appointment.date);
      const dateB = new Date(b.appointment.date);
      return dateA.getTime() - dateB.getTime();
    });

    return allAppointments.slice(0, 8); // Show up to 8 upcoming appointments
  };

  // Get past appointments from all patients
  const getPastAppointments = () => {
    const now = new Date();
    const allAppointments: Array<{ patient: Patient, appointment: any }> = [];

    patients.forEach(patient => {
      if (patient.appointments) {
        patient.appointments.forEach(apt => {
          const aptDate = new Date(apt.date);
          if (aptDate < now) {
            allAppointments.push({ patient, appointment: apt });
          }
        });
      }
    });

    // Sort by date (most recent first)
    allAppointments.sort((a, b) => {
      const dateA = new Date(a.appointment.date);
      const dateB = new Date(b.appointment.date);
      return dateB.getTime() - dateA.getTime();
    });

    return allAppointments.slice(0, 8); // Show up to 8 past appointments
  };

  const getPatientName = (patient: Patient) => {
    const given = patient.name.given.join(' ');
    return `${given} ${patient.name.family}`.trim();
  };

  const formatAppointmentDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    if (isToday) return 'Today';
    if (isTomorrow) return 'Tomorrow';

    // Format as "Mon, Jan 15"
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getVerificationStatus = (patient: Patient) => {
    if (!patient.verificationStatus) {
      return { label: VERIFICATION_STATUS_LABELS.NOT_STARTED, color: 'text-slate-600 dark:text-slate-400', percentage: 0 };
    }

    const { eligibilityCheck, benefitsVerification, aiCallVerification, sendToPMS } = patient.verificationStatus;

    // Fully verified
    if (sendToPMS === 'completed') {
      return { label: VERIFICATION_STATUS_LABELS.VERIFIED, color: 'text-green-600 dark:text-green-400', percentage: 100 };
    }
    if (sendToPMS === 'in_progress') {
      return { label: VERIFICATION_STATUS_LABELS.SENDING_TO_PMS, color: 'text-blue-600 dark:text-blue-400', percentage: 87 };
    }
    if (aiCallVerification === 'completed') {
      return { label: VERIFICATION_STATUS_LABELS.PMS_PENDING, color: 'text-orange-600 dark:text-orange-400', percentage: 75 };
    }
    if (aiCallVerification === 'in_progress') {
      return { label: VERIFICATION_STATUS_LABELS.AI_CALL_VERIFICATION, color: 'text-blue-600 dark:text-blue-400', percentage: 62 };
    }
    if (benefitsVerification === 'completed') {
      return { label: VERIFICATION_STATUS_LABELS.AI_CALL_PENDING, color: 'text-orange-600 dark:text-orange-400', percentage: 50 };
    }
    if (benefitsVerification === 'in_progress') {
      return { label: VERIFICATION_STATUS_LABELS.BENEFITS_CHECK, color: 'text-blue-600 dark:text-blue-400', percentage: 37 };
    }
    if (eligibilityCheck === 'completed') {
      return { label: VERIFICATION_STATUS_LABELS.BENEFITS_PENDING, color: 'text-orange-600 dark:text-orange-400', percentage: 25 };
    }
    if (eligibilityCheck === 'in_progress') {
      return { label: VERIFICATION_STATUS_LABELS.ELIGIBILITY_CHECK, color: 'text-blue-600 dark:text-blue-400', percentage: 12 };
    }

    // Not started
    return { label: VERIFICATION_STATUS_LABELS.NOT_STARTED, color: 'text-slate-600 dark:text-slate-400', percentage: 0 };
  };

  const [activeFilter, setActiveFilter] = useState<VerificationFilterType>('all');
  const [isPulling, setIsPulling] = useState(false);
  const [pullProgress, setPullProgress] = useState(0);
  const [pullMessage, setPullMessage] = useState('');

  const upcomingAppointments = getUpcomingAppointments();
  const pastAppointments = getPastAppointments();

  const handlePullPatientData = () => {
    setIsPulling(true);
    setPullProgress(0);
    setPullMessage('Establishing secure connection to Practice Management System...');

    // Stage 1: Connecting (0-25%)
    setTimeout(() => {
      setPullProgress(25);
      setPullMessage('Connection established. Authenticating credentials...');
    }, 800);

    // Stage 2: Authenticating (25-50%)
    setTimeout(() => {
      setPullProgress(50);
      setPullMessage('Authentication successful. Retrieving patient records...');
    }, 1600);

    // Stage 3: Fetching (50-75%)
    setTimeout(() => {
      setPullProgress(75);
      setPullMessage('Processing patient demographics and insurance information...');
    }, 2400);

    // Stage 4: Syncing (75-90%)
    setTimeout(() => {
      setPullProgress(90);
      setPullMessage('Synchronizing appointment schedules and verification status...');
    }, 3200);

    // Stage 5: Finalizing (90-100%)
    setTimeout(() => {
      setPullProgress(100);
      setPullMessage('Data synchronization completed successfully.');
    }, 4000);

    // Close modal
    setTimeout(() => {
      setIsPulling(false);
      setPullProgress(0);
      setPullMessage('');
    }, 5000);
  };

  // Helper to categorize verification status into main categories
  const categorizeStatus = (label: string) => {
    if (label === VERIFICATION_STATUS_LABELS.VERIFIED) return 'verified';
    if (label === VERIFICATION_STATUS_LABELS.NOT_STARTED) return 'not_started';

    // In progress statuses (actively working on)
    if ([
      VERIFICATION_STATUS_LABELS.SENDING_TO_PMS,
      VERIFICATION_STATUS_LABELS.AI_CALL_VERIFICATION,
      VERIFICATION_STATUS_LABELS.BENEFITS_CHECK,
      VERIFICATION_STATUS_LABELS.ELIGIBILITY_CHECK
    ].includes(label)) {
      return 'in_progress';
    }

    // Pending statuses (waiting for next action)
    if ([
      VERIFICATION_STATUS_LABELS.PMS_PENDING,
      VERIFICATION_STATUS_LABELS.AI_CALL_PENDING,
      VERIFICATION_STATUS_LABELS.BENEFITS_PENDING
    ].includes(label)) {
      return 'pending';
    }

    return 'not_started';
  };

  // Calculate stats from upcoming appointments
  const appointmentStats = {
    total: upcomingAppointments.length,
    verified: upcomingAppointments.filter(item => categorizeStatus(getVerificationStatus(item.patient).label) === 'verified').length,
    inProgress: upcomingAppointments.filter(item => categorizeStatus(getVerificationStatus(item.patient).label) === 'in_progress').length,
    pending: upcomingAppointments.filter(item => categorizeStatus(getVerificationStatus(item.patient).label) === 'pending').length,
    notStarted: upcomingAppointments.filter(item => categorizeStatus(getVerificationStatus(item.patient).label) === 'not_started').length,
  };

  // Filter appointments based on verification status
  const filteredAppointments = upcomingAppointments.filter(item => {
    if (activeFilter === 'all') return true;

    const status = getVerificationStatus(item.patient);
    const category = categorizeStatus(status.label);

    if (activeFilter === 'verified') return category === 'verified';
    if (activeFilter === 'in_progress') return category === 'in_progress';
    if (activeFilter === 'pending') return category === 'pending';
    if (activeFilter === 'not_started') return category === 'not_started';

    return true;
  });

  // --- Components ---

  const StatCard = ({ title, value, subValue, icon, colorClass, onClick, isActive }: any) => (
    <button
      onClick={onClick}
      className={`flex-1 bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all text-left w-full flex flex-col justify-between h-full group ${isActive ? 'ring-2 ring-blue-500' : ''
        }`}
    >
      <div className="flex justify-between items-start w-full">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{value}</h3>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className="text-xs font-medium text-slate-400">{subValue}</span>
      </div>
    </button>
  );

  const GaugeChart = () => {
    const total = appointmentStats.total || 1;
    const verified = appointmentStats.verified;
    const inProgress = appointmentStats.inProgress;
    const pending = appointmentStats.pending;

    const size = 180;
    const strokeWidth = 20;
    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = Math.PI * radius; // Half circle

    // Calculate percentages
    const verifiedPercent = verified / total;
    const inProgressPercent = inProgress / total;
    const pendingPercent = pending / total;

    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <div className="relative" style={{ width: size, height: size / 2 + 20 }}>
          <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
            {/* Background Arc */}
            <path
              d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-slate-100 dark:text-slate-800"
              strokeLinecap="round"
            />

            {/* Verified Segment (Green) */}
            {verified > 0 && (
              <path
                d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
                fill="none"
                stroke="#22c55e"
                strokeWidth={strokeWidth}
                strokeDasharray={`${verifiedPercent * circumference} ${circumference}`}
                strokeDashoffset="0"
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            )}

            {/* In Progress Segment (Blue) */}
            {inProgress > 0 && (
              <path
                d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
                fill="none"
                stroke="#3b82f6"
                strokeWidth={strokeWidth}
                strokeDasharray={`${inProgressPercent * circumference} ${circumference}`}
                strokeDashoffset={`-${verifiedPercent * circumference}`}
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            )}

            {/* Pending Segment (Orange) */}
            {pending > 0 && (
              <path
                d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
                fill="none"
                stroke="#f97316"
                strokeWidth={strokeWidth}
                strokeDasharray={`${pendingPercent * circumference} ${circumference}`}
                strokeDashoffset={`-${(verifiedPercent + inProgressPercent) * circumference}`}
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            )}

            {/* Center Text */}
            <text
              x={center}
              y={size / 2 - 10}
              textAnchor="middle"
              className="text-3xl font-bold fill-slate-900 dark:fill-white"
            >
              {total}
            </text>
            <text
              x={center}
              y={size / 2 + 10}
              textAnchor="middle"
              className="text-xs font-medium fill-slate-500 dark:fill-slate-400 uppercase"
            >
              Total
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-[10px] text-slate-600 dark:text-slate-400">{verified}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="text-[10px] text-slate-600 dark:text-slate-400">{inProgress}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span className="text-[10px] text-slate-600 dark:text-slate-400">{pending}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="flex flex-1 flex-col bg-slate-50 dark:bg-slate-950 w-full overflow-y-auto font-sans">
      <div className="p-6 max-w-[1600px] mx-auto w-full space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Insurance Verification Dashboard
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select a patient from the list to initiate the insurance verification process.
            </p>
          </div>
          <button
            onClick={handlePullPatientData}
            className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 flex items-center gap-2 text-sm font-medium shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-lg">sync</span>
            Pull Up The Latest Upcoming Appointments
          </button>
        </div>

        {/* Combined: Smith AI Stats + Verification Status */}
        <div className="bg-gradient-to-r from-orange-50 to-blue-50 dark:from-orange-900/10 dark:to-blue-900/10 rounded-xl p-6 border border-orange-100 dark:border-orange-800/30">

          {/* Main Grid: 4x2 Layout - All 8 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Row 1, Col 1: Verification Status Chart */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-[180px]">
              <h3 className="text-xs font-semibold text-slate-900 dark:text-white mb-1">Verification Status</h3>
              <div className="flex-1 flex items-center justify-center overflow-hidden">
                <GaugeChart />
              </div>
            </div>

            {/* Row 1, Col 2: Total */}
            <StatCard
              title="Total"
              value={appointmentStats.total}
              subValue="Total Patients"
              icon="group"
              colorClass="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
              onClick={() => setActiveFilter('all')}
              isActive={activeFilter === 'all'}
            />

            {/* Row 1, Col 3: In Progress */}
            <StatCard
              title="In Progress"
              value={appointmentStats.inProgress}
              subValue={`${Math.round((appointmentStats.inProgress / appointmentStats.total) * 100) || 0}% of total`}
              icon="sync"
              colorClass="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
              onClick={() => setActiveFilter('in_progress')}
              isActive={activeFilter === 'in_progress'}
            />

            {/* Row 1, Col 4: Runs Today */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow h-[180px] flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg text-blue-600 dark:text-blue-400">today</span>
                </div>
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">Live</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {automationStats.todayRuns}
              </div>
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Runs Today
              </div>
              <div className="mt-auto pt-2 border-t border-slate-100 dark:border-slate-700">
                <div className="text-xs text-slate-500 dark:text-slate-500">
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Row 2, Col 1: Verified */}
            <StatCard
              title="Verified"
              value={appointmentStats.verified}
              subValue={`${Math.round((appointmentStats.verified / appointmentStats.total) * 100) || 0}% of total`}
              icon="check_circle"
              colorClass="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
              onClick={() => setActiveFilter('verified')}
              isActive={activeFilter === 'verified'}
            />

            {/* Row 2, Col 2: Pending */}
            <StatCard
              title="Pending"
              value={appointmentStats.pending}
              subValue={`${Math.round((appointmentStats.pending / appointmentStats.total) * 100) || 0}% of total`}
              icon="schedule"
              colorClass="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
              onClick={() => setActiveFilter('pending')}
              isActive={activeFilter === 'pending'}
            />

            {/* Row 2, Col 3: Runs Yesterday */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow h-[180px] flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg text-slate-600 dark:text-slate-400">history</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {automationStats.yesterdayRuns}
              </div>
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Runs Yesterday
              </div>
              <div className="mt-auto pt-2 border-t border-slate-100 dark:border-slate-700">
                <div className="text-xs text-slate-500 dark:text-slate-500">
                  {(() => {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    return yesterday.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                  })()}
                </div>
              </div>
            </div>

            {/* Row 2, Col 4: Runs This Week */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow h-[180px] flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg text-green-600 dark:text-green-400">calendar_month</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {automationStats.thisWeekRuns}
              </div>
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Runs This Week
              </div>
              <div className="mt-auto pt-2 border-t border-slate-100 dark:border-slate-700">
                <div className="text-xs text-slate-500 dark:text-slate-500">
                  Week of {(() => {
                    const now = new Date();
                    const startOfWeek = new Date(now);
                    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
                    return startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Appointments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Upcoming Appointments */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-[500px]">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl text-blue-600 dark:text-blue-400">event</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Upcoming Patient Appointment</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{filteredAppointments.length} scheduled</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-800/50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Patient</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((item, index) => {
                      const status = getVerificationStatus(item.patient);
                      return (
                        <tr key={index} onClick={() => onSelectPatient?.(item.patient.id)} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-slate-900 dark:text-white">{formatAppointmentDate(item.appointment.date)}</div>
                            <div className="text-xs text-slate-500">{item.appointment.time}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-slate-900 dark:text-white">{getPatientName(item.patient)}</div>
                            <div className="text-xs text-slate-500">Dr. {item.appointment.provider}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              {item.appointment.type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full w-20 overflow-hidden">
                                <div className={`h-full rounded-full ${status.percentage === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${status.percentage}%` }}></div>
                              </div>
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{status.percentage}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500">No upcoming appointments found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Past Appointments */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-[500px]">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl text-slate-600 dark:text-slate-400">history</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Past Appointments Appointment</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{pastAppointments.length} completed</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-800/50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Patient</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {pastAppointments.length > 0 ? (
                    pastAppointments.map((item, index) => {
                      const status = getVerificationStatus(item.patient);
                      return (
                        <tr key={index} onClick={() => onSelectPatient?.(item.patient.id)} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-slate-900 dark:text-white">{new Date(item.appointment.date).toLocaleDateString()}</div>
                            <div className="text-xs text-slate-500">{item.appointment.time}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-slate-900 dark:text-white">{getPatientName(item.patient)}</div>
                            <div className="text-xs text-slate-500">Dr. {item.appointment.provider}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              {item.appointment.type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full w-20 overflow-hidden">
                                <div className={`h-full rounded-full ${status.percentage === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${status.percentage}%` }}></div>
                              </div>
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{status.percentage}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500">No past appointments found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* Sync Modal Overlay */}
      {isPulling && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6 relative">
                <span className="material-symbols-outlined text-3xl text-blue-600 dark:text-blue-400 animate-pulse">cloud_sync</span>
                <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="20 10" className="text-blue-200 dark:text-blue-800" />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Syncing Data</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 h-10">{pullMessage}</p>

              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-4 overflow-hidden">
                <div
                  className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${pullProgress}%` }}
                ></div>
              </div>

              <div className="flex justify-between w-full text-xs text-slate-400 font-medium">
                <span>Connecting</span>
                <span>{pullProgress}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PatientGuide;
