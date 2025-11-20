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
  onCancel?: () => void;
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
  onCancel,
}) => {
  const [showAICenter, setShowAICenter] = useState(false);
  const [insuranceSubTab, setInsuranceSubTab] = useState<InsuranceSubTabType>(INSURANCE_SUB_TAB_TYPES.VERIFICATION_FORM);

  // Run Validity API states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingSampleData, setIsLoadingSampleData] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [coverageData, setCoverageData] = useState<any>(null);
  const [curlCommand, setCurlCommand] = useState<string | null>(null);

  // Patient Basic Info editing states
  // Default to edit mode for non-admin, view mode for admin
  const [isEditing, setIsEditing] = useState(!isAdmin);
  const [editedBirthDate, setEditedBirthDate] = useState(patient.birthDate);
  const [editedAge, setEditedAge] = useState("");
  const [editedGender, setEditedGender] = useState(patient.gender);
  const [editedActive, setEditedActive] = useState(patient.active);
  const [editedPhone, setEditedPhone] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedAddress, setEditedAddress] = useState("");

  // Insurance editing states
  const [editedInsurance, setEditedInsurance] = useState<Insurance[]>([]);

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

  const getConnectorColor = () => {
    return 'bg-slate-300 dark:bg-slate-600';
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

  // Initialize edited contact info and insurance from patient data
  React.useEffect(() => {
    setEditedPhone(getPhone());
    setEditedEmail(getEmail());
    setEditedAddress(getAddress());
    setEditedInsurance((patient as any).insurance || []);
    setEditedAge(calculateAge(patient.birthDate).toString());
  }, [patient]);

  // Handle save changes
  const handleSave = () => {
    // Here you would typically call an API to save the changes
    console.log("Saving changes:", {
      birthDate: editedBirthDate,
      gender: editedGender,
      active: editedActive,
      phone: editedPhone,
      email: editedEmail,
      address: editedAddress,
      insurance: editedInsurance,
    });
    setIsEditing(false);
  };

  // Handle cancel editing
  const handleCancel = () => {
    setEditedBirthDate(patient.birthDate);
    setEditedAge(calculateAge(patient.birthDate).toString());
    setEditedGender(patient.gender);
    setEditedActive(patient.active);
    setEditedPhone(getPhone());
    setEditedEmail(getEmail());
    setEditedAddress(getAddress());
    setEditedInsurance((patient as any).insurance || []);
    setIsEditing(false);
  };

  // Handle insurance field change
  const handleInsuranceChange = (index: number, field: keyof Insurance, value: string) => {
    const updated = [...editedInsurance];
    (updated[index] as any)[field] = value;
    setEditedInsurance(updated);
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
    <section key={patient.id} className="hidden w-0 flex-1 flex-col bg-background-light dark:bg-background-dark lg:flex lg:w-[85%] animate-fadeIn">
      {/* Profile Header - Compact */}
      <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="rounded-full h-10 w-10 overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&size=80&background=e2e8f0&color=475569&bold=false&format=svg`}
              alt={fullName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              {fullName}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ID: {patient.id}
            </p>
          </div>

          <div className={`flex-1 flex justify-center gap-2 ${patient.id.startsWith('new-') ? 'invisible' : ''}`}>
            <button
              onClick={handleLoadSampleData}
              disabled={isLoadingSampleData || patient.id.startsWith('new-')}
              className="px-3 py-1.5 bg-slate-900 dark:bg-slate-800 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-700 flex items-center gap-1.5 text-sm disabled:opacity-50"
            >
              {isLoadingSampleData ? (
                <>
                  <span className="animate-spin material-symbols-outlined text-base">refresh</span>
                  Loading...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">description</span>
                  Run  API Interface
                </>
              )}
            </button>
            <button
              onClick={() => setShowAICenter(true)}
              disabled={patient.id.startsWith('new-')}
              className="px-3 py-1.5 bg-slate-900 dark:bg-slate-800 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-700 flex items-center gap-1.5 text-sm disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-base">smart_toy</span>
              Start AI Call Center
            </button>
          </div>

          {/* Verification Steps Progress - Compact */}
          <div className="flex-1 max-w-md">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                Progress
              </span>
              <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">
                Step {getVerificationStep()} of 4
              </span>
            </div>
            {/* Simplified Progress Line */}
            <div className="relative">
              {/* Background connector line */}
              <div className="absolute top-2.5 left-0 right-0 h-px bg-slate-300 dark:bg-slate-600" style={{ left: '10%', right: '10%' }}></div>

              {/* Steps */}
              <div className="relative flex items-start justify-between">
                {/* Step 1 */}
                <div className="flex flex-col items-center" style={{ width: '25%' }}>
                  <div className={`flex items-center justify-center w-5 h-5 rounded-full ${getStepConfig('eligibilityCheck').bgColor} ${getStepConfig('eligibilityCheck').textColor} shrink-0 relative z-10`}>
                    <span className="material-symbols-outlined text-xs">{getStepConfig('eligibilityCheck').icon}</span>
                  </div>
                  <p className="text-[8px] text-slate-600 dark:text-slate-400 mt-0.5 text-center leading-tight">
                    {getStepConfig('eligibilityCheck').label}
                  </p>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center" style={{ width: '25%' }}>
                  <div className={`flex items-center justify-center w-5 h-5 rounded-full ${getStepConfig('benefitsVerification').bgColor} ${getStepConfig('benefitsVerification').textColor} shrink-0 relative z-10`}>
                    <span className="material-symbols-outlined text-xs">{getStepConfig('benefitsVerification').icon}</span>
                  </div>
                  <p className="text-[8px] text-slate-600 dark:text-slate-400 mt-0.5 text-center leading-tight">
                    {getStepConfig('benefitsVerification').label}
                  </p>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center" style={{ width: '25%' }}>
                  <div className={`flex items-center justify-center w-5 h-5 rounded-full ${getStepConfig('aiCallVerification').bgColor} ${getStepConfig('aiCallVerification').textColor} shrink-0 relative z-10`}>
                    <span className="material-symbols-outlined text-xs">{getStepConfig('aiCallVerification').icon}</span>
                  </div>
                  <p className="text-[8px] text-slate-600 dark:text-slate-400 mt-0.5 text-center leading-tight">
                    {getStepConfig('aiCallVerification').label}
                  </p>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col items-center" style={{ width: '25%' }}>
                  <div className={`flex items-center justify-center w-5 h-5 rounded-full ${getStepConfig('sendToPMS').bgColor} ${getStepConfig('sendToPMS').textColor} shrink-0 relative z-10`}>
                    <span className="material-symbols-outlined text-xs">{getStepConfig('sendToPMS').icon}</span>
                  </div>
                  <p className="text-[8px] text-slate-600 dark:text-slate-400 mt-0.5 text-center leading-tight">
                    {getStepConfig('sendToPMS').label}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation - Clean minimal style */}
      <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 sticky top-0 z-10">
        <nav aria-label="Tabs" className="flex -mb-px gap-1 overflow-x-auto">
          {Object.values(TAB_TYPES)
            .filter(tab => {
              // Hide Insurance Basic tab since it's merged into Patient Basic
              if (tab === TAB_TYPES.INSURANCE_INFO) {
                return false;
              }
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
        <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-1.5">
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
      <div className="flex-1 overflow-y-auto p-4">

        {/* Tab Content - Patient Basic Info */}
        {activeTab === TAB_TYPES.PATIENT_BASIC_INFO && (
          <TabContent>
            <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-medium text-slate-900 dark:text-white">
                    Patient Infomation
                  </h3>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    ID: <span className="font-medium text-slate-700 dark:text-slate-300">{patient.id}</span>
                  </span>
                </div>
                {isAdmin && !isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                    Edit
                  </button>
                )}
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm text-slate-500 dark:text-slate-400 mb-2 block">
                    Date of Birth
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editedBirthDate}
                      onChange={(e) => setEditedBirthDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                  ) : (
                    <p className="font-medium text-slate-800 dark:text-slate-100">
                      {patient.birthDate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-slate-500 dark:text-slate-400 mb-2 block">
                    Age
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedAge}
                      onChange={(e) => setEditedAge(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      placeholder="Age"
                    />
                  ) : (
                    <p className="font-medium text-slate-800 dark:text-slate-100">
                      {calculateAge(patient.birthDate)} years
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-slate-500 dark:text-slate-400 mb-2 block">
                    Gender
                  </label>
                  {isEditing ? (
                    <select
                      value={editedGender}
                      onChange={(e) => setEditedGender(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary capitalize text-sm"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <p className="font-medium text-slate-800 dark:text-slate-100 capitalize">
                      {patient.gender}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-slate-500 dark:text-slate-400 mb-2 block">
                    Status
                  </label>
                  {isEditing ? (
                    <select
                      value={editedActive ? "active" : "inactive"}
                      onChange={(e) => setEditedActive(e.target.value === "active")}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  ) : (
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
                  )}
                </div>
              </div>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-medium text-slate-900 dark:text-white">
                  Contact Information
                </h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm text-slate-500 dark:text-slate-400 mb-2 block">
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedPhone}
                      onChange={(e) => setEditedPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      placeholder="(555) 555-5555"
                    />
                  ) : (
                    <p className="font-medium text-slate-800 dark:text-slate-100">
                      {getPhone()}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-slate-500 dark:text-slate-400 mb-2 block">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      placeholder="email@example.com"
                    />
                  ) : (
                    <p className="font-medium text-slate-800 dark:text-slate-100">
                      {getEmail()}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-slate-500 dark:text-slate-400 mb-2 block">
                    Address
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedAddress}
                      onChange={(e) => setEditedAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      placeholder="123 Main St, City, State ZIP"
                    />
                  ) : (
                    <p className="font-medium text-slate-800 dark:text-slate-100">
                      {getAddress()}
                    </p>
                  )}
                </div>
              </div>
              {isAdmin && isEditing && (
                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className={PRIMARY_BUTTON}
                  >
                    <span className="material-symbols-outlined">save</span>
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {/* Insurance Basic Info - Merged into Patient Basic */}
            {(isEditing ? editedInsurance : (patient as any).insurance) &&
            (isEditing ? editedInsurance.length > 0 : (patient as any).insurance?.length > 0) ? (
              (isEditing ? editedInsurance : (patient as any).insurance).map(
                (ins: Insurance, index: number) => (
                  <div
                    key={index}
                    className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  >
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                      <h3 className="text-sm font-medium text-slate-900 dark:text-white">
                        Insurance Information
                      </h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-sm text-slate-500 dark:text-slate-400 mb-2 block">
                          Type
                        </label>
                        {isEditing ? (
                          <select
                            value={ins.type}
                            onChange={(e) => handleInsuranceChange(index, 'type', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                          >
                            <option value="Primary">Primary</option>
                            <option value="Secondary">Secondary</option>
                          </select>
                        ) : (
                          <p className="font-medium text-slate-800 dark:text-slate-100">
                            {ins.type}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm text-slate-500 dark:text-slate-400 mb-2 block">
                          Provider
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={ins.provider}
                            onChange={(e) => handleInsuranceChange(index, 'provider', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            placeholder="Provider Name"
                          />
                        ) : (
                          <p className="font-medium text-slate-800 dark:text-slate-100">
                            {ins.provider}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm text-slate-500 dark:text-slate-400 mb-2 block">
                          Policy Number
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={ins.policyNumber}
                            onChange={(e) => handleInsuranceChange(index, 'policyNumber', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            placeholder="Policy Number"
                          />
                        ) : (
                          <p className="font-medium text-slate-800 dark:text-slate-100">
                            {ins.policyNumber}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm text-slate-500 dark:text-slate-400 mb-2 block">
                          Group Number
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={ins.groupNumber}
                            onChange={(e) => handleInsuranceChange(index, 'groupNumber', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            placeholder="Group Number"
                          />
                        ) : (
                          <p className="font-medium text-slate-800 dark:text-slate-100">
                            {ins.groupNumber}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm text-slate-500 dark:text-slate-400 mb-2 block">
                          Subscriber Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={ins.subscriberName}
                            onChange={(e) => handleInsuranceChange(index, 'subscriberName', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            placeholder="Subscriber Name"
                          />
                        ) : (
                          <p className="font-medium text-slate-800 dark:text-slate-100">
                            {ins.subscriberName}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm text-slate-500 dark:text-slate-400 mb-2 block">
                          Relationship
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={ins.relationship}
                            onChange={(e) => handleInsuranceChange(index, 'relationship', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            placeholder="Relationship"
                          />
                        ) : (
                          <p className="font-medium text-slate-800 dark:text-slate-100">
                            {ins.relationship}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm text-slate-500 dark:text-slate-400 mb-2 block">
                          Effective Date
                        </label>
                        {isEditing ? (
                          <input
                            type="date"
                            value={ins.effectiveDate}
                            onChange={(e) => handleInsuranceChange(index, 'effectiveDate', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                          />
                        ) : (
                          <p className="font-medium text-slate-800 dark:text-slate-100">
                            {ins.effectiveDate}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm text-slate-500 dark:text-slate-400 mb-2 block">
                          Expiration Date
                        </label>
                        {isEditing ? (
                          <input
                            type="date"
                            value={ins.expirationDate}
                            onChange={(e) => handleInsuranceChange(index, 'expirationDate', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                          />
                        ) : (
                          <p className="font-medium text-slate-800 dark:text-slate-100">
                            {ins.expirationDate}
                          </p>
                        )}
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

        {/* Tab Content - Insurance Info */}
        {activeTab === TAB_TYPES.INSURANCE_INFO && (
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

        {/* Tab Content - AI Insurance Verification with Sub Tabs */}
        {activeTab === TAB_TYPES.INSURANCE && (
          <>
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
                          <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                                Code
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                                Procedure
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                                Category
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                                Coverage
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                                Est. Cost
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                                Patient Pays
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {(patient as any).coverage.procedures.map(
                              (proc: Procedure, index: number) => (
                                <tr
                                  key={index}
                                  className="hover:bg-slate-50 dark:hover:bg-slate-800"
                                >
                                  <td className="px-6 py-4 text-sm font-mono font-medium text-slate-900 dark:text-white">
                                    {proc.code}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                                    {proc.name}
                                  </td>
                                  <td className="px-6 py-4">
                                    <span
                                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                        proc.category === "Preventive"
                                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-500"
                                          : proc.category === "Basic"
                                            ? "bg-status-orange/10 text-status-orange"
                                            : proc.category === "Major"
                                              ? "bg-status-red/10 text-status-red"
                                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                                      }`}
                                    >
                                      {proc.category}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-sm font-medium text-status-green">
                                    {proc.coverage}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                                    {proc.estimated_cost}
                                  </td>
                                  <td className="px-6 py-4 text-sm font-medium text-status-red">
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
              <TabContent>
                <VerificationForm patient={patient} />
              </TabContent>
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

      {/* Save Button for New Patients */}
      {patient.id.startsWith('new-') && (
        <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                if (onCancel) {
                  onCancel();
                }
              }}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Handle save - would save the new patient data
                console.log('Save new patient:', patient);
              }}
              className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-700 text-sm font-medium"
            >
              Save Patient
            </button>
          </div>
        </div>
      )}

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
