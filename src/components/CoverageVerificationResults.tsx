import React, { useState, useEffect, useRef } from "react";

interface CoverageVerificationResultsProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
}

type Step = 'step1' | 'step2' | 'idle';
type StepStatus = 'pending' | 'in_progress' | 'completed';

const CoverageVerificationResults: React.FC<CoverageVerificationResultsProps> = ({
  isOpen,
  onClose,
  patientName = "Christopher James Davis"
}) => {
  const [currentStep, setCurrentStep] = useState<Step>('idle');
  const [step1Status, setStep1Status] = useState<StepStatus>('pending');
  const [step2Status, setStep2Status] = useState<StepStatus>('pending');

  const [step1Text, setStep1Text] = useState("");
  const [step2Text, setStep2Text] = useState("");

  // Refs for auto-scrolling
  const contentRef = useRef<HTMLDivElement>(null);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);

  // Sample API JSON response
  const apiResponse = JSON.stringify({
    "verification_id": "VER-2025-001234",
    "timestamp": "2025-01-21T10:30:45Z",
    "patient": {
      "name": "Christopher James Davis",
      "dob": "1985-03-15",
      "member_id": "BCBS123456789"
    },
    "insurance": {
      "carrier": "Blue Cross Blue Shield",
      "group_number": "GRP987654",
      "policy_status": "active",
      "effective_date": "2024-01-01",
      "plan_type": "PPO Premium"
    },
    "eligibility": {
      "active": true,
      "coverage_status": "verified",
      "verification_date": "2025-01-21"
    },
    "benefits": {
      "annual_maximum": 2000,
      "annual_used": 450,
      "annual_remaining": 1550,
      "deductible": 50,
      "deductible_met": 50,
      "preventive_coverage": "100%",
      "basic_coverage": "80%",
      "major_coverage": "50%",
      "waiting_periods": {
        "preventive": "none",
        "basic": "none",
        "major": "12 months"
      }
    }
  }, null, 2);

  // Sample code-level coverage data
  const codeLevelData = `COVERAGE BY CODE VIEW - DETAILED ANALYSIS

Preventive Services (100% Coverage):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
D0120  Periodic Oral Evaluation           $45.00    $0.00     ✓ Covered 2x/year
D0210  Complete Series X-rays             $125.00   $0.00     ✓ Once per 3 years
D0274  Bitewing X-rays (4 films)          $65.00    $0.00     ✓ Covered 2x/year
D1110  Prophylaxis - Adult                $95.00    $0.00     ✓ Covered 2x/year
D1206  Fluoride Varnish                   $40.00    $0.00     ✓ No age limit
D1351  Sealant - per tooth                $55.00    $0.00     ✓ Under age 16

Basic Restorative Services (80% Coverage):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
D2140  Amalgam - 1 surface                $150.00   $30.00    ✓ No waiting period
D2150  Amalgam - 2 surfaces               $185.00   $37.00    ✓ No waiting period
D2391  Composite - 1 surface posterior    $175.00   $35.00    ✓ No waiting period
D2392  Composite - 2 surfaces posterior   $215.00   $43.00    ✓ No waiting period
D7140  Simple Extraction                  $195.00   $39.00    ✓ No limitations

Major Services (50% Coverage):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
D2750  Crown - Porcelain fused to metal   $1,100.00 $550.00   ⚠ 12-month wait
D2751  Crown - Porcelain                  $1,200.00 $600.00   ⚠ 12-month wait
D2790  Crown - Full cast metal            $950.00   $475.00   ⚠ 12-month wait
D6010  Surgical placement of implant      $2,100.00 $1,050.00 ⚠ Not covered
D6240  Crown over implant                 $1,500.00 $750.00   ⚠ Not covered

Periodontal Services (80% Coverage):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
D4341  Scaling & root planing (per quad)  $275.00   $55.00    ✓ 1x per 24 months
D4910  Periodontal maintenance            $125.00   $25.00    ✓ 4x per year

ANNUAL BENEFIT STATUS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Maximum Benefit:        $2,000.00
Used to Date:           $450.00
Remaining:              $1,550.00
Deductible:             $50.00 (Met)
Plan Renewal:           January 1st`;

  // Auto-scroll to active step
  const scrollToStep = (stepRef: React.RefObject<HTMLDivElement>) => {
    if (stepRef.current && contentRef.current) {
      const stepElement = stepRef.current;
      const contentElement = contentRef.current;

      // Scroll to the step with some offset for better visibility
      const elementTop = stepElement.offsetTop;
      const offset = 20; // Small offset from top

      contentElement.scrollTo({
        top: elementTop - offset,
        behavior: 'smooth'
      });
    }
  };

  // Auto-scroll when current step changes
  useEffect(() => {
    if (currentStep === 'step1' && step1Status === 'in_progress') {
      scrollToStep(step1Ref);
    } else if (currentStep === 'step2' && step2Status === 'in_progress') {
      scrollToStep(step2Ref);
    }
  }, [currentStep, step1Status, step2Status]);

  // Auto-scroll during typing to keep cursor visible
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

  // Typing animation effect
  const typeText = (
    fullText: string,
    setText: (text: string) => void,
    speed: number = 10
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

  // Start verification process
  useEffect(() => {
    if (isOpen && currentStep === 'idle') {
      // Auto-start after a brief delay
      setTimeout(() => {
        startVerification();
      }, 500);
    }
  }, [isOpen]);

  const startVerification = async () => {
    // Step 1: Get API Result
    setCurrentStep('step1');
    setStep1Status('in_progress');
    await new Promise(resolve => setTimeout(resolve, 800));
    await typeText(apiResponse, setStep1Text, 5);
    await new Promise(resolve => setTimeout(resolve, 500));
    setStep1Status('completed');

    // Step 2: Analyze and convert to code-level
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentStep('step2');
    setStep2Status('in_progress');
    await new Promise(resolve => setTimeout(resolve, 800));
    await typeText(codeLevelData, setStep2Text, 3);
    await new Promise(resolve => setTimeout(resolve, 500));
    setStep2Status('completed');
  };

  const resetModal = () => {
    setCurrentStep('idle');
    setStep1Status('pending');
    setStep2Status('pending');
    setStep1Text("");
    setStep2Text("");
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetModal, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">
              verified_user
            </span>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Coverage Verification Results
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {patientName}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center justify-center max-w-2xl mx-auto">
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
                <div className="font-medium text-slate-900 dark:text-white">API Response</div>
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
                <div className="font-medium text-slate-900 dark:text-white">Code Analysis</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Coverage Codes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto px-6 py-6">
          {/* Step 1: API JSON Response */}
          {(currentStep === 'step1' || step1Status === 'completed') && (
            <div ref={step1Ref} className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">
                    api
                  </span>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Step 1: API Response
                  </h3>
                </div>
                {step1Status === 'completed' && (
                  <span className="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    Completed
                  </span>
                )}
                {step1Status === 'in_progress' && (
                  <span className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                    <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                    Processing...
                  </span>
                )}
              </div>
              <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-green-400 whitespace-pre">{step1Text}</pre>
                {step1Status === 'in_progress' && (
                  <span className="inline-block w-2 h-4 bg-green-400 animate-pulse ml-1"></span>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Code-level Coverage Analysis */}
          {(currentStep === 'step2' || step2Status === 'completed') && (
            <div ref={step2Ref} className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">
                    analytics
                  </span>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Step 2: Coverage by Code Analysis
                  </h3>
                </div>
                {step2Status === 'completed' && (
                  <span className="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    Completed
                  </span>
                )}
                {step2Status === 'in_progress' && (
                  <span className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                    <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                    Analyzing...
                  </span>
                )}
              </div>
              <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-cyan-400 whitespace-pre">{step2Text}</pre>
                {step2Status === 'in_progress' && (
                  <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-1"></span>
                )}
              </div>
            </div>
          )}

          {/* All Steps Completed Message */}
          {step2Status === 'completed' && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-3xl">
                task_alt
              </span>
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-200">
                  Verification Complete!
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  All coverage information has been successfully processed and formatted.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-800">
          {step2Status === 'completed' && (
            <>
              <button
                onClick={resetModal}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Run Again
              </button>
              <button
                onClick={handleClose}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Close
              </button>
            </>
          )}
          {step2Status !== 'completed' && (
            <button
              onClick={handleClose}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoverageVerificationResults;
