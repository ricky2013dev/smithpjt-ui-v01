import React, { useState } from 'react';
import { VERIFICATION_STATUS_LABELS } from '../constants/verificationStatus';

interface CallCommunication {
  timestamp: string;
  speaker: 'AI' | 'InsuranceRep' | 'System';
  message: string;
  type: 'question' | 'answer' | 'confirmation' | 'hold' | 'transfer' | 'note';
}

interface Transaction {
  id: string;
  requestId: string;
  type: 'API' | 'CALL';
  method: string;
  startTime: string;
  endTime: string;
  duration: string;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  patientId: string;
  patientName: string;
  insuranceProvider: string;
  insuranceRep: string;
  runBy: string;
  dataVerified: string[];
  verificationScore: number;
  responseCode?: string;
  endpoint?: string;
  phoneNumber?: string;
  errorMessage?: string;
  callHistory?: CallCommunication[];
  details: {
    eligibilityCheck?: string;
    benefitsVerification?: string;
    coverageDetails?: string;
    deductibleInfo?: string;
    transcript?: string;
    rawResponse?: string;
  };
}

export const mockData: Transaction[] = [
  // API SUCCESS
  {
    id: '1',
    requestId: 'REQ-2025-11-28-0930',
    type: 'API',
    method: 'POST /api/benefits/query',
    startTime: '2025-11-28 09:30:15',
    endTime: '2025-11-28 09:30:21',
    duration: '6s',
    status: 'SUCCESS',
    patientId: 'P001',
    patientName: 'Robert Taylor',
    insuranceProvider: 'Cigna Dental',
    insuranceRep: 'System',
    runBy: 'Smith AI System',
    dataVerified: ['Eligibility', 'Benefits', 'Coverage', 'Deductibles'],
    verificationScore: 100,
    responseCode: '200',
    endpoint: 'https://api.cigna.com/dental/benefits',
    details: {
      eligibilityCheck: 'ACTIVE - Policy effective through 12/31/2026',
      benefitsVerification: 'Preventive: 100%, Basic: 80%, Major: 50%',
      coverageDetails: 'Annual Maximum: $1,800 | Used: $0 | Remaining: $1,800',
      deductibleInfo: 'Deductible: $100 | Met: $0',
      rawResponse: '{"status":"active","coverage":{"preventive":"100%","basic":"80%","major":"50%"},"annual_max":1800,"annual_used":0,"deductible_met":0}'
    }
  },
  // CALL SUCCESS
  {
    id: '2',
    requestId: 'REQ-2025-11-28-1045',
    type: 'CALL',
    method: 'VOICE /ai-agent/verify',
    startTime: '2025-11-28 10:45:22',
    endTime: '2025-11-28 11:02:15',
    duration: '16m 53s',
    status: 'SUCCESS',
    patientId: 'P002',
    patientName: 'Sarah Johnson',
    insuranceProvider: 'Cigna Dental',
    insuranceRep: 'Amanda Rodriguez',
    runBy: 'Smith AI System',
    dataVerified: ['Eligibility', 'Benefits', 'Coverage Limits', 'Deductibles'],
    verificationScore: 100,
    phoneNumber: '1-800-555-0188',
    callHistory: [
      {
        timestamp: '10:45:22',
        speaker: 'AI',
        message: 'Good morning, this is Smith Dental verification system. I am calling to verify dental insurance benefits for patient Sarah Johnson.',
        type: 'question'
      },
      {
        timestamp: '10:45:35',
        speaker: 'InsuranceRep',
        message: 'Good morning, this is Amanda from Cigna Dental. I can help you with that. May I have the member ID or policy number?',
        type: 'answer'
      },
      {
        timestamp: '10:45:50',
        speaker: 'AI',
        message: 'Thank you. The member ID is CIG-4567890 and the patient date of birth is March 15, 1990.',
        type: 'confirmation'
      },
      {
        timestamp: '10:46:10',
        speaker: 'InsuranceRep',
        message: 'I have Sarah Johnson in our system. Policy is active and in good standing. What information do you need to verify?',
        type: 'answer'
      },
      {
        timestamp: '10:46:25',
        speaker: 'AI',
        message: 'We need a comprehensive benefits verification. Can you confirm the policy effective dates and annual maximum?',
        type: 'question'
      },
      {
        timestamp: '10:46:45',
        speaker: 'InsuranceRep',
        message: 'Policy effective dates are January 1, 2025 through December 31, 2026. Annual maximum is $2,000 per calendar year.',
        type: 'answer'
      },
      {
        timestamp: '10:47:05',
        speaker: 'AI',
        message: 'How much of the annual maximum has been used?',
        type: 'question'
      },
      {
        timestamp: '10:47:20',
        speaker: 'InsuranceRep',
        message: 'None has been used. The full $2,000 is still available.',
        type: 'answer'
      },
      {
        timestamp: '10:47:35',
        speaker: 'AI',
        message: 'What is the individual deductible?',
        type: 'question'
      },
      {
        timestamp: '10:47:50',
        speaker: 'InsuranceRep',
        message: 'Individual deductible is $50 per calendar year and has not been met.',
        type: 'answer'
      },
      {
        timestamp: '10:48:10',
        speaker: 'AI',
        message: 'Can you provide coverage percentages for preventive, basic, and major services?',
        type: 'question'
      },
      {
        timestamp: '10:48:35',
        speaker: 'InsuranceRep',
        message: 'Preventive is covered at 100% with no deductible. Basic is 80% after deductible. Major is 50% after deductible.',
        type: 'answer'
      },
      {
        timestamp: '10:49:00',
        speaker: 'AI',
        message: 'Thank you. Let me confirm: Policy active through 12/31/2026, annual max $2,000 (unused), deductible $50 (not met), Preventive 100%, Basic 80%, Major 50%. Is that correct?',
        type: 'confirmation'
      },
      {
        timestamp: '10:49:20',
        speaker: 'InsuranceRep',
        message: 'Yes, that is absolutely correct. Is there anything else you need?',
        type: 'answer'
      },
      {
        timestamp: '10:49:35',
        speaker: 'AI',
        message: 'No, that covers everything we needed. Thank you for your assistance.',
        type: 'confirmation'
      },
      {
        timestamp: '10:49:45',
        speaker: 'System',
        message: 'Call completed successfully. All required information verified. Status: SUCCESS',
        type: 'note'
      }
    ],
    details: {
      transcript: 'Complete verification successful for patient Sarah Johnson. All benefits verified.',
      benefitsVerification: 'Preventive: 100%, Basic: 80%, Major: 50%',
      coverageDetails: 'Annual Maximum: $2,000 | Used: $0 | Remaining: $2,000',
      deductibleInfo: 'Individual Deductible: $50 | Met: $0'
    }
  }
];

interface FaxRequest {
  transactionId: string;
  status: 'idle' | 'step1' | 'step2' | 'step3' | 'completed';
  document?: {
    image: string;
    name: string;
  };
  analysis?: {
    confidence: number;
    fields: {
      name: string;
      value: string;
      confidence: number;
    }[];
  };
  codeAnalysis?: string;
}

// Create a global interface to expose fax functionality
declare global {
  interface Window {
    openFaxModal?: () => void;
  }
}

const SmartAITransactionHistory: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'API' | 'CALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'PARTIAL' | 'FAILED'>('ALL');
  const [activeDetailTab, setActiveDetailTab] = useState<{[key: string]: string}>({});
  const [faxRequest, setFaxRequest] = useState<FaxRequest | null>(null);

  // Expose fax modal function globally so it can be called from anywhere
  React.useEffect(() => {
    window.openFaxModal = () => {
      handleRequestFaxDocument(mockData[0]?.id || '1');
    };
    return () => {
      delete window.openFaxModal;
    };
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    if (!activeDetailTab[id]) {
      setActiveDetailTab({...activeDetailTab, [id]: 'action'});
    }
  };

  const setDetailTab = (transactionId: string, tab: string) => {
    setActiveDetailTab({...activeDetailTab, [transactionId]: tab});
  };

  // Handle fax document request
  const handleRequestFaxDocument = (transactionId: string) => {
    setFaxRequest({
      transactionId,
      status: 'step1',
      document: {
        image: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22800%22 viewBox=%220 0 600 800%22%3E%3Crect fill=%22%23fff%22 width=%22600%22 height=%22800%22/%3E%3Ctext x=%2230%22 y=%2250%22 font-size=%2224%22 font-weight=%22bold%22 fill=%22%23000%22%3EINSURANCE BENEFITS FAX%3C/text%3E%3Ctext x=%2230%22 y=%2290%22 font-size=%2214%22 fill=%22%23333%22%3ETo: Smith Dental%3C/text%3E%3Ctext x=%2230%22 y=%22115%22 font-size=%2214%22 fill=%22%23333%22%3EFrom: Cigna Dental Insurance%3C/text%3E%3Ctext x=%2230%22 y=%22140%22 font-size=%2214%22 fill=%22%23333%22%3EDate: November 28, 2025%3C/text%3E%3Cline x1=%2230%22 y1=%22160%22 x2=%22570%22 y2=%22160%22 stroke=%22%23999%22/%3E%3Ctext x=%2230%22 y=%22200%22 font-size=%2216%22 font-weight=%22bold%22 fill=%22%23000%22%3EPatient: Sarah Johnson%3C/text%3E%3Ctext x=%2230%22 y=%22230%22 font-size=%2214%22 fill=%22%23333%22%3EMember ID: CIG-4567890%3C/text%3E%3Ctext x=%2230%22 y=%22255%22 font-size=%2214%22 fill=%22%23333%22%3EPlan: Cigna Dental PPO%3C/text%3E%3Ctext x=%2230%22 y=%22300%22 font-size=%2216%22 font-weight=%22bold%22 fill=%22%23000%22%3EBenefits Summary:%3C/text%3E%3Ctext x=%2230%22 y=%22330%22 font-size=%2213%22 fill=%22%23333%22%3E• Preventive: 100% (2 cleanings, 2 exams/year)%3C/text%3E%3Ctext x=%2230%22 y=%22355%22 font-size=%2213%22 fill=%22%23333%22%3E• Basic: 80% after $50 deductible%3C/text%3E%3Ctext x=%2230%22 y=%22380%22 font-size=%2213%22 fill=%22%23333%22%3E• Major: 50% after deductible%3C/text%3E%3Ctext x=%2230%22 y=%22405%22 font-size=%2213%22 fill=%22%23333%22%3E• Annual Maximum: $2,000/year%3C/text%3E%3Ctext x=%2230%22 y=%22430%22 font-size=%2213%22 fill=%22%23333%22%3E• Remaining: $2,000 (unused)%3C/text%3E%3Ctext x=%2230%22 y=%22475%22 font-size=%2216%22 font-weight=%22bold%22 fill=%22%23000%22%3EDeductible Status:%3C/text%3E%3Ctext x=%2230%22 y=%22505%22 font-size=%2213%22 fill=%22%23333%22%3EIndividual: $50 (Not Met)%3C/text%3E%3Ctext x=%2230%22 y=%22530%22 font-size=%2213%22 fill=%22%23333%22%3EFamily: $100 (Not Met)%3C/text%3E%3Ctext x=%2230%22 y=%22575%22 font-size=%2216%22 font-weight=%22bold%22 fill=%22%23000%22%3EWaiting Periods:%3C/text%3E%3Ctext x=%2230%22 y=%22605%22 font-size=%2213%22 fill=%22%23333%22%3ENone - All services immediately available%3C/text%3E%3Ctext x=%2230%22 y=%22650%22 font-size=%2213%22 fill=%22%23999%22 font-style=%22italic%22%3EThis fax contains confidential health information.%3C/text%3E%3Ctext x=%2230%22 y=%22675%22 font-size=%2213%22 fill=%22%23999%22 font-style=%22italic%22%3EIf you received this in error, please contact us immediately.%3C/text%3E%3C/svg%3E',
        name: 'Insurance_Fax_CIG4567890.pdf'
      }
    });
  };

  // Process fax through steps
  const processFaxStep = (nextStep: 'step2' | 'step3' | 'completed') => {
    if (!faxRequest) return;

    if (nextStep === 'step2') {
      setFaxRequest({
        ...faxRequest,
        status: 'step2',
        analysis: {
          confidence: 94.5,
          fields: [
            { name: 'Member ID', value: 'CIG-4567890', confidence: 99 },
            { name: 'Patient Name', value: 'Sarah Johnson', confidence: 98 },
            { name: 'Plan Type', value: 'Cigna Dental PPO', confidence: 96 },
            { name: 'Preventive Coverage', value: '100%', confidence: 95 },
            { name: 'Basic Coverage', value: '80%', confidence: 94 },
            { name: 'Major Coverage', value: '50%', confidence: 93 },
            { name: 'Annual Maximum', value: '$2,000', confidence: 97 },
            { name: 'Deductible', value: '$50', confidence: 92 },
          ]
        }
      });
    } else if (nextStep === 'step3') {
      setFaxRequest({
        ...faxRequest,
        status: 'step3',
        codeAnalysis: `{
  "fax_extraction": {
    "status": "SUCCESS",
    "confidence": 94.5,
    "fields_detected": 8,
    "fields_extracted": 8
  },
  "data_validation": {
    "member_id_format": "VALID",
    "plan_code": "CIGNA_DENTAL_PPO",
    "effective_date": "2025-01-01",
    "coverage_percentages": [100, 80, 50],
    "data_completeness": "COMPLETE"
  },
  "compliance_check": {
    "hipaa_compliant": true,
    "required_fields_present": true,
    "signature_verified": true
  },
  "processing_time_ms": 245,
  "timestamp": "2025-11-28T10:30:45.123Z"
}`
      });
    } else {
      setFaxRequest({
        ...faxRequest,
        status: 'completed'
      });
    }
  };

  // Format transcript with styling
  const formatTranscript = (transcript: string) => {
    const lines = transcript.split('\n');
    return lines.map((line, idx) => {
      // Check if line starts with AI Agent: or Insurance Rep: or Outcome:
      if (line.startsWith('AI Agent:')) {
        const content = line.substring(10); // Remove "AI Agent: "
        // Highlight key values in blue
        const formattedContent = highlightKeyValues(content);
        return (
          <div key={idx} className="mb-2">
            <span className="font-bold text-blue-600 dark:text-blue-400">AI Agent:</span>
            <span className="text-slate-700 dark:text-slate-300">{formattedContent}</span>
          </div>
        );
      } else if (line.startsWith('Insurance Rep:')) {
        const content = line.substring(15); // Remove "Insurance Rep: "
        const formattedContent = highlightKeyValues(content);
        return (
          <div key={idx} className="mb-2">
            <span className="font-medium text-slate-600 dark:text-slate-400">Insurance Rep:</span>
            <span className="text-slate-700 dark:text-slate-300">{formattedContent}</span>
          </div>
        );
      } else if (line.startsWith('Outcome:')) {
        const content = line.substring(9); // Remove "Outcome: "
        const formattedContent = highlightKeyValues(content);
        return (
          <div key={idx} className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
            <span className="font-bold text-green-700 dark:text-green-400">Outcome:</span>
            <span className="text-slate-700 dark:text-slate-300">{formattedContent}</span>
          </div>
        );
      } else if (line.trim() === '') {
        return <div key={idx} className="h-2"></div>;
      } else {
        return (
          <div key={idx} className="mb-2 text-slate-700 dark:text-slate-300">
            {highlightKeyValues(line)}
          </div>
        );
      }
    });
  };

  // Highlight key values like policy numbers, procedure codes, reference numbers
  const highlightKeyValues = (text: string) => {
    // Pattern for: policy numbers, procedure codes (D####), reference numbers, dates, dollar amounts
    const pattern = /([A-Z]{3,}-[0-9]+|D[0-9]{4}|BV[0-9-]+|\$[0-9,]+|[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}|January [0-9]{1,2}, [0-9]{4}|December [0-9]{1,2}, [0-9]{4}|[0-9]+%)/g;

    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = pattern.exec(text)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      // Add highlighted match
      parts.push(
        <span key={match.index} className="text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/20 px-1 rounded">
          {match[0]}
        </span>
      );
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  // Filter data based on selected filters
  const filteredData = mockData.filter(transaction => {
    const typeMatch = typeFilter === 'ALL' || transaction.type === typeFilter;
    const statusMatch = statusFilter === 'ALL' || transaction.status === statusFilter;
    return typeMatch && statusMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'text-green-600 dark:text-green-400';
      case 'PARTIAL':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'FAILED':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'API'
      ? 'text-blue-600 dark:text-blue-400'
      : 'text-purple-600 dark:text-purple-400';
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-1 px-4 py-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        {/* Type Filters */}
        <button
          onClick={() => setTypeFilter('ALL')}
          className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
            typeFilter === 'ALL'
              ? 'bg-slate-900 dark:bg-slate-700 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          ALL
        </button>
        <button
          onClick={() => setTypeFilter('API')}
          className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
            typeFilter === 'API'
              ? 'bg-blue-600 text-white'
              : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
          }`}
        >
          API
        </button>
        <button
          onClick={() => setTypeFilter('CALL')}
          className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
            typeFilter === 'CALL'
              ? 'bg-purple-600 text-white'
              : 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
          }`}
        >
          CALL
        </button>

        {/* Divider */}
        <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>

        {/* Status Filters */}
        <button
          onClick={() => setStatusFilter('SUCCESS')}
          className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
            statusFilter === 'SUCCESS'
              ? 'bg-green-600 text-white'
              : 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
          }`}
        >
          SUCCESS
        </button>
        <button
          onClick={() => setStatusFilter('PARTIAL')}
          className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
            statusFilter === 'PARTIAL'
              ? 'bg-yellow-600 text-white'
              : 'text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
          }`}
        >
          PARTIAL
        </button>
        <button
          onClick={() => setStatusFilter('FAILED')}
          className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
            statusFilter === 'FAILED'
              ? 'bg-red-600 text-white'
              : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
          }`}
        >
          FAILED
        </button>

        {/* Clear Filters */}
        {(typeFilter !== 'ALL' || statusFilter !== 'ALL') && (
          <button
            onClick={() => {
              setTypeFilter('ALL');
              setStatusFilter('ALL');
            }}
            className="px-2 py-0.5 rounded text-[10px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
          >
            Clear
          </button>
        )}

        {/* Results Count */}
        <div className="ml-auto text-[10px] text-slate-500 dark:text-slate-400">
          {filteredData.length} of {mockData.length}
        </div>
      </div>

      <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        {/* Header */}
        <div className="grid grid-cols-[auto_1fr] gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium">
          <div className="w-6"></div>
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-2">Start Time</div>
            <div className="col-span-1 text-center">Type</div>
            <div className="col-span-1 text-center">Status</div>
            <div className="col-span-2">Insurance Provider</div>
            <div className="col-span-2">Insurance Rep</div>
            <div className="col-span-1 text-center">Duration</div>
            <div className="col-span-1 text-center">Score</div>
            <div className="col-span-2">Run By</div>
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {filteredData.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-slate-400 dark:text-slate-500 mb-2">
                <span className="material-symbols-outlined text-5xl">filter_list_off</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium mb-1">No transactions found</p>
              <p className="text-sm text-slate-500 dark:text-slate-500">Try adjusting your filters</p>
            </div>
          ) : (
            filteredData.map((transaction) => (
            <div key={transaction.id} className="group">
              <div
                onClick={() => toggleExpand(transaction.id)}
                className="grid grid-cols-[auto_1fr] gap-3 p-3 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors text-sm text-slate-700 dark:text-slate-200"
              >
                <div className="w-6 flex items-center justify-center">
                  <span className={`material-symbols-outlined text-slate-400 dark:text-slate-500 text-lg transition-transform duration-200 ${
                    expandedId === transaction.id ? 'rotate-180' : ''
                  }`}>
                    expand_more
                  </span>
                </div>
                <div className="grid grid-cols-12 gap-3 items-center text-sm">
                  <div className="col-span-2">
                    <div className="text-slate-900 dark:text-white">{transaction.startTime}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{transaction.requestId}</div>
                  </div>
                  <div className={`col-span-1 text-center font-semibold text-xs ${getTypeColor(transaction.type)}`}>
                    {transaction.type}
                  </div>
                  <div className={`col-span-1 text-center font-semibold text-xs ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </div>
                  <div className="col-span-2 text-slate-700 dark:text-slate-300">{transaction.insuranceProvider}</div>
                  <div className="col-span-2 text-slate-600 dark:text-slate-400">{transaction.insuranceRep}</div>
                  <div className="col-span-1 text-center font-mono text-xs text-slate-600 dark:text-slate-400">{transaction.duration}</div>
                  <div className="col-span-1 text-center">
                    <span className={`font-semibold text-sm ${
                      transaction.verificationScore >= 90 ? 'text-green-600 dark:text-green-400' :
                      transaction.verificationScore >= 70 ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.verificationScore}%
                    </span>
                  </div>
                  <div className="col-span-2 text-slate-700 dark:text-slate-300">{transaction.runBy}</div>
                </div>
              </div>

              {/* Collapsible Detail */}
              {expandedId === transaction.id && (
                <div className="ml-8 p-2 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-700">
                  {/* Tabs */}
                  <div className="flex border-b border-slate-200 dark:border-slate-700 px-4">
                    <button
                      onClick={() => setDetailTab(transaction.id, 'action')}
                      className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                        (activeDetailTab[transaction.id] || 'action') === 'action'
                          ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white'
                          : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      Transaction Info
                    </button>
                    <button
                      onClick={() => setDetailTab(transaction.id, 'summary')}
                      className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                        (activeDetailTab[transaction.id] || 'action') === 'summary'
                          ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white'
                          : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      Transaction Summary
                    </button>
                    {transaction.status === 'SUCCESS' && transaction.callHistory && transaction.callHistory.length > 0 ? (
                      <button
                        onClick={() => setDetailTab(transaction.id, 'callHistory')}
                        className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                          (activeDetailTab[transaction.id] || 'action') === 'callHistory'
                            ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white'
                            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                      >
                        Call History Detail
                      </button>
                    ) : (
                      <button
                        onClick={() => setDetailTab(transaction.id, 'detail')}
                        className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                          (activeDetailTab[transaction.id] || 'action') === 'detail'
                            ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white'
                            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                      >
                        Transaction Detail
                      </button>
                    )}
                    <button
                      onClick={() => handleRequestFaxDocument(transaction.id)}
                      className="px-3 py-2 text-xs font-medium border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors ml-auto"
                      title="Request insurance fax document"
                    >
                      <span className="material-symbols-outlined text-sm align-text-bottom mr-1">description</span>
                      Request Fax
                    </button>
                  </div>

                  {/* Tab Content */}
                  <div className="p-8 mx-8">
                    {/* Transaction Action Info Tab */}
                    {(activeDetailTab[transaction.id] || 'action') === 'action' && (
                      <div className="space-y-4 text-sm">
                        {/* Transaction Meta Info */}
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Request ID</div>
                            <div className="font-mono text-xs text-slate-900 dark:text-white">{transaction.requestId}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Method</div>
                            <div className="font-mono text-xs text-slate-900 dark:text-white">{transaction.method}</div>
                          </div>
                          {transaction.endpoint && (
                            <div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Endpoint</div>
                              <div className="font-mono text-xs text-slate-900 dark:text-white truncate">{transaction.endpoint}</div>
                            </div>
                          )}
                          {transaction.phoneNumber && (
                            <div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Phone Number</div>
                              <div className="font-mono text-xs text-slate-900 dark:text-white">{transaction.phoneNumber}</div>
                            </div>
                          )}
                          {transaction.responseCode && (
                            <div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Response Code</div>
                              <div className="font-mono text-xs text-slate-900 dark:text-white">{transaction.responseCode}</div>
                            </div>
                          )}
                          <div className="col-span-2">
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Timing</div>
                            <div className="text-xs text-slate-900 dark:text-white">
                              Start: {transaction.startTime} | End: {transaction.endTime}
                            </div>
                          </div>
                        </div>

                        {/* Data Verified */}
                        {transaction.dataVerified.length > 0 && (
                          <div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">Data Verified</div>
                            <div className="flex flex-wrap gap-1">
                              {transaction.dataVerified.map((item, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded text-xs">
                                  ✓ {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Error Message */}
                        {transaction.errorMessage && (
                          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Error</div>
                            <div className="text-sm text-red-600 dark:text-red-400">{transaction.errorMessage}</div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content Summary Tab */}
                    {(activeDetailTab[transaction.id] || 'action') === 'summary' && (
                      <div className="space-y-3 text-sm">
                        {transaction.details.eligibilityCheck && (
                          <div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{VERIFICATION_STATUS_LABELS.ELIGIBILITY_CHECK}</div>
                            <div className="text-sm text-slate-700 dark:text-slate-300">{transaction.details.eligibilityCheck}</div>
                          </div>
                        )}

                        {transaction.details.benefitsVerification && (
                          <div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Benefits Verification</div>
                            <div className="text-sm text-slate-700 dark:text-slate-300">{transaction.details.benefitsVerification}</div>
                          </div>
                        )}

                        {transaction.details.coverageDetails && (
                          <div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Coverage Details</div>
                            <div className="text-sm text-slate-700 dark:text-slate-300">{transaction.details.coverageDetails}</div>
                          </div>
                        )}

                        {transaction.details.deductibleInfo && (
                          <div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Deductible Information</div>
                            <div className="text-sm text-slate-700 dark:text-slate-300">{transaction.details.deductibleInfo}</div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content All Detail Tab */}
                    {(activeDetailTab[transaction.id] || 'action') === 'detail' && (
                      <div className="space-y-3 text-sm">
                        {transaction.details.transcript && (
                          <div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">Call Transcript</div>
                            <div className="text-xs bg-white dark:bg-slate-900 p-4 rounded border border-slate-200 dark:border-slate-700 max-h-96 overflow-y-auto">
                              {formatTranscript(transaction.details.transcript)}
                            </div>
                          </div>
                        )}

                        {transaction.details.rawResponse && (
                          <div>
                            <div className="text-xs text-slate-400 mb-1">Raw API Response</div>
                            <div className="text-xs text-green-400 font-mono bg-slate-900 dark:bg-slate-950 p-3 rounded border border-slate-700 overflow-x-auto">{transaction.details.rawResponse}</div>
                          </div>
                        )}

                        {!transaction.details.transcript && !transaction.details.rawResponse && (
                          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                            No detailed content available
                          </div>
                        )}
                      </div>
                    )}

                    {/* Call History Tab */}
                    {(activeDetailTab[transaction.id] || 'action') === 'callHistory' && transaction.callHistory && (
                      <div className="space-y-4">
                        {/* Call Transcript */}
                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">Call Transcript</div>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 max-h-96 overflow-y-auto space-y-2">
                          {transaction.callHistory.filter(c => c.speaker !== 'System').map((comm, idx) => {
                            const isAI = comm.speaker === 'AI';
                            const highlightedMessage = comm.message.replace(
                              /([A-Z]{3,}-[0-9]+|[A-Z]{2,}-[0-9]+|D[0-9]{4}|(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}|[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}|\$[0-9,]+(?:\.\d{2})?|[0-9]+%|(?:every\s+)?(?:once|twice|[0-9]+\s+times)\s+(?:per|every|a)\s+\w+|days?|months?|years?|January|February|March|April|May|June|July|August|September|October|November|December)/gi,
                              '<span class="text-blue-600 dark:text-blue-400 font-semibold">$&</span>'
                            );

                            return (
                              <div key={idx} className="mb-2">
                                <span className={`font-bold ${isAI ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}>
                                  {isAI ? 'AI Agent:' : 'Insurance Rep:'}
                                </span>
                                <span className="text-slate-700 dark:text-slate-300 ml-1" dangerouslySetInnerHTML={{ __html: highlightedMessage }} />
                              </div>
                            );
                          })}
                        </div>

                        {/* Verified Fields Section */}
                        {transaction.dataVerified.length > 0 && (
                          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">Verified Fields ({transaction.dataVerified.length})</div>
                            <div className="flex flex-wrap gap-2">
                              {transaction.dataVerified.map((field, idx) => (
                                <span key={idx} className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded text-xs font-medium">
                                  ✓ {field}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            ))
          )}
        </div>
      </div>

      {/* Fax Document Request Modal */}
      {faxRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-100 dark:bg-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Insurance Fax Document - 3 Step Analysis</h2>
              <button
                onClick={() => setFaxRequest(null)}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Progress Indicator */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center gap-4">
                <div className={`flex-1 p-3 rounded text-center text-xs font-medium transition-all ${
                  ['step1', 'step2', 'step3', 'completed'].includes(faxRequest.status)
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}>
                  Step 1: Document Image
                </div>
                <div className="w-8 h-0.5 bg-slate-300 dark:bg-slate-700"></div>
                <div className={`flex-1 p-3 rounded text-center text-xs font-medium transition-all ${
                  ['step2', 'step3', 'completed'].includes(faxRequest.status)
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}>
                  Step 2: Data Analysis
                </div>
                <div className="w-8 h-0.5 bg-slate-300 dark:bg-slate-700"></div>
                <div className={`flex-1 p-3 rounded text-center text-xs font-medium transition-all ${
                  ['step3', 'completed'].includes(faxRequest.status)
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}>
                  Step 3: Code Analysis
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Step 1: Document Image */}
              {faxRequest.status === 'step1' && faxRequest.document && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-600 dark:text-green-400">check_circle</span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Step 1: Document Retrieved</h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">Fax document from insurance provider received successfully</p>

                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded border border-slate-200 dark:border-slate-700">
                    <img src={faxRequest.document.image} alt="Insurance Fax Document" className="w-full rounded border border-slate-200 dark:border-slate-600" />
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-3">
                    <p className="text-xs text-blue-700 dark:text-blue-400"><strong>File:</strong> {faxRequest.document.name}</p>
                    <p className="text-xs text-blue-700 dark:text-blue-400 mt-1"><strong>Status:</strong> Document image loaded and ready for analysis</p>
                  </div>
                </div>
              )}

              {/* Step 2: Data Analysis */}
              {faxRequest.status === 'step2' && faxRequest.analysis && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-600 dark:text-green-400">check_circle</span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Step 2: Document Analysis Complete</h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">AI extracted and analyzed all data fields from the fax document</p>

                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded border border-slate-200 dark:border-slate-700">
                    <div className="mb-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Overall Confidence Score: <span className="font-bold text-lg text-green-600 dark:text-green-400">{faxRequest.analysis.confidence}%</span></p>
                    </div>
                    <div className="space-y-2">
                      {faxRequest.analysis.fields.map((field, idx) => (
                        <div key={idx} className="flex items-start justify-between text-xs gap-2 pb-2 border-b border-slate-200 dark:border-slate-700 last:border-b-0">
                          <div className="flex-1">
                            <p className="font-medium text-slate-900 dark:text-white">{field.name}</p>
                            <p className="text-slate-600 dark:text-slate-400">{field.value}</p>
                          </div>
                          <div className="flex items-center gap-1 whitespace-nowrap">
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${
                              field.confidence >= 95 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                              field.confidence >= 90 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                              'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                            }`}>
                              {field.confidence}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Code Analysis */}
              {faxRequest.status === 'step3' && faxRequest.codeAnalysis && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-600 dark:text-green-400">check_circle</span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Step 3: Code Analysis Complete</h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">Technical analysis and validation of extracted data</p>

                  <div className="bg-slate-900 text-slate-100 p-4 rounded border border-slate-700 font-mono text-xs overflow-x-auto">
                    <pre>{faxRequest.codeAnalysis}</pre>
                  </div>
                </div>
              )}

              {/* Completed */}
              {faxRequest.status === 'completed' && (
                <div className="space-y-4 text-center py-6">
                  <div className="flex justify-center">
                    <span className="material-symbols-outlined text-5xl text-green-600 dark:text-green-400">check_circle</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Analysis Complete</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">All 3 steps have been successfully processed. The fax document has been analyzed and validated.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-slate-50 dark:bg-slate-800 px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex gap-3 justify-end">
              {faxRequest.status === 'step1' && (
                <button
                  onClick={() => processFaxStep('step2')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
                >
                  Analyze Document Data
                </button>
              )}
              {faxRequest.status === 'step2' && (
                <button
                  onClick={() => processFaxStep('step3')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
                >
                  Run Code Analysis
                </button>
              )}
              {faxRequest.status === 'step3' && (
                <button
                  onClick={() => processFaxStep('completed')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
                >
                  Complete
                </button>
              )}
              <button
                onClick={() => setFaxRequest(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white text-xs font-medium rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartAITransactionHistory;
