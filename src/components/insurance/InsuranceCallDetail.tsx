import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../Header';

const InsuranceCallDetail: React.FC = () => {
  const navigate = useNavigate();
  const { callId } = useParams<{ callId: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'conversation' | 'verification'>('overview');

  const handleLogout = () => {
    navigate('/');
  };

  // Mock call data - in real app, fetch based on callId
  const callData = {
    id: callId || 'CALL-001',
    callDate: '2025-12-08',
    callTime: '09:15 AM',
    patientName: 'John Smith',
    patientDOB: '1985-03-15',
    patientId: 'PAT-12345',
    dentalOffice: 'Bright Smiles Dental',
    dentalOfficePhone: '(555) 123-4567',
    callerName: 'Dr. Sarah Martinez',
    duration: '5:23',
    status: 'completed',
    verificationResult: 'Coverage Verified',
    coverageDetails: {
      policyNumber: 'BC-987654321',
      groupNumber: 'GRP-12345',
      effectiveDate: '2024-01-01',
      planType: 'PPO',
      annualMaximum: '$1,500',
      deductible: '$50 (Met)',
      copay: '$25',
      preventiveCoverage: '100%',
      basicCoverage: '80%',
      majorCoverage: '50%',
      orthodonticCoverage: 'Not Covered'
    },
    requestedServices: [
      { code: 'D0150', description: 'Comprehensive Oral Evaluation', covered: true, copay: '$25' },
      { code: 'D1110', description: 'Prophylaxis - Adult', covered: true, copay: '$0' },
      { code: 'D0274', description: 'Bitewing - Four Films', covered: true, copay: '$0' }
    ],
    conversationLog: [
      { time: '09:15:00', speaker: 'Dental Office', message: 'Hello, this is Dr. Sarah Martinez from Bright Smiles Dental calling regarding patient verification.' },
      { time: '09:15:15', speaker: 'Insurance Agent', message: 'Good morning, Dr. Martinez. I can help you with that. May I have the patient\'s information?' },
      { time: '09:15:30', speaker: 'Dental Office', message: 'Yes, patient name is John Smith, date of birth March 15, 1985, policy number BC-987654321.' },
      { time: '09:16:00', speaker: 'Insurance Agent', message: 'Thank you. Let me pull up the patient record... I have the account here.' },
      { time: '09:16:30', speaker: 'Insurance Agent', message: 'The patient has active PPO coverage effective from January 1, 2024. Annual maximum is $1,500 with $1,200 remaining.' },
      { time: '09:17:00', speaker: 'Dental Office', message: 'Great. We need to verify coverage for a comprehensive oral evaluation, adult prophylaxis, and bitewing x-rays.' },
      { time: '09:17:30', speaker: 'Insurance Agent', message: 'All three services are covered. The oral evaluation has a $25 copay, and the preventive services are covered at 100% with no copay.' },
      { time: '09:18:00', speaker: 'Dental Office', message: 'Perfect. Has the deductible been met?' },
      { time: '09:18:15', speaker: 'Insurance Agent', message: 'Yes, the $50 deductible has been met earlier this year.' },
      { time: '09:18:30', speaker: 'Dental Office', message: 'Excellent. Thank you for your help!' },
      { time: '09:18:38', speaker: 'Insurance Agent', message: 'You\'re welcome. Is there anything else I can help you with today?' },
      { time: '09:18:45', speaker: 'Dental Office', message: 'No, that\'s all. Thank you!' }
    ],
    notes: 'Patient has active coverage, $25 copay for exam. All requested services verified and approved.'
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-slate-950 overflow-hidden font-sans">
      {/* Header */}
      <Header
        onLogoClick={() => navigate('/insurance/dashboard')}
        onLogout={handleLogout}
        mode="insurance"
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-full">
          {/* Page Header */}
          <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => navigate('/insurance/dashboard')}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">arrow_back</span>
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Call Details - {callData.id}</h1>
                    <p className="text-sm text-gray-600">Verification call from {callData.dentalOffice}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Status</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      <span className="material-symbols-outlined text-sm mr-1">check_circle</span>
                      {callData.status.charAt(0).toUpperCase() + callData.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Call Information Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Call Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Date & Time</p>
              <p className="text-sm text-gray-900 mt-1">{callData.callDate} at {callData.callTime}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Duration</p>
              <p className="text-sm text-gray-900 mt-1">{callData.duration} minutes</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Dental Office</p>
              <p className="text-sm text-gray-900 mt-1">{callData.dentalOffice}</p>
              <p className="text-xs text-gray-500 mt-0.5">{callData.dentalOfficePhone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Caller</p>
              <p className="text-sm text-gray-900 mt-1">{callData.callerName}</p>
            </div>
          </div>
        </div>

        {/* Patient Information Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Patient Name</p>
              <p className="text-sm text-gray-900 mt-1">{callData.patientName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Date of Birth</p>
              <p className="text-sm text-gray-900 mt-1">{callData.patientDOB}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Patient ID</p>
              <p className="text-sm text-gray-900 mt-1">{callData.patientId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Policy Number</p>
              <p className="text-sm text-gray-900 mt-1">{callData.coverageDetails.policyNumber}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-xs transition-colors ${
                  activeTab === 'overview'
                    ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                Coverage Overview
              </button>
              <button
                onClick={() => setActiveTab('conversation')}
                className={`py-4 px-1 border-b-2 font-medium text-xs transition-colors ${
                  activeTab === 'conversation'
                    ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                Call Transcript
              </button>
              <button
                onClick={() => setActiveTab('verification')}
                className={`py-4 px-1 border-b-2 font-medium text-xs transition-colors ${
                  activeTab === 'verification'
                    ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                Service Verification
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Coverage Details</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600">Plan Type</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">{callData.coverageDetails.planType}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600">Annual Maximum</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">{callData.coverageDetails.annualMaximum}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600">Deductible</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">{callData.coverageDetails.deductible}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600">Preventive</p>
                      <p className="text-lg font-semibold text-green-600 mt-1">{callData.coverageDetails.preventiveCoverage}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600">Basic Services</p>
                      <p className="text-lg font-semibold text-blue-600 mt-1">{callData.coverageDetails.basicCoverage}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600">Major Services</p>
                      <p className="text-lg font-semibold text-orange-600 mt-1">{callData.coverageDetails.majorCoverage}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'conversation' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Call Transcript</h3>
                <div className="space-y-3">
                  {callData.conversationLog.map((entry, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${
                        entry.speaker === 'Insurance Agent'
                          ? 'bg-blue-50 border-l-4 border-blue-500'
                          : 'bg-gray-50 border-l-4 border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-900">{entry.speaker}</span>
                        <span className="text-xs text-gray-500">{entry.time}</span>
                      </div>
                      <p className="text-sm text-gray-700">{entry.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'verification' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Requested Services</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Coverage Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Patient Responsibility
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {callData.requestedServices.map((service, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {service.code}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {service.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {service.covered ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <span className="material-symbols-outlined text-sm mr-1">check_circle</span>
                                Covered
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <span className="material-symbols-outlined text-sm mr-1">cancel</span>
                                Not Covered
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {service.copay}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start">
                    <span className="material-symbols-outlined text-green-600 mr-3">info</span>
                    <div>
                      <p className="text-sm font-semibold text-green-900">Verification Result</p>
                      <p className="text-sm text-green-700 mt-1">{callData.notes}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceCallDetail;
