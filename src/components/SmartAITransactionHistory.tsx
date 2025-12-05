import React, { useState, useEffect, useRef } from 'react';
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

type FaxStep = 'idle' | 'step1' | 'step2' | 'step3' | 'completed';
type StepStatus = 'pending' | 'in_progress' | 'completed';

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

  // Fax modal states
  const [currentFaxStep, setCurrentFaxStep] = useState<FaxStep>('idle');
  const [step1Status, setStep1Status] = useState<StepStatus>('pending');
  const [step2Status, setStep2Status] = useState<StepStatus>('pending');
  const [step3Status, setStep3Status] = useState<StepStatus>('pending');
  const [step1Text, setStep1Text] = useState("");
  const [step2Text, setStep2Text] = useState("");
  const [step3Text, setStep3Text] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    if (!activeDetailTab[id]) {
      setActiveDetailTab({...activeDetailTab, [id]: 'action'});
    }
  };

  const setDetailTab = (transactionId: string, tab: string) => {
    setActiveDetailTab({...activeDetailTab, [transactionId]: tab});
  };

  // Typing animation effect
  const typeText = (
    fullText: string,
    setText: (text: string) => void,
    speed: number = 15
  ): Promise<void> => {
    return new Promise((resolve) => {
      let index = 0;
      const intervalId = setInterval(() => {
        if (index <= fullText.length) {
          setText(fullText.substring(0, index));
          index++;
        } else {
          clearInterval(intervalId);
          resolve();
        }
      }, speed);
    });
  };

  // Auto-scroll during typing
  useEffect(() => {
    if (step1Status === 'in_progress' && contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [step1Text]);

  useEffect(() => {
    if (step2Status === 'in_progress' && contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [step2Text]);

  useEffect(() => {
    if (step3Status === 'in_progress' && contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [step3Text]);

  // Sample fax data
  const faxData = JSON.stringify({
    "fax_received": "2025-11-28T10:30:00Z",
    "from_carrier": "Cigna Dental Insurance",
    "patient_name": "Sarah Johnson",
    "member_id": "CIG-4567890",
    "policy": "Cigna Dental PPO - Individual",
    "effective_date": "2025-01-01",
    "status": "ACTIVE",
    "benefits": {
      "preventive": "100% (2 cleanings, 2 exams annually)",
      "basic": "80% (after $50 deductible)",
      "major": "50% (after deductible)",
      "annual_maximum": "$2,000 per year",
      "annual_remaining": "$2,000"
    },
    "coverage_codes": {
      "D0120": "Periodic oral evaluation",
      "D0210": "Complete intraoral - full mouth radiographic images",
      "D1110": "Prophylaxis - adult",
      "D2140": "Amalgam - one surface, primary",
      "D2391": "Resin-based composite - one surface, posterior"
    }
  }, null, 2);

  const insuranceDataAnalysis = `INSURANCE FAX ANALYSIS - DETAILED BREAKDOWN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Patient Information
──────────────────
Name: Sarah Johnson
Member ID: CIG-4567890
DOB: 03/15/1992
Group: Individual Plan
Status: VERIFIED - Active Coverage

Policy Details
──────────────
Carrier: Cigna Dental Insurance
Plan: Dental PPO
Effective Date: 01/01/2025
Expiration: 12/31/2025
Network: Cigna DPO Network (In-Network)

Coverage Structure
──────────────────
Preventive Services:        100% Coverage
  • 2 Cleanings/Year
  • 2 Exams/Year
  • X-rays (Periodic)
  • Fluoride (Limited Age)

Basic Services:              80% Coverage
  • Fillings
  • Root Scaling & Planing
  • Simple Extractions
  • Requires: $50 Deductible

Major Services:              50% Coverage
  • Crowns (12-month wait)
  • Bridges
  • Dentures
  • Root Canals
  • Requires: Deductible + Major Wait

Deductible Status
──────────────────
Individual Deductible: $50 (Not Yet Met)
Family Deductible: $100 (Not Yet Met)

Annual Maximum Benefit
──────────────────────
Total Benefit: $2,000 per calendar year
Currently Used: $0
Remaining: $2,000 (100%)

Waiting Periods
──────────────
Preventive: None (Immediately Available)
Basic: None (Immediately Available)
Major: 12 Months (from Effective Date)

Important Notes
──────────────
✓ Member is eligible for coverage
✓ No claim limitations for preventive care
✓ Prior authorization required for major services
✓ Dependent coverage available upon request`;

  const codeAnalysisData = `{
  "fax_extraction": {
    "status": "SUCCESS",
    "confidence": 98.2,
    "fields_detected": 12,
    "fields_extracted": 12,
    "extraction_time_ms": 245
  },
  "data_validation": {
    "member_id_format": "VALID",
    "plan_code": "CIGNA_DENTAL_PPO",
    "effective_date": "2025-01-01",
    "expiration_date": "2025-12-31",
    "coverage_percentages": [100, 80, 50],
    "data_completeness": "COMPLETE",
    "validation_status": "PASSED"
  },
  "compliance_check": {
    "hipaa_compliant": true,
    "required_fields_present": true,
    "signature_verified": true,
    "document_integrity": "VERIFIED"
  },
  "coverage_analysis": {
    "preventive_available": true,
    "basic_available": true,
    "major_available_after_wait": true,
    "deductible_requirement": "$50",
    "annual_max": "$2000"
  },
  "processing_metadata": {
    "processing_time_ms": 512,
    "timestamp": "2025-11-28T10:30:45.123Z",
    "version": "2.1.0",
    "processor": "FaxAI_v2"
  }
}`;

  // Start fax verification process
  const startFaxVerification = async () => {
    setCurrentFaxStep('step1');
    setStep1Status('in_progress');
    await new Promise(resolve => setTimeout(resolve, 100));
    await typeText(faxData, setStep1Text, 15);
    await new Promise(resolve => setTimeout(resolve, 50));
    setStep1Status('completed');

    // Step 2: Analysis
    await new Promise(resolve => setTimeout(resolve, 150));
    setCurrentFaxStep('step2');
    setStep2Status('in_progress');
    await new Promise(resolve => setTimeout(resolve, 100));
    await typeText(insuranceDataAnalysis, setStep2Text, 5);
    await new Promise(resolve => setTimeout(resolve, 50));
    setStep2Status('completed');

    // Step 3: Code Analysis
    await new Promise(resolve => setTimeout(resolve, 150));
    setCurrentFaxStep('step3');
    setStep3Status('in_progress');
    await new Promise(resolve => setTimeout(resolve, 100));
    await typeText(codeAnalysisData, setStep3Text, 10);
    await new Promise(resolve => setTimeout(resolve, 50));
    setStep3Status('completed');
  };

  // Open fax modal handler
  const handleRequestFaxDocument = () => {
    setCurrentFaxStep('idle');
    setStep1Status('pending');
    setStep2Status('pending');
    setStep3Status('pending');
    setStep1Text('');
    setStep2Text('');
    setStep3Text('');

    setTimeout(() => {
      startFaxVerification();
    }, 500);
  };

  // Reset fax modal
  const resetFaxModal = () => {
    setCurrentFaxStep('idle');
    setStep1Status('pending');
    setStep2Status('pending');
    setStep3Status('pending');
    setStep1Text('');
    setStep2Text('');
    setStep3Text('');
  };

  // Expose fax modal function globally
  useEffect(() => {
    window.openFaxModal = () => {
      handleRequestFaxDocument();
    };
    return () => {
      delete window.openFaxModal;
    };
  }, []);

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
                      onClick={() => handleRequestFaxDocument()}
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

      {/* Fax Document Request Modal - 2 Step Process */}
      {currentFaxStep !== 'idle' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">
                  description
                </span>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Insurance Fax Verification
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Sarah Johnson
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  resetFaxModal();
                  setCurrentFaxStep('idle');
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            {/* Progress Steps */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center justify-center">
                {/* Step 1 */}
                <div className="flex items-center gap-2 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    step1Status === 'completed'
                      ? 'bg-green-500 text-white'
                      : step1Status === 'in_progress'
                      ? 'bg-blue-500 text-white animate-pulse'
                      : 'bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-400'
                  }`}>
                    {step1Status === 'completed' ? '✓' : '1'}
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-slate-900 dark:text-white">Fax Document</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">JSON Data</div>
                  </div>
                </div>

                <div className={`h-0.5 flex-1 mx-2 ${
                  step1Status === 'completed' ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}></div>

                {/* Step 2 */}
                <div className="flex items-center gap-2 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    step2Status === 'completed'
                      ? 'bg-green-500 text-white'
                      : step2Status === 'in_progress'
                      ? 'bg-blue-500 text-white animate-pulse'
                      : 'bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-400'
                  }`}>
                    {step2Status === 'completed' ? '✓' : '2'}
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-slate-900 dark:text-white">Analysis</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Coverage Details</div>
                  </div>
                </div>

                <div className={`h-0.5 flex-1 mx-2 ${
                  step2Status === 'completed' ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}></div>

                {/* Step 3 */}
                <div className="flex items-center gap-2 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    step3Status === 'completed'
                      ? 'bg-green-500 text-white'
                      : step3Status === 'in_progress'
                      ? 'bg-blue-500 text-white animate-pulse'
                      : 'bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-400'
                  }`}>
                    {step3Status === 'completed' ? '✓' : '3'}
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-slate-900 dark:text-white">Code Analysis</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Validation</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div ref={contentRef} className="flex-1 overflow-y-auto p-6">
              {/* Step 1: Fax Data */}
              {step1Status !== 'pending' && (
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-600 dark:text-green-400">check_circle</span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Step 1: Fax Document Retrieved</h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">Fax received from insurance carrier</p>

                  <div className="bg-slate-900 text-slate-100 p-4 rounded border border-slate-700 font-mono text-xs overflow-x-auto">
                    <pre>{step1Text}</pre>
                  </div>
                </div>
              )}

              {/* Step 2: Analysis */}
              {step2Status !== 'pending' && (
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-600 dark:text-green-400">check_circle</span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Step 2: Insurance Analysis</h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">Extracted and analyzed coverage details</p>

                  <div className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-4 rounded border border-slate-200 dark:border-slate-700 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                    {step2Text}
                  </div>
                </div>
              )}

              {/* Step 3: Code Analysis */}
              {step3Status !== 'pending' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-600 dark:text-green-400">check_circle</span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Step 3: Code Analysis</h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">Technical validation and compliance verification</p>

                  <div className="bg-slate-900 text-slate-100 p-4 rounded border border-slate-700 font-mono text-xs overflow-x-auto">
                    <pre>{step3Text}</pre>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-slate-50 dark:bg-slate-800 px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex gap-3 justify-end">
              <button
                onClick={() => {
                  resetFaxModal();
                  setCurrentFaxStep('idle');
                }}
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
