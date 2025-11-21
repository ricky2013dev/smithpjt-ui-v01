import React, { useState } from 'react';

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
  details: {
    eligibilityCheck?: string;
    benefitsVerification?: string;
    coverageDetails?: string;
    deductibleInfo?: string;
    transcript?: string;
    rawResponse?: string;
  };
}

const mockData: Transaction[] = [
  {
    id: '3',
    requestId: 'REQ-2025-11-21-0755',
    type: 'API',
    method: 'POST /api/benefits/query',
    startTime: '2025-11-21 07:55:08',
    endTime: '2025-11-21 07:55:31',
    duration: '23s',
    status: 'PARTIAL',
    patientId: 'P003',
    patientName: 'Jennifer Martinez',
    insuranceProvider: 'Cigna Dental',
    insuranceRep: 'System',
    runBy: 'Dr. Smith',
    dataVerified: ['Eligibility', 'Active Coverage'],
    verificationScore: 65,
    responseCode: '206',
    endpoint: 'https://api.cigna.com/dental/benefits',
    errorMessage: 'Partial response: Deductible information not available',
    details: {
      eligibilityCheck: 'ACTIVE - Policy effective through 06/30/2026',
      benefitsVerification: 'Preventive: 100%, Basic: 70%, Major: 50%',
      coverageDetails: 'Annual Maximum: $1,800 | Used: $320 | Remaining: $1,480',
      deductibleInfo: 'ERROR: Deductible data unavailable from API response',
      rawResponse: '{"status":"active","coverage":{"preventive":"100%","basic":"70%","major":"50%"},"annual_max":1800,"annual_used":320,"deductible":null,"error":"deductible_unavailable"}'
    }
  },

  {
    id: '4',
    requestId: 'REQ-2025-11-21-0742',
    type: 'CALL',
    method: 'VOICE /ai-agent/verify',
    startTime: '2025-11-21 07:42:18',
    endTime: '2025-11-21 08:04:55',
    duration: '22m 37s',
    status: 'SUCCESS',
    patientId: 'P004',
    patientName: 'David Anderson',
    insuranceProvider: 'Cigna Dental',
    insuranceRep: 'Sarah Mitchell',
    runBy: 'Dr. Smith',
    dataVerified: ['Eligibility', 'Benefits', 'Coverage Limits', 'Waiting Periods', 'Frequency Limits'],
    verificationScore: 70,
    phoneNumber: '1-800-555-0142',
    details: {
      transcript: 'AI Agent: "Good morning, this is the Smith Dental automated verification system. I need to verify dental insurance benefits for patient David Anderson."\n\nInsurance Rep: "Good morning, this is MetLife Dental. I can help you with that. What\'s the member ID?"\n\nAI Agent: "The member ID is MET-2034567. Patient David Anderson, date of birth July 22, 1978."\n\nInsurance Rep: "Thank you, pulling up the account now... Okay, I have David Anderson in the system. What do you need to verify?"\n\nAI Agent: "We need a comprehensive benefits verification. Can we start with the policy status and effective dates?"\n\nInsurance Rep: "The policy is active. Effective dates are January 1, 2025 through December 31, 2025."\n\nAI Agent: "What is the annual maximum benefit?"\n\nInsurance Rep: "The annual maximum is $2,500 per calendar year."\n\nAI Agent: "How much has been used so far this year?"\n\nInsurance Rep: "As of today, $875 has been used, leaving $1,625 remaining."\n\nAI Agent: "What was that $875 used for?"\n\nInsurance Rep: "Let me check the claims history... There were two claims. First was D1110 prophylaxis on March 15, 2025 for $125, and D2391 resin-based composite on April 3, 2025 for $750."\n\nAI Agent: "Thank you. What is the deductible on this plan?"\n\nInsurance Rep: "There\'s a $75 individual deductible per calendar year, and a $225 family deductible."\n\nAI Agent: "How much of the deductible has been met?"\n\nInsurance Rep: "The individual deductible of $75 has been fully met. The family has met $150 of the $225 family deductible."\n\nAI Agent: "What are the coverage percentages?"\n\nInsurance Rep: "Preventive services are covered at 100% with no deductible. Basic services are 80% after deductible. Major services are 50% after deductible. Orthodontic services are also 50% with a lifetime maximum of $2,000."\n\nAI Agent: "Are there any waiting periods?"\n\nInsurance Rep: "No waiting periods on this policy. All services are available immediately."\n\nAI Agent: "What about frequency limitations for routine services?"\n\nInsurance Rep: "D1110 prophylaxis is covered twice per calendar year. The patient has used one so far, so one more is available. D0150 comprehensive exam is once every three years. D0274 bitewing X-rays are once per calendar year. D0210 complete series X-rays are once every three years."\n\nAI Agent: "We\'re planning some periodontal treatment. What\'s the coverage for D4341 periodontal scaling and root planing?"\n\nInsurance Rep: "D4341 is classified as Basic, so it\'s covered at 80% after deductible. Since the deductible is already met, the patient would get 80% coverage."\n\nAI Agent: "Is there a frequency limit on scaling and root planing?"\n\nInsurance Rep: "Yes, it\'s limited to once per quadrant every 24 months."\n\nAI Agent: "What about D4910 periodontal maintenance?"\n\nInsurance Rep: "Periodontal maintenance is also covered at 80% as a Basic procedure. It\'s limited to four times per calendar year, but only after active periodontal treatment has been completed."\n\nAI Agent: "Can you clarify the rule about alternating with prophylaxis?"\n\nInsurance Rep: "Yes, D4910 periodontal maintenance can be alternated with D1110 prophylaxis for a total of four cleanings per year after periodontal therapy. For example, two D4910 and two D1110, or any combination up to four total."\n\nAI Agent: "That\'s very helpful. What about major restorative work? If we need to do crowns or bridges?"\n\nInsurance Rep: "Crowns and bridges are covered at 50% after deductible as Major services. There\'s a replacement rule - once every five years per tooth."\n\nAI Agent: "Does this require pre-authorization?"\n\nInsurance Rep: "Pre-authorization is not required but is strongly recommended for any treatment over $500 to avoid surprises."\n\nAI Agent: "What about implants?"\n\nInsurance Rep: "Implants are not covered under this plan. However, if an implant is placed, the crown that goes on top of the implant code D6058 or D6059 may be covered at 50% as a Major service."\n\nAI Agent: "Is there a missing tooth clause?"\n\nInsurance Rep: "Yes, teeth that were missing before the effective date of coverage are not eligible for replacement."\n\nAI Agent: "When did this patient\'s coverage begin?"\n\nInsurance Rep: "The original effective date was January 1, 2023."\n\nAI Agent: "Let me summarize: Policy MET-2034567 for David Anderson is active through December 31, 2025. Annual maximum $2,500 with $1,625 remaining. Individual deductible $75 fully met. Preventive 100%, Basic 80%, Major 50%, Ortho 50% with $2,000 lifetime max. Frequency limits apply. Scaling and root planing once per quadrant per 24 months. Periodontal maintenance alternates with prophylaxis up to four per year. Pre-authorization recommended for treatment over $500. Is that all correct?"\n\nInsurance Rep: "Yes, that\'s exactly right. Very thorough summary."\n\nAI Agent: "Perfect. Thank you for your help today."\n\nInsurance Rep: "You\'re welcome. Have a great day."\n\nOutcome: Complete verification successful for David Anderson policy MET-2034567. Annual maximum $2,500 with $1,625 remaining after $875 in claims. Individual deductible $75 fully met. One prophylaxis remaining this year. Periodontal treatment D4341 scaling and root planing covered at 80%, limited to once per quadrant per 24 months. D4910 periodontal maintenance covered at 80%, up to four times per year alternating with regular prophylaxis. Major services like crowns covered at 50% with pre-authorization recommended for treatment over $500.',
      benefitsVerification: 'Preventive: 100%, Basic: 80%, Major: 50%, Ortho: 50% (lifetime max $2,000)',
      coverageDetails: 'Annual Maximum: $2,500 | Used: $875 | Remaining: $1,625',
      deductibleInfo: 'Individual Deductible: $75 | Met: $75 | Family Deductible: $225 | Met: $150'
    }
  },
    {
    id: '1',
    requestId: 'REQ-2025-11-21-0823',
    type: 'CALL',
    method: 'VOICE /ai-agent/verify',
    startTime: '2025-11-21 08:23:15',
    endTime: '2025-11-21 08:38:42',
    duration: '15m 27s',
    status: 'SUCCESS',
    patientId: 'P002',
    patientName: 'Michael Chen',
    insuranceProvider: 'Cigna Dental',
    insuranceRep: 'Amanda Rodriguez',
    runBy: 'Dr. Smith',
    dataVerified: ['Eligibility', 'Benefits', 'Pre-Auth', 'Coverage Limits'],
    verificationScore: 100,
    phoneNumber: '1-800-555-0199',
    details: {
      transcript: 'AI Agent: "Hello, good morning. This is the automated verification system calling from Smith Dental Practice. I\'m calling to verify dental insurance benefits for one of our patients. May I speak with someone who can assist with benefits verification?"\n\nInsurance Rep: "Good morning. Yes, this is Amanda from Aetna Dental Benefits Department. I can help you with that. What\'s the member\'s information?"\n\nAI Agent: "Thank you, Amanda. The patient\'s name is Michael Chen, date of birth is March 15, 1985. The subscriber is also Michael Chen."\n\nInsurance Rep: "Okay, let me pull up that account. Can you provide the policy number or member ID?"\n\nAI Agent: "Yes, the policy number is AET-9876543."\n\nInsurance Rep: "Perfect, I have the account pulled up now. I can see Michael Chen, policy number AET-9876543. The policy is active and in good standing. What specific information do you need today?"\n\nAI Agent: "Great, thank you. We need to verify several items. First, can you confirm the policy effective dates?"\n\nInsurance Rep: "Yes, the policy is effective from January 1, 2024 through December 31, 2025. It\'s a calendar year policy."\n\nAI Agent: "Excellent. Can you confirm the annual maximum benefit?"\n\nInsurance Rep: "The annual maximum is $1,500 per calendar year."\n\nAI Agent: "And how much of that annual maximum has been used so far this year?"\n\nInsurance Rep: "Let me check... As of today, November 21, 2025, zero dollars have been used. The full $1,500 is still available."\n\nAI Agent: "Perfect. Now, what is the individual deductible amount?"\n\nInsurance Rep: "The individual deductible is $100 per calendar year."\n\nAI Agent: "Has any of that deductible been met this year?"\n\nInsurance Rep: "No, the deductible has not been met. The full $100 deductible still applies."\n\nAI Agent: "Understood. Does the deductible apply to all service categories?"\n\nInsurance Rep: "No, the deductible applies to Basic and Major services only. Preventive services are covered at 100% with no deductible."\n\nAI Agent: "Excellent. Can you provide the coverage percentages for each service category?"\n\nInsurance Rep: "Absolutely. For Preventive services, the coverage is 100%. For Basic services, it\'s 80% after the deductible. For Major services, it\'s 50% after the deductible."\n\nAI Agent: "Thank you. We have several specific procedures we need to verify. Let me start with procedure code D0150, which is a comprehensive oral evaluation."\n\nInsurance Rep: "D0150 is classified as a Preventive service, so it\'s covered at 100% with no deductible. However, let me check the frequency limitations... This procedure is limited to once every three years."\n\nAI Agent: "When was the last time this patient had a D0150?"\n\nInsurance Rep: "Looking at the claims history... The last D0150 was processed on February 10, 2023, so the patient is eligible for another comprehensive evaluation now."\n\nAI Agent: "Perfect. Next procedure is D1110, which is a prophylaxis - adult cleaning."\n\nInsurance Rep: "D1110 is also a Preventive service, covered at 100% with no deductible. The frequency limit is two times per calendar year."\n\nAI Agent: "Has the patient used any of those cleanings this year?"\n\nInsurance Rep: "No, there are no D1110 claims for 2025 yet. Both cleanings are still available."\n\nAI Agent: "Excellent. Now for the more significant procedure - D2740, which is a crown - porcelain/ceramic substrate."\n\nInsurance Rep: "Okay, D2740 is classified as a Major service. This would be covered at 50% after the deductible is met."\n\nAI Agent: "Does this procedure require pre-authorization?"\n\nInsurance Rep: "Yes, all Major procedures over $300 require pre-authorization. For D2740, you\'ll definitely need to submit a pre-authorization request."\n\nAI Agent: "Understood. What information do we need to provide for the pre-authorization?"\n\nInsurance Rep: "You\'ll need to submit the pre-authorization form with the patient\'s information, the specific tooth number, the reason for the crown, and any supporting documentation like X-rays or clinical notes. We typically need to see evidence of significant decay, fracture, or other clinical necessity."\n\nAI Agent: "What\'s the typical turnaround time for pre-authorization decisions?"\n\nInsurance Rep: "Standard pre-authorizations are usually processed within 5 to 7 business days. If you mark it as urgent and provide clinical justification, we can sometimes expedite it to 2 to 3 business days."\n\nAI Agent: "That\'s helpful. Is there a specific code or reference number I should use when submitting the pre-authorization?"\n\nInsurance Rep: "Use the member ID AET-9876543 and reference this call. I\'m going to give you a reference number for today\'s benefit verification: BV20251121-0823."\n\nAI Agent: "Thank you. Let me confirm the estimated patient cost for the D2740 crown. If the usual and customary fee is approximately $1,200, what would the patient be responsible for?"\n\nInsurance Rep: "Let me calculate that for you. With a $1,200 fee, and 50% coverage after deductible... The insurance would cover $600, but we need to subtract the $100 deductible first since it hasn\'t been met. So insurance would pay $550, and the patient would be responsible for $650."\n\nAI Agent: "Perfect, that\'s very helpful for treatment planning. Are there any waiting periods on this policy?"\n\nInsurance Rep: "Let me check... No, this policy does not have waiting periods. All services are immediately available."\n\nAI Agent: "Excellent. Are there any missing tooth clauses or limitations we should be aware of?"\n\nInsurance Rep: "Yes, there is a missing tooth clause. If a tooth was missing before the patient enrolled in this policy, replacement of that tooth would not be covered."\n\nAI Agent: "Understood. When did the patient enroll in this policy?"\n\nInsurance Rep: "The original enrollment date was January 1, 2022. So any teeth missing before that date would not be covered for replacement."\n\nAI Agent: "That\'s clear. Are there any other limitations or exclusions we should know about?"\n\nInsurance Rep: "Standard exclusions apply - cosmetic procedures, implants are not covered, and there\'s a replacement rule for crowns and bridges of once every 5 years per tooth."\n\nAI Agent: "Understood. What about orthodontic coverage?"\n\nInsurance Rep: "This particular plan does not include orthodontic coverage."\n\nAI Agent: "Okay. Just to summarize what we\'ve verified today: Policy AET-9876543 for Michael Chen is active through December 31, 2025. Annual maximum is $1,500 with $1,500 remaining. Deductible is $100, not yet met. Preventive services are covered at 100%, Basic at 80% after deductible, Major at 50% after deductible. D0150 and D1110 are both available and covered at 100%. D2740 requires pre-authorization and would be covered at 50% after deductible. Is that all correct?"\n\nInsurance Rep: "Yes, that\'s absolutely correct. You\'ve got all the information accurate."\n\nAI Agent: "Perfect. Is there anything else we should know about this patient\'s coverage?"\n\nInsurance Rep: "No, I think we\'ve covered everything. Make sure to submit that pre-authorization for the crown before proceeding with treatment."\n\nAI Agent: "We will definitely do that. Thank you so much for your help today, Amanda. The reference number again is BV20251121-0823, correct?"\n\nInsurance Rep: "That\'s correct. You\'re very welcome. Have a great day."\n\nAI Agent: "You too. Goodbye."\n\nOutcome: Complete benefits verification successful. All three procedures verified. D0150 comprehensive exam and D1110 prophylaxis are covered at 100% with no limitations for this patient. D2740 crown requires pre-authorization with reference number BV20251121-0823. Patient responsibility for crown estimated at $650 ($1,200 fee minus 50% coverage plus $100 deductible). Annual maximum $1,500 fully available. Pre-authorization must be submitted before proceeding with major treatment.',
      benefitsVerification: 'Preventive: 100%, Basic: 80% after deductible, Major: 50% after deductible',
      coverageDetails: 'Annual Maximum: $1,500 | Used: $0 | Remaining: $1,500',
      deductibleInfo: 'Deductible: $100 | Met: $0 | Remaining: $100'
    }
  },

];

const SmartAITransactionHistory: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'API' | 'CALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'PARTIAL' | 'FAILED'>('ALL');
  const [activeDetailTab, setActiveDetailTab] = useState<{[key: string]: string}>({});

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    if (!activeDetailTab[id]) {
      setActiveDetailTab({...activeDetailTab, [id]: 'action'});
    }
  };

  const setDetailTab = (transactionId: string, tab: string) => {
    setActiveDetailTab({...activeDetailTab, [transactionId]: tab});
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
            <div className="col-span-1 text-center">Type</div>
            <div className="col-span-1 text-center">Status</div>
            <div className="col-span-2">Insurance Provider</div>
            <div className="col-span-2">Insurance Rep</div>
            <div className="col-span-2">Start Time</div>
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
                  <div className={`col-span-1 text-center font-semibold text-xs ${getTypeColor(transaction.type)}`}>
                    {transaction.type}
                  </div>
                  <div className={`col-span-1 text-center font-semibold text-xs ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </div>
                  <div className="col-span-2 text-slate-700 dark:text-slate-300">{transaction.insuranceProvider}</div>
                  <div className="col-span-2 text-slate-600 dark:text-slate-400">{transaction.insuranceRep}</div>
                  <div className="col-span-2">
                    <div className="text-slate-900 dark:text-white">{transaction.startTime}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{transaction.requestId}</div>
                  </div>
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
                <div className="ml-8 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-700">
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
                      Transaction Action Info
                    </button>
                    <button
                      onClick={() => setDetailTab(transaction.id, 'summary')}
                      className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                        (activeDetailTab[transaction.id] || 'action') === 'summary'
                          ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white'
                          : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      Content Summary
                    </button>
                    <button
                      onClick={() => setDetailTab(transaction.id, 'detail')}
                      className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                        (activeDetailTab[transaction.id] || 'action') === 'detail'
                          ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white'
                          : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      Content All Detail
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
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Eligibility Check</div>
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
                  </div>
                </div>
              )}
            </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartAITransactionHistory;
