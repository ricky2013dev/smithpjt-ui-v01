import React, { useState } from "react";
import {
  Patient,
  Appointment,
  Insurance,
  Treatment,
  Procedure,
  TabType,
  TAB_TYPES,
  TAB_LABELS,
  InsuranceSubTabType,
  INSURANCE_SUB_TAB_TYPES,
  INSURANCE_SUB_TAB_LABELS,
} from "../types/patient";
import SmithAICenter from "./SmithAICenter";
import VerificationForm from "./VerificationForm";
import CoverageModal from "./CoverageModal";
import sampleCoverageData from "../data/sampleCoverageData.json";
import { PRIMARY_BUTTON } from "../styles/buttonStyles";

interface PatientDetailProps {
  patient: Patient;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  isAdmin?: boolean;
}

// Tab content wrapper component for consistent spacing
const TabContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "space-y-6"
}) => {
  return <div className={`animate-fadeIn ${className}`}>{children}</div>;
};

const PatientDetail: React.FC<PatientDetailProps> = ({
  patient,
  activeTab,
  onTabChange,
  isAdmin = false,
}) => {
  const [showAICenter, setShowAICenter] = useState(false);
  const [insuranceSubTab, setInsuranceSubTab] = useState<InsuranceSubTabType>(INSURANCE_SUB_TAB_TYPES.INSURANCE_INFO);

  // Run Validity API states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingSampleData, setIsLoadingSampleData] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [coverageData, setCoverageData] = useState<any>(null);
  const [curlCommand, setCurlCommand] = useState<string | null>(null);

  const getFullName = () => {
    const given = patient.name.given.join(" ");
    return `${given} ${patient.name.family}`.trim();
  };

  const getVerificationStep = () => {
    const status = patient.verificationStatus;
    if (!status) return 1;

    if (status.sendToPMS === 'completed') return 4;
    if (status.sendToPMS === 'in_progress') return 4;
    if (status.aiCallVerification === 'completed') return 4;
    if (status.aiCallVerification === 'in_progress') return 3;
    if (status.benefitsVerification === 'completed') return 3;
    if (status.benefitsVerification === 'in_progress') return 2;
    if (status.eligibilityCheck === 'completed') return 2;
    if (status.eligibilityCheck === 'in_progress') return 1;
    return 1;
  };

  const getStepConfig = (stepKey: 'eligibilityCheck' | 'benefitsVerification' | 'aiCallVerification' | 'sendToPMS') => {
    const status = patient.verificationStatus?.[stepKey] || 'pending';
    const configs = {
      eligibilityCheck: {
        icon: status === 'completed' ? 'check' : status === 'in_progress' ? 'sync' : 'schedule',
        bgColor: status === 'completed' ? 'bg-status-green' : status === 'in_progress' ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700',
        textColor: status === 'completed' ? 'text-white' : status === 'in_progress' ? 'text-white' : 'text-slate-500 dark:text-slate-400',
        label: 'Eligibility Check',
        statusText: status === 'completed' ? 'Completed' : status === 'in_progress' ? 'In Progress' : 'Pending',
        statusColor: status === 'completed' ? 'text-status-green' : status === 'in_progress' ? 'text-primary' : 'text-slate-500 dark:text-slate-400',
      },
      benefitsVerification: {
        icon: status === 'completed' ? 'check' : status === 'in_progress' ? 'sync' : 'schedule',
        bgColor: status === 'completed' ? 'bg-status-green' : status === 'in_progress' ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700',
        textColor: status === 'completed' ? 'text-white' : status === 'in_progress' ? 'text-white' : 'text-slate-500 dark:text-slate-400',
        label: 'API Verification',
        statusText: status === 'completed' ? 'Completed' : status === 'in_progress' ? 'In Progress' : 'Pending',
        statusColor: status === 'completed' ? 'text-status-green' : status === 'in_progress' ? 'text-primary' : 'text-slate-500 dark:text-slate-400',
      },
      aiCallVerification: {
        icon: status === 'completed' ? 'check' : status === 'in_progress' ? 'sync' : 'schedule',
        bgColor: status === 'completed' ? 'bg-status-green' : status === 'in_progress' ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700',
        textColor: status === 'completed' ? 'text-white' : status === 'in_progress' ? 'text-white' : 'text-slate-500 dark:text-slate-400',
        label: 'AI Call Verification',
        statusText: status === 'completed' ? 'Completed' : status === 'in_progress' ? 'In Progress' : 'Pending',
        statusColor: status === 'completed' ? 'text-status-green' : status === 'in_progress' ? 'text-primary' : 'text-slate-500 dark:text-slate-400',
      },
      sendToPMS: {
        icon: status === 'completed' ? 'check' : status === 'in_progress' ? 'sync' : 'schedule',
        bgColor: status === 'completed' ? 'bg-status-green' : status === 'in_progress' ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700',
        textColor: status === 'completed' ? 'text-white' : status === 'in_progress' ? 'text-white' : 'text-slate-500 dark:text-slate-400',
        label: 'Send To PMS',
        statusText: status === 'completed' ? 'Completed' : status === 'in_progress' ? 'In Progress' : 'Pending',
        statusColor: status === 'completed' ? 'text-status-green' : status === 'in_progress' ? 'text-primary' : 'text-slate-500 dark:text-slate-400',
      }
    };
    return configs[stepKey];
  };

  const getConnectorColor = (fromStep: 'eligibilityCheck' | 'benefitsVerification' | 'aiCallVerification') => {
    const status = patient.verificationStatus?.[fromStep];
    return status === 'completed' ? 'bg-status-green' : 'bg-slate-300 dark:bg-slate-600';
  };

  const getPhone = () => {
    return patient.telecom.find((t) => t.system === "phone")?.value || "N/A";
  };

  const getEmail = () => {
    return patient.telecom.find((t) => t.system === "email")?.value || "N/A";
  };

  const getAddress = () => {
    if (!patient.address || patient.address.length === 0) return "N/A";
    const addr = patient.address[0];
    return `${addr.line.join(", ")}, ${addr.city}, ${addr.state} ${addr.postalCode}`;
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Run Validity API handlers
  const handleLoadSampleData = async () => {
    // Show loading state and open modal
    setIsLoadingSampleData(true);
    setVerificationError(null);
    setCurlCommand(null);
    setIsModalOpen(true);

    // Simulate API call with 2 second delay to show progress animation
    await new Promise(resolve => setTimeout(resolve, 500));

    // Load sample data and display in modal
    setCoverageData(sampleCoverageData);
    setIsLoadingSampleData(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset states after modal closes
    setTimeout(() => {
      setVerificationError(null);
      setCoverageData(null);
      setCurlCommand(null);
    }, 300);
  };

  const fullName = getFullName();

  return (
    <section key={patient.id} className="hidden w-0 flex-1 flex-col bg-background-light dark:bg-background-dark lg:flex lg:w-[75%] animate-fadeIn">
      {/* Profile Header */}
      <div className="p-8 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <div className="rounded-full h-16 w-16 overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&size=150&background=e2e8f0&color=475569&bold=false&format=svg`}
              alt={fullName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              {fullName}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              ID: {patient.id}
            </p>
          </div>

          <div className="flex-1 flex justify-center gap-3">
            <button
              onClick={handleLoadSampleData}
              disabled={isLoadingSampleData}
              className={PRIMARY_BUTTON}
            >
              {isLoadingSampleData ? (
                <>
                  <span className="animate-spin material-symbols-outlined">refresh</span>
                  Loading...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">description</span>
                  Run Vaility API
                </>
              )}
            </button>
            <button
              onClick={() => setShowAICenter(true)}
              className={PRIMARY_BUTTON}
            >
              <span className="material-symbols-outlined">smart_toy</span>
              Start AI Call
            </button>

          </div>

          {/* Verification Steps Progress - Minimal */}
          <div className="flex-1 max-w-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Progress
              </span>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Step {getVerificationStep()} of 4
              </span>
            </div>
            {/* Simplified Progress Line */}
            <div className="relative">
              <div className="flex items-center gap-2">
                {/* Step 1 */}
                <div className="flex flex-col items-center flex-1">
                  <div className={`flex items-center justify-center w-7 h-7 rounded-full ${getStepConfig('eligibilityCheck').bgColor} ${getStepConfig('eligibilityCheck').textColor} shrink-0`}>
                    <span className="material-symbols-outlined text-sm">{getStepConfig('eligibilityCheck').icon}</span>
                  </div>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1.5 text-center leading-tight">
                    {getStepConfig('eligibilityCheck').label}
                  </p>
                </div>

                {/* Connector 1 */}
                <div className={`h-px flex-1 ${getConnectorColor('eligibilityCheck')} -mt-5`}></div>

                {/* Step 2 */}
                <div className="flex flex-col items-center flex-1">
                  <div className={`flex items-center justify-center w-7 h-7 rounded-full ${getStepConfig('benefitsVerification').bgColor} ${getStepConfig('benefitsVerification').textColor} shrink-0`}>
                    <span className="material-symbols-outlined text-sm">{getStepConfig('benefitsVerification').icon}</span>
                  </div>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1.5 text-center leading-tight">
                    {getStepConfig('benefitsVerification').label}
                  </p>
                </div>

                {/* Connector 2 */}
                <div className={`h-px flex-1 ${getConnectorColor('benefitsVerification')} -mt-5`}></div>

                {/* Step 3 */}
                <div className="flex flex-col items-center flex-1">
                  <div className={`flex items-center justify-center w-7 h-7 rounded-full ${getStepConfig('aiCallVerification').bgColor} ${getStepConfig('aiCallVerification').textColor} shrink-0`}>
                    <span className="material-symbols-outlined text-sm">{getStepConfig('aiCallVerification').icon}</span>
                  </div>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1.5 text-center leading-tight">
                    {getStepConfig('aiCallVerification').label}
                  </p>
                </div>

                {/* Connector 3 */}
                <div className={`h-px flex-1 ${getConnectorColor('aiCallVerification')} -mt-5`}></div>

                {/* Step 4 */}
                <div className="flex flex-col items-center flex-1">
                  <div className={`flex items-center justify-center w-7 h-7 rounded-full ${getStepConfig('sendToPMS').bgColor} ${getStepConfig('sendToPMS').textColor} shrink-0`}>
                    <span className="material-symbols-outlined text-sm">{getStepConfig('sendToPMS').icon}</span>
                  </div>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1.5 text-center leading-tight">
                    {getStepConfig('sendToPMS').label}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation - Clean minimal style */}
      <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-8 sticky top-0 z-10">
        <nav aria-label="Tabs" className="flex -mb-px gap-1 overflow-x-auto">
          {Object.values(TAB_TYPES)
            .filter(tab => {
              // Hide Appointments and Treatment History tabs for non-admin users
              if (!isAdmin && (tab === TAB_TYPES.APPOINTMENTS || tab === TAB_TYPES.TREATMENT_HISTORY)) {
                return false;
              }
              return true;
            })
            .map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`shrink-0 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                {TAB_LABELS[tab]}
              </button>
            ))}
        </nav>
      </div>

      {/* Sub-Tab Navigation - Only visible when Insurance tab is active */}
      {activeTab === TAB_TYPES.INSURANCE && (
        <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-8 py-2">
          <nav aria-label="Insurance Sub Tabs" className="flex gap-1">
            {Object.values(INSURANCE_SUB_TAB_TYPES).map((subTab) => (
              <button
                key={subTab}
                onClick={() => setInsuranceSubTab(subTab)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  insuranceSubTab === subTab
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                {INSURANCE_SUB_TAB_LABELS[subTab]}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Tab Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-8">

        {/* Tab Content - Patient Basic Info */}
        {activeTab === TAB_TYPES.PATIENT_BASIC_INFO && (
          <TabContent>
            <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-medium text-slate-900 dark:text-white">
                  Patient Basic Info
                </h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Patient ID
                  </p>
                  <p className="font-medium text-slate-800 dark:text-slate-100">
                    {patient.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Date of Birth
                  </p>
                  <p className="font-medium text-slate-800 dark:text-slate-100">
                    {patient.birthDate}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Age
                  </p>
                  <p className="font-medium text-slate-800 dark:text-slate-100">
                    {calculateAge(patient.birthDate)} years
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Gender
                  </p>
                  <p className="font-medium text-slate-800 dark:text-slate-100 capitalize">
                    {patient.gender}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Status
                  </p>
                  <p className="font-medium text-slate-800 dark:text-slate-100">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        patient.active
                          ? "bg-status-green/20 text-status-green"
                          : "bg-status-red/20 text-status-red"
                      }`}
                    >
                      {patient.active ? "Active" : "Inactive"}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-medium text-slate-900 dark:text-white">
                  Contact Information
                </h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Phone
                  </p>
                  <p className="font-medium text-slate-800 dark:text-slate-100">
                    {getPhone()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Email
                  </p>
                  <p className="font-medium text-slate-800 dark:text-slate-100">
                    {getEmail()}
                  </p>
                </div>
                <div className="col-span-full">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Address
                  </p>
                  <p className="font-medium text-slate-800 dark:text-slate-100">
                    {getAddress()}
                  </p>
                </div>
              </div>
            </div>
          </TabContent>
        )}

        {/* Tab Content - Insurance with Sub Tabs */}
        {activeTab === TAB_TYPES.INSURANCE && (
          <>
            {/* Insurance Info Sub Tab */}
            {insuranceSubTab === INSURANCE_SUB_TAB_TYPES.INSURANCE_INFO && (
              <TabContent>
                {(patient as any).insurance &&
                (patient as any).insurance.length > 0 ? (
                  (patient as any).insurance.map(
                    (ins: Insurance, index: number) => (
                      <div
                        key={index}
                        className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      >
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                              {ins.type}
                            </span>
                            <h3 className="text-sm font-medium text-slate-900 dark:text-white">
                              {ins.provider}
                            </h3>
                          </div>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              Policy Number
                            </p>
                            <p className="font-medium text-slate-800 dark:text-slate-100">
                              {ins.policyNumber}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              Group Number
                            </p>
                            <p className="font-medium text-slate-800 dark:text-slate-100">
                              {ins.groupNumber}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              Subscriber Name
                            </p>
                            <p className="font-medium text-slate-800 dark:text-slate-100">
                              {ins.subscriberName}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              Relationship
                            </p>
                            <p className="font-medium text-slate-800 dark:text-slate-100">
                              {ins.relationship}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              Effective Date
                            </p>
                            <p className="font-medium text-slate-800 dark:text-slate-100">
                              {ins.effectiveDate}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              Expiration Date
                            </p>
                            <p className="font-medium text-slate-800 dark:text-slate-100">
                              {ins.expirationDate}
                            </p>
                          </div>
                          <div className="col-span-full mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                              Coverage Summary
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                              <div>
                                <span className="text-slate-500">Deductible:</span>{" "}
                                <span className="font-medium">
                                  {ins.coverage.deductible}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-500">Met:</span>{" "}
                                <span className="font-medium">
                                  {ins.coverage.deductibleMet}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-500">Max Benefit:</span>{" "}
                                <span className="font-medium">
                                  {ins.coverage.maxBenefit}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-500">Preventive:</span>{" "}
                                <span className="font-medium">
                                  {ins.coverage.preventiveCoverage}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-500">Basic:</span>{" "}
                                <span className="font-medium">
                                  {ins.coverage.basicCoverage}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-500">Major:</span>{" "}
                                <span className="font-medium">
                                  {ins.coverage.majorCoverage}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      No insurance information on file
                    </p>
                  </div>
                )}
              </TabContent>
            )}

            {/* Coverage Details Sub Tab */}
            {insuranceSubTab === INSURANCE_SUB_TAB_TYPES.COVERAGE_DETAILS && (
              <TabContent>
                {(patient as any).coverage &&
                (patient as any).coverage.procedures.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                          Annual Maximum
                        </p>
                        <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                          $
                          {(
                            patient as any
                          ).coverage.annual_maximum.toLocaleString()}
                        </p>
                      </div>
                      <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                          Used This Year
                        </p>
                        <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                          ${(patient as any).coverage.annual_used.toLocaleString()}
                        </p>
                      </div>
                      <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                          Remaining Benefit
                        </p>
                        <p className="text-2xl font-semibold text-status-green">
                          $
                          {(
                            (patient as any).coverage.annual_maximum -
                            (patient as any).coverage.annual_used
                          ).toLocaleString()}
                        </p>
                      </div>
                      <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                          Deductible Remaining
                        </p>
                        <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                          $
                          {(
                            (patient as any).coverage.deductible -
                            (patient as any).coverage.deductible_met
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
                      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                        <h3 className="text-sm font-medium text-slate-900 dark:text-white">
                          Coverage by Procedure
                        </h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-slate-50 dark:bg-slate-800">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Code
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Procedure
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Category
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Coverage
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Est. Cost
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Patient Pays
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {(patient as any).coverage.procedures.map(
                              (proc: Procedure, index: number) => (
                                <tr
                                  key={index}
                                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                >
                                  <td className="px-4 py-3 text-sm font-mono font-semibold text-primary">
                                    {proc.code}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                                    {proc.name}
                                  </td>
                                  <td className="px-4 py-3">
                                    <span
                                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                                        proc.category === "Preventive"
                                          ? "bg-blue-500/20 text-blue-600"
                                          : proc.category === "Basic"
                                            ? "bg-status-orange/20 text-status-orange"
                                            : proc.category === "Major"
                                              ? "bg-status-red/20 text-status-red"
                                              : "bg-slate-500/20 text-slate-600"
                                      }`}
                                    >
                                      {proc.category}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-sm font-semibold text-status-green">
                                    {proc.coverage}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                                    {proc.estimated_cost}
                                  </td>
                                  <td className="px-4 py-3 text-sm font-semibold text-status-red">
                                    {proc.patient_pays}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      No coverage details available
                    </p>
                  </div>
                )}
              </TabContent>
            )}

            {/* Verification Form Sub Tab */}
            {insuranceSubTab === INSURANCE_SUB_TAB_TYPES.VERIFICATION_FORM && (
              <VerificationForm patient={patient} />
            )}
          </>
        )}

        {/* Tab Content - Appointments */}
        {activeTab === TAB_TYPES.APPOINTMENTS && (
          <TabContent className="space-y-4">
            {(patient as any).appointments &&
            (patient as any).appointments.length > 0 ? (
              (patient as any).appointments.map(
                (appt: Appointment, index: number) => (
                  <div
                    key={index}
                    className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {appt.date} at {appt.time}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {appt.type} - {appt.provider}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          appt.status === "completed"
                            ? "bg-status-green/20 text-status-green"
                            : appt.status === "scheduled"
                              ? "bg-blue-500/20 text-blue-600"
                              : "bg-status-red/20 text-status-red"
                        }`}
                      >
                        {appt.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No appointments scheduled
                </p>
              </div>
            )}
          </TabContent>
        )}

        {/* Tab Content - Treatment History */}
        {activeTab === TAB_TYPES.TREATMENT_HISTORY && (
          <TabContent className="space-y-4">
            {(patient as any).treatments &&
            (patient as any).treatments.length > 0 ? (
              (patient as any).treatments.map(
                (treatment: Treatment, index: number) => (
                  <div
                    key={index}
                    className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {treatment.name}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {treatment.date}
                        </p>
                      </div>
                      <p className="font-semibold text-primary">
                        {treatment.cost}
                      </p>
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No treatment history available
                </p>
              </div>
            )}
          </TabContent>
        )}

        {/* Tab Content - AI Call History */}
        {activeTab === TAB_TYPES.AI_CALL_HISTORY && (
          <TabContent className="space-y-4">
            {(patient as any).aiCallHistory &&
            (patient as any).aiCallHistory.length > 0 ? (
              (patient as any).aiCallHistory.map(
                (call: any, index: number) => (
                  <div
                    key={index}
                    className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-3 shrink-0">
                        <span className="material-symbols-outlined text-slate-600 dark:text-slate-400 text-lg">
                          smart_toy
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-slate-900 dark:text-white">
                            {call.topic || "AI Consultation"}
                          </p>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {call.date} at {call.time}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                          {call.summary || "AI-assisted consultation"}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                          <div>
                            Duration: {call.duration || "N/A"}
                          </div>
                          <div>
                            Agent: {call.agent || "Smith AI"}
                          </div>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              call.status === "completed"
                                ? "bg-status-green/10 text-status-green"
                                : call.status === "in_progress"
                                  ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                                  : "bg-status-orange/10 text-status-orange"
                            }`}
                          >
                            {call.status?.toUpperCase() || "COMPLETED"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center">
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-8">
                    <span className="material-symbols-outlined text-slate-400 dark:text-slate-600 text-5xl">
                      smart_toy
                    </span>
                  </div>
                  <div>
                    <p className="text-slate-900 dark:text-white font-medium mb-1">
                      No AI Call History
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Start a call with Smith AI Center to see call history here
                    </p>
                  </div>
                </div>
              </div>
            )}
          </TabContent>
        )}
      </div>

      {/* Smith AI Center Modal */}
      {showAICenter && (
        <SmithAICenter
          patient={patient}
          onClose={() => setShowAICenter(false)}
        />
      )}

      {/* Coverage Verification Modal */}
      <CoverageModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        data={coverageData}
        isLoading={isLoadingSampleData}
        error={verificationError}
        curlCommand={curlCommand}
      />
    </section>
  );
};

export default PatientDetail;
