import React from 'react';
import { Patient } from '../types/patient';

interface DashboardProps {
  patients: Patient[];
  onItemClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ patients, onItemClick }) => {
  const getPatientName = (patient: Patient) => {
    const given = patient.name.given.join(' ');
    return `${given} ${patient.name.family}`.trim();
  };

  // Insurance and Coverage Metrics
  const patientsWithInsurance = patients.filter(p => (p as any).insurance && (p as any).insurance.length > 0).length;
  // const patientsWithoutInsurance = patients.length - patientsWithInsurance;

  const getTotalInsurancePolicies = () => {
    let count = 0;
    patients.forEach(p => {
      if ((p as any).insurance) {
        count += (p as any).insurance.length;
      }
    });
    return count;
  };

  const getExpiringPolicies = () => {
    const policies: Array<{patient: Patient, insurance: any}> = [];
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));

    patients.forEach(patient => {
      if ((patient as any).insurance) {
        (patient as any).insurance.forEach((ins: any) => {
          const expDate = new Date(ins.expirationDate);
          if (expDate >= today && expDate <= thirtyDaysFromNow) {
            policies.push({ patient, insurance: ins });
          }
        });
      }
    });

    return policies;
  };

  const getCoverageUtilization = () => {
    const utilization: Array<{patient: Patient, coverage: any, utilizationPercent: number}> = [];

    patients.forEach(patient => {
      if ((patient as any).coverage) {
        const cov = (patient as any).coverage;
        const percent = (cov.annual_used / cov.annual_maximum) * 100;
        utilization.push({
          patient,
          coverage: cov,
          utilizationPercent: Math.round(percent)
        });
      }
    });

    // Sort by utilization percentage (highest first)
    utilization.sort((a, b) => b.utilizationPercent - a.utilizationPercent);
    return utilization.slice(0, 5);
  };

  // Commented out unused function
  // const getDeductibleStatus = () => {
  //   const statuses: Array<{patient: Patient, coverage: any, deductiblePercent: number}> = [];

  //   patients.forEach(patient => {
  //     if ((patient as any).coverage) {
  //       const cov = (patient as any).coverage;
  //       const percent = (cov.deductible_met / cov.deductible) * 100;
  //       statuses.push({
  //         patient,
  //         coverage: cov,
  //         deductiblePercent: Math.round(percent)
  //       });
  //     }
  //   });

  //   return statuses.slice(0, 5);
  // };

  const getPendingVerifications = () => {
    // Simulated - policies expiring or needing verification
    const pending: Array<{patient: Patient, insurance: any, reason: string}> = [];

    patients.forEach(patient => {
      if ((patient as any).insurance) {
        (patient as any).insurance.forEach((ins: any) => {
          const expDate = new Date(ins.expirationDate);
          const today = new Date();

          if (expDate < today) {
            pending.push({ patient, insurance: ins, reason: 'Policy Expired' });
          } else if (expDate <= new Date(today.getTime() + (60 * 24 * 60 * 60 * 1000))) {
            pending.push({ patient, insurance: ins, reason: 'Expiring Soon' });
          }
        });
      }
    });

    return pending.slice(0, 5);
  };

  const totalPolicies = getTotalInsurancePolicies();
  const expiringPolicies = getExpiringPolicies();
  const coverageUtilization = getCoverageUtilization();
  // const deductibleStatus = getDeductibleStatus();
  const pendingVerifications = getPendingVerifications();

  return (
    <section className="flex w-full flex-1 flex-col bg-background-light dark:bg-background-dark overflow-y-auto">
      {/* Dashboard Content */}
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Active Insurance Policies */}
          <button
            onClick={onItemClick}
            className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 hover:border-slate-300 dark:hover:border-slate-600 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Active Policies
                </p>
                <p className="text-2xl font-semibold text-slate-900 dark:text-white mt-2">
                  {totalPolicies}
                </p>
              </div>
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-xl text-slate-600 dark:text-slate-400">
                  policy
                </span>
              </div>
            </div>
          </button>

          {/* Patients with Insurance */}
          <button
            onClick={onItemClick}
            className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 hover:border-slate-300 dark:hover:border-slate-600 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Insured Patients
                </p>
                <p className="text-2xl font-semibold text-status-green mt-2">
                  {patientsWithInsurance}
                </p>
              </div>
              <div className="w-10 h-10 bg-status-green/10 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-xl text-status-green">
                  verified
                </span>
              </div>
            </div>
          </button>

          {/* Expiring Policies */}
          <button
            onClick={onItemClick}
            className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 hover:border-slate-300 dark:hover:border-slate-600 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Expiring Soon
                </p>
                <p className="text-2xl font-semibold text-status-orange mt-2">
                  {expiringPolicies.length}
                </p>
              </div>
              <div className="w-10 h-10 bg-status-orange/10 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-xl text-status-orange">
                  schedule
                </span>
              </div>
            </div>
          </button>

          {/* Pending Verifications */}
          <button
            onClick={onItemClick}
            className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 hover:border-slate-300 dark:hover:border-slate-600 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Need Verification
                </p>
                <p className="text-2xl font-semibold text-status-red mt-2">
                  {pendingVerifications.length}
                </p>
              </div>
              <div className="w-10 h-10 bg-status-red/10 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-xl text-status-red">
                  error
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Two Column Grid for Verification and Utilization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Verifications */}
          <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-900 dark:text-white">
                Policies Requiring Verification
              </h3>
              <span className="material-symbols-outlined text-lg text-slate-600 dark:text-slate-400">
                priority_high
              </span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {pendingVerifications.length > 0 ? (
                pendingVerifications.map((item, index) => (
                  <button
                    key={index}
                    onClick={onItemClick}
                    className="w-full px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 dark:text-white">
                          {getPatientName(item.patient)}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {item.insurance.provider} - {item.insurance.policyNumber}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          item.reason === 'Policy Expired'
                            ? 'bg-status-red/10 text-status-red'
                            : 'bg-status-orange/10 text-status-orange'
                        }`}>
                          {item.reason}
                        </span>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Exp: {item.insurance.expirationDate}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-12 text-center">
                  <span className="material-symbols-outlined text-4xl text-status-green mb-2">
                    check_circle
                  </span>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    All policies verified and up to date
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Coverage Utilization */}
          <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-900 dark:text-white">
                Annual Benefit Utilization
              </h3>
              <span className="material-symbols-outlined text-lg text-slate-600 dark:text-slate-400">
                analytics
              </span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {coverageUtilization.length > 0 ? (
                coverageUtilization.map((item, index) => (
                  <button
                    key={index}
                    onClick={onItemClick}
                    className="w-full px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 dark:text-white">
                          {getPatientName(item.patient)}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          ${item.coverage.annual_used.toLocaleString()} / ${item.coverage.annual_maximum.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right min-w-[80px]">
                        <p className={`text-xl font-semibold ${
                          item.utilizationPercent >= 80
                            ? 'text-status-red'
                            : item.utilizationPercent >= 50
                              ? 'text-status-orange'
                              : 'text-status-green'
                        }`}>
                          {item.utilizationPercent}%
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          utilized
                        </p>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 h-1.5">
                      <div
                        className={`h-1.5 ${
                          item.utilizationPercent >= 80
                            ? 'bg-status-red'
                            : item.utilizationPercent >= 50
                              ? 'bg-status-orange'
                              : 'bg-status-green'
                        }`}
                        style={{ width: `${Math.min(item.utilizationPercent, 100)}%` }}
                      ></div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-12 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No coverage data available
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
