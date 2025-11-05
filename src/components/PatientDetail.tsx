import React from "react";
import {
  Patient,
  Appointment,
  Insurance,
  Treatment,
  Procedure,
  TabType,
} from "../types/patient";

interface PatientDetailProps {
  patient: Patient;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onClose: () => void;
}

const PatientDetail: React.FC<PatientDetailProps> = ({
  patient,
  activeTab,
  onTabChange,
  onClose,
}) => {
  const getFullName = () => {
    const given = patient.name.given.join(" ");
    return `${given} ${patient.name.family}`.trim();
  };

  const getVerificationStep = () => {
    const status = patient.verificationStatus;
    if (!status) return 1;

    if (status.authorization === 'completed') return 3;
    if (status.authorization === 'in_progress') return 3;
    if (status.benefitsVerification === 'completed') return 3;
    if (status.benefitsVerification === 'in_progress') return 2;
    if (status.eligibilityCheck === 'completed') return 2;
    if (status.eligibilityCheck === 'in_progress') return 1;
    return 1;
  };

  const getStepConfig = (stepKey: 'eligibilityCheck' | 'benefitsVerification' | 'authorization') => {
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
        label: 'Benefits Verification',
        statusText: status === 'completed' ? 'Completed' : status === 'in_progress' ? 'In Progress' : 'Pending',
        statusColor: status === 'completed' ? 'text-status-green' : status === 'in_progress' ? 'text-primary' : 'text-slate-500 dark:text-slate-400',
      },
      authorization: {
        icon: status === 'completed' ? 'check' : status === 'in_progress' ? 'sync' : 'schedule',
        bgColor: status === 'completed' ? 'bg-status-green' : status === 'in_progress' ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700',
        textColor: status === 'completed' ? 'text-white' : status === 'in_progress' ? 'text-white' : 'text-slate-500 dark:text-slate-400',
        label: 'Authorization',
        statusText: status === 'completed' ? 'Completed' : status === 'in_progress' ? 'In Progress' : 'Pending',
        statusColor: status === 'completed' ? 'text-status-green' : status === 'in_progress' ? 'text-primary' : 'text-slate-500 dark:text-slate-400',
      }
    };
    return configs[stepKey];
  };

  const getConnectorColor = (fromStep: 'eligibilityCheck' | 'benefitsVerification') => {
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

  const fullName = getFullName();

  return (
    <section className="hidden w-0 flex-1 flex-col bg-background-light dark:bg-background-dark lg:flex lg:w-[70%]">
      {/* Profile Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-6 mb-4">
          <div className="rounded-full h-24 w-24 bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-white text-5xl">
              person
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {fullName}
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Patient ID: {patient.id}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
              Edit Profile
            </button>
            <button className="rounded-lg border border-transparent bg-transparent p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Close patient detail"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Verification Steps Progress */}
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Insurance Verification Status
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Step {getVerificationStep()} of 3
            </span>
          </div>
          <div className="space-y-3">
            {/* Progress Line with Steps */}
            <div className="flex items-center">
              {/* Step 1 Circle */}
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${getStepConfig('eligibilityCheck').bgColor} ${getStepConfig('eligibilityCheck').textColor} shrink-0 z-10`}>
                <span className="material-symbols-outlined text-lg">{getStepConfig('eligibilityCheck').icon}</span>
              </div>

              {/* Connector Line 1 */}
              <div className={`h-0.5 flex-1 ${getConnectorColor('eligibilityCheck')} -mx-0.5`}></div>

              {/* Step 2 Circle */}
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${getStepConfig('benefitsVerification').bgColor} ${getStepConfig('benefitsVerification').textColor} shrink-0 z-10`}>
                <span className="material-symbols-outlined text-lg">{getStepConfig('benefitsVerification').icon}</span>
              </div>

              {/* Connector Line 2 */}
              <div className={`h-0.5 flex-1 ${getConnectorColor('benefitsVerification')} -mx-0.5`}></div>

              {/* Step 3 Circle */}
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${getStepConfig('authorization').bgColor} ${getStepConfig('authorization').textColor} shrink-0 z-10`}>
                <span className="material-symbols-outlined text-lg">{getStepConfig('authorization').icon}</span>
              </div>
            </div>

            {/* Step Labels */}
            <div className="flex items-start">
              {/* Step 1 Label */}
              <div className="flex-1 text-center" style={{ maxWidth: '33.333%' }}>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  {getStepConfig('eligibilityCheck').label}
                </p>
                <p className={`text-xs ${getStepConfig('eligibilityCheck').statusColor}`}>
                  {getStepConfig('eligibilityCheck').statusText}
                </p>
              </div>

              {/* Step 2 Label */}
              <div className="flex-1 text-center" style={{ maxWidth: '33.333%' }}>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  {getStepConfig('benefitsVerification').label}
                </p>
                <p className={`text-xs ${getStepConfig('benefitsVerification').statusColor}`}>
                  {getStepConfig('benefitsVerification').statusText}
                </p>
              </div>

              {/* Step 3 Label */}
              <div className="flex-1 text-center" style={{ maxWidth: '33.333%' }}>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  {getStepConfig('authorization').label}
                </p>
                <p className={`text-xs ${getStepConfig('authorization').statusColor}`}>
                  {getStepConfig('authorization').statusText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="border-b border-slate-200 dark:border-slate-700">
          <nav aria-label="Tabs" className="flex -mb-px gap-6 overflow-x-auto">
            {(
              [
                "Demographics",
                "Insurance",
                "Coverage Details",
                "Appointments",
                "Treatment History",
              ] as TabType[]
            ).map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`shrink-0 border-b-2 px-1 pb-3 text-sm font-semibold whitespace-nowrap ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content - Demographics */}
        {activeTab === "Demographics" && (
          <div className="mt-6 space-y-6">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Patient Demographics
                </h3>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Contact Information
                </h3>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        )}

        {/* Tab Content - Insurance */}
        {activeTab === "Insurance" && (
          <div className="mt-6 space-y-6">
            {(patient as any).insurance &&
            (patient as any).insurance.length > 0 ? (
              (patient as any).insurance.map(
                (ins: Insurance, index: number) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  >
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary">
                          {ins.type}
                        </span>
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {ins.provider}
                        </h3>
                      </div>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          Coverage Details
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
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center">
                <p className="text-slate-500 dark:text-slate-400">
                  No insurance information on file
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab Content - Appointments */}
        {activeTab === "Appointments" && (
          <div className="mt-6 space-y-4">
            {(patient as any).appointments &&
            (patient as any).appointments.length > 0 ? (
              (patient as any).appointments.map(
                (appt: Appointment, index: number) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
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
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center">
                <p className="text-slate-500 dark:text-slate-400">
                  No appointments scheduled
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab Content - Treatment History */}
        {activeTab === "Treatment History" && (
          <div className="mt-6 space-y-4">
            {(patient as any).treatments &&
            (patient as any).treatments.length > 0 ? (
              (patient as any).treatments.map(
                (treatment: Treatment, index: number) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
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
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center">
                <p className="text-slate-500 dark:text-slate-400">
                  No treatment history available
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab Content - Coverage Details */}
        {activeTab === "Coverage Details" && (
          <div className="mt-6 space-y-6">
            {(patient as any).coverage &&
            (patient as any).coverage.procedures.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Annual Maximum
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      $
                      {(
                        patient as any
                      ).coverage.annual_maximum.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Used This Year
                    </p>
                    <p className="text-2xl font-bold text-status-red">
                      ${(patient as any).coverage.annual_used.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Remaining Benefit
                    </p>
                    <p className="text-2xl font-bold text-status-green">
                      $
                      {(
                        (patient as any).coverage.annual_maximum -
                        (patient as any).coverage.annual_used
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Deductible Remaining
                    </p>
                    <p className="text-2xl font-bold text-status-orange">
                      $
                      {(
                        (patient as any).coverage.deductible -
                        (patient as any).coverage.deductible_met
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
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
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center">
                <p className="text-slate-500 dark:text-slate-400">
                  No coverage details available
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default PatientDetail;
