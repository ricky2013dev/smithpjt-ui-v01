import React, { useState, useEffect, useRef } from 'react';
import { Patient } from '../types/patient';

interface SmithAICenterProps {
  patient: Patient;
  onClose: () => void;
}

interface VerificationDataRow {
  saiCode: string;
  refInsCode: string;
  category: string;
  fieldName: string;
  preStepValue: string;
  missing: string;
  aiCallValue: string;
  verifiedBy: string;
  isUpdating?: boolean;
  isChecking?: boolean;
}

interface ConversationMessage {
  speaker: 'AI Agent' | 'Insurance Rep' | 'System';
  text: string;
  time: string;
  isTyping?: boolean;
}

const SmithAICenter: React.FC<SmithAICenterProps> = ({ patient, onClose }) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      speaker: 'System',
      text: `Hello! I'm Smith AI Assistant. I'm ready to help with insurance verification for ${patient.name.given.join(' ')} ${patient.name.family}. Start Call when you're ready.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [currentTypingMessage, setCurrentTypingMessage] = useState<string>('');
  const [verificationData, setVerificationData] = useState<VerificationDataRow[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const callIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize verification data with missing items
  useEffect(() => {
    const initialData: VerificationDataRow[] = [
      { saiCode: "VF000028", refInsCode: "D028", category: "Preventative Coverage", fieldName: "Prophylaxis/Exam Frequency", preStepValue: "", missing: "Y", aiCallValue: "", verifiedBy: "-" },
      { saiCode: "VF000029", refInsCode: "D029", category: "Preventative Coverage", fieldName: "Last FMS", preStepValue: "", missing: "Y", aiCallValue: "", verifiedBy: "-" },
      { saiCode: "VF000030", refInsCode: "D030", category: "Preventative Coverage", fieldName: "Eligible for FMS Now", preStepValue: "", missing: "Y", aiCallValue: "", verifiedBy: "-" },
      { saiCode: "VF000031", refInsCode: "D031", category: "Preventative Coverage", fieldName: "Eligible for FMS Every (Years)", preStepValue: "", missing: "Y", aiCallValue: "", verifiedBy: "-" },
      { saiCode: "VF000032", refInsCode: "D032", category: "Preventative Coverage", fieldName: "Fluoride Varnish Frequency", preStepValue: "", missing: "Y", aiCallValue: "", verifiedBy: "-" },
      { saiCode: "VF000041", refInsCode: "D041", category: "Basic Coverage", fieldName: "Basic Covered At (%)", preStepValue: "", missing: "Y", aiCallValue: "", verifiedBy: "-" },
      { saiCode: "VF000042", refInsCode: "D042", category: "Basic Coverage", fieldName: "Basic Waiting Period", preStepValue: "", missing: "Y", aiCallValue: "", verifiedBy: "-" },
      { saiCode: "VF000045", refInsCode: "D045", category: "Major Coverage", fieldName: "Major Covered At (%)", preStepValue: "", missing: "Y", aiCallValue: "", verifiedBy: "-" },
      { saiCode: "VF000046", refInsCode: "D046", category: "Major Coverage", fieldName: "Major Waiting Period", preStepValue: "", missing: "Y", aiCallValue: "", verifiedBy: "-" },
      { saiCode: "VF000047", refInsCode: "D047", category: "Major Coverage", fieldName: "Major Effective Date", preStepValue: "", missing: "Y", aiCallValue: "", verifiedBy: "-" },
    ];
    setVerificationData(initialData);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentTypingMessage]);

  const getFullName = () => {
    const given = patient.name.given.join(' ');
    return `${given} ${patient.name.family}`.trim();
  };

  const getPhone = () => {
    return patient.telecom.find(t => t.system === 'phone')?.value || 'N/A';
  };

  const getEmail = () => {
    return patient.telecom.find(t => t.system === 'email')?.value || 'N/A';
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Highlight values in text (numbers, percentages, dates, etc.)
  const highlightValues = (text: string) => {
    // Pattern to match: numbers, percentages, dates, dollar amounts, phone numbers, IDs
    const pattern = /(\d{1,2}\/\d{1,2}\/\d{4}|\d+%|\$\d+|SUB\d+|\d+-month|\d+\s+months?|\d+\s+years?|80%|50%|100%|\d{3}-\d{3}-\d{4}|January|February|March|April|May|June|July|August|September|October|November|December|\d{1,2},?\s*\d{4})/gi;

    const parts = text.split(pattern);
    return parts.map((part, index) => {
      if (pattern.test(part)) {
        return (
          <span key={index} className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-1 rounded font-semibold">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  // Simulate typing effect
  const typeMessage = async (speaker: 'AI Agent' | 'Insurance Rep' | 'System', fullText: string, delay: number = 30) => {
    return new Promise<void>((resolve) => {
      let index = 0;
      const typingInterval = setInterval(() => {
        if (index <= fullText.length) {
          setCurrentTypingMessage(fullText.slice(0, index));
          index++;
        } else {
          clearInterval(typingInterval);
          setCurrentTypingMessage('');
          setMessages(prev => [...prev, {
            speaker,
            text: fullText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
          resolve();
        }
      }, delay);
    });
  };

  // Mark field as currently being checked
  const setFieldChecking = (saiCode: string, isChecking: boolean) => {
    setVerificationData(prev => prev.map(row => {
      if (row.saiCode === saiCode) {
        return { ...row, isChecking };
      }
      return { ...row, isChecking: false }; // Clear checking state from other rows
    }));
  };

  // Update verification data row
  const updateVerificationRow = (saiCode: string, value: string) => {
    setVerificationData(prev => prev.map(row => {
      if (row.saiCode === saiCode) {
        return {
          ...row,
          aiCallValue: value,
          verifiedBy: "CALL",
          missing: "N",
          isUpdating: true,
          isChecking: false
        };
      }
      return row;
    }));

    // Remove updating highlight after a moment
    setTimeout(() => {
      setVerificationData(prev => prev.map(row => {
        if (row.saiCode === saiCode) {
          return { ...row, isUpdating: false };
        }
        return row;
      }));
    }, 1500);
  };

  // Simulate AI conversation
  const simulateAIConversation = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Initial connection
    await typeMessage('System', 'Connecting to Blue Cross Blue Shield...', 40);
    await new Promise(resolve => setTimeout(resolve, 800));
    await typeMessage('System', 'Call connected. Starting verification...', 40);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Conversation 1 - Prophylaxis frequency
    await typeMessage('AI Agent', 'Hello, this is Smith AI calling on behalf of our dental practice. I need to verify insurance benefits for a patient.', 25);
    await new Promise(resolve => setTimeout(resolve, 1200));
    await typeMessage('Insurance Rep', 'Hello! I can help you with that. Please provide the member ID and date of birth.', 25);
    await new Promise(resolve => setTimeout(resolve, 800));
    await typeMessage('AI Agent', 'Member ID is SUB123456789, date of birth is January 15, 1975.', 25);
    await new Promise(resolve => setTimeout(resolve, 1500));
    await typeMessage('Insurance Rep', 'Thank you. I have the member information pulled up. What benefits would you like to verify?', 25);
    await new Promise(resolve => setTimeout(resolve, 800));
    setFieldChecking('VF000028', true);
    await typeMessage('AI Agent', 'Can you confirm the prophylaxis and exam frequency covered under this plan?', 25);
    await new Promise(resolve => setTimeout(resolve, 1200));
    await typeMessage('Insurance Rep', 'Yes, prophylaxis and exams are covered every 6 months under preventative care.', 25);
    updateVerificationRow('VF000028', 'Every 6 months');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Conversation 2 - FMS details
    setFieldChecking('VF000029', true);
    await typeMessage('AI Agent', 'Great. Can you tell me the date of the last full mouth series of x-rays?', 25);
    await new Promise(resolve => setTimeout(resolve, 1200));
    await typeMessage('Insurance Rep', 'Let me check... The last FMS was on March 15, 2023.', 25);
    updateVerificationRow('VF000029', '03/15/2023');
    await new Promise(resolve => setTimeout(resolve, 800));
    setFieldChecking('VF000030', true);
    await typeMessage('AI Agent', 'Is the patient eligible for a full mouth series now?', 25);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await typeMessage('Insurance Rep', 'Yes, they are eligible now since it has been over 3 years.', 25);
    updateVerificationRow('VF000030', 'Yes');
    await new Promise(resolve => setTimeout(resolve, 700));
    updateVerificationRow('VF000031', '3');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Conversation 3 - Fluoride coverage
    setFieldChecking('VF000032', true);
    await typeMessage('AI Agent', 'What about fluoride varnish treatment frequency?', 25);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await typeMessage('Insurance Rep', 'Fluoride varnish is covered every 6 months for patients under 18 years old.', 25);
    updateVerificationRow('VF000032', 'Every 6 months (under 18)');
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Conversation 4 - Basic coverage
    setFieldChecking('VF000041', true);
    await typeMessage('AI Agent', 'Can you confirm the basic services coverage percentage?', 25);
    await new Promise(resolve => setTimeout(resolve, 1200));
    await typeMessage('Insurance Rep', 'Basic services are covered at 80% after the deductible is met.', 25);
    updateVerificationRow('VF000041', '80');
    await new Promise(resolve => setTimeout(resolve, 800));
    setFieldChecking('VF000042', true);
    await typeMessage('AI Agent', 'Is there a waiting period for basic services?', 25);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await typeMessage('Insurance Rep', 'No, there is no waiting period for basic services under this plan.', 25);
    updateVerificationRow('VF000042', 'No');
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Conversation 5 - Major coverage
    setFieldChecking('VF000045', true);
    await typeMessage('AI Agent', 'And what is the coverage percentage for major services?', 25);
    await new Promise(resolve => setTimeout(resolve, 1200));
    await typeMessage('Insurance Rep', 'Major services are covered at 50% after the deductible.', 25);
    updateVerificationRow('VF000045', '50');
    await new Promise(resolve => setTimeout(resolve, 800));
    setFieldChecking('VF000046', true);
    await typeMessage('AI Agent', 'Is there a waiting period for major services?', 25);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await typeMessage('Insurance Rep', 'Yes, there is a 6-month waiting period for major services.', 25);
    updateVerificationRow('VF000046', 'Yes');
    await new Promise(resolve => setTimeout(resolve, 800));
    setFieldChecking('VF000047', true);
    await typeMessage('AI Agent', 'When will major services be effective for this patient?', 25);
    await new Promise(resolve => setTimeout(resolve, 1200));
    await typeMessage('Insurance Rep', 'Based on the enrollment date, major services will be effective July 1, 2024.', 25);
    updateVerificationRow('VF000047', '07/01/2024');
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Closing
    await typeMessage('AI Agent', 'Perfect. That covers all the information I needed. Thank you for your help!', 25);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await typeMessage('Insurance Rep', 'You\'re welcome! Is there anything else I can help you with today?', 25);
    await new Promise(resolve => setTimeout(resolve, 800));
    await typeMessage('AI Agent', 'No, that\'s everything. Have a great day!', 25);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await typeMessage('System', 'Call completed successfully. All missing data has been verified and updated.', 40);
  };

  const startCall = () => {
    setIsCallActive(true);
    setCallDuration(0);

    // Start call duration counter
    callIntervalRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    // Start AI conversation simulation
    simulateAIConversation();
  };

  const endCall = () => {
    setIsCallActive(false);
    setCallDuration(0);
    if (callIntervalRef.current) {
      clearInterval(callIntervalRef.current);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl text-slate-700 dark:text-slate-300">smart_toy</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Smith AI Center</h2>
                <p className="text-slate-500 dark:text-slate-400 text-xs">Interactive Insurance Assistant</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors text-slate-600 dark:text-slate-400"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>

        {/* Patient Info Card */}
        <div className="bg-slate-50 dark:bg-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl text-slate-600 dark:text-slate-400">person</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-slate-900 dark:text-white">{getFullName()}</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-1 text-xs text-slate-600 dark:text-slate-400">
                <div>ID: {patient.id}</div>
                <div>{calculateAge(patient.birthDate)} years</div>
                <div>{getPhone()}</div>
                <div>{getEmail()}</div>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-md text-xs font-medium ${patient.active ? 'bg-status-green/10 text-status-green' : 'bg-status-red/10 text-status-red'}`}>
              {patient.active ? 'Active' : 'Inactive'}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - AI Chat */}
          <div className="flex-1 flex flex-col border-r border-slate-200 dark:border-slate-700">
            {/* Call Status */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isCallActive ? (
                    <>
                      <div className="w-2 h-2 bg-status-green rounded-full animate-pulse"></div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">Call Active</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{formatDuration(callDuration)}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Ready to Connect</p>
                    </>
                  )}
                </div>
                {!isCallActive ? (
                  <button
                    onClick={startCall}
                    className="bg-slate-900 dark:bg-white hover:bg-slate-700 dark:hover:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">call</span>
                    Start Call
                  </button>
                ) : (
                  <button
                    onClick={endCall}
                    className="bg-status-red hover:bg-status-red/90 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">call_end</span>
                    End Call
                  </button>
                )}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-800/50">
              {messages.map((message, index) => (
                <div key={index} className="space-y-1">
                  {message.speaker !== 'System' && (
                    <div className={`text-xs font-semibold ${
                      message.speaker === 'AI Agent'
                        ? 'text-blue-600 dark:text-blue-500'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {message.speaker}:
                    </div>
                  )}
                  <div className={`${
                    message.speaker === 'System'
                      ? 'bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-center py-2 px-4 rounded-md text-sm font-medium'
                      : message.speaker === 'AI Agent'
                        ? 'text-slate-900 dark:text-slate-100 text-sm'
                        : 'text-slate-700 dark:text-slate-300 text-sm'
                  }`}>
                    {highlightValues(message.text)}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500">
                    {message.time}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {currentTypingMessage && (
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Typing...
                  </div>
                  <div className="text-slate-700 dark:text-slate-300 text-sm">
                    {currentTypingMessage}
                    <span className="inline-block w-1 h-4 bg-slate-400 dark:bg-slate-500 ml-0.5 animate-pulse"></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Right Panel - Verification Data (Always visible) */}
          <div className="flex-1 bg-white dark:bg-slate-900 overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Live Verification Data Updates
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Watching {verificationData.length} fields
              </p>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-slate-600 dark:text-slate-400">SAI Code</th>
                    <th className="px-3 py-2 text-left font-medium text-slate-600 dark:text-slate-400">Field Name</th>
                    <th className="px-3 py-2 text-left font-medium text-slate-600 dark:text-slate-400">Value</th>
                    <th className="px-3 py-2 text-center font-medium text-slate-600 dark:text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {verificationData.map((row, index) => (
                    <tr
                      key={index}
                      className={`transition-colors ${
                        row.isUpdating
                          ? 'bg-green-50 dark:bg-green-900/20'
                          : row.isChecking
                            ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <td className="px-3 py-2 font-mono text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          {row.isChecking && (
                            <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          )}
                          {row.saiCode}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          {row.fieldName}
                          {row.isChecking && (
                            <span className="text-blue-600 dark:text-blue-400 text-[10px] font-semibold animate-pulse">
                              Checking...
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-slate-900 dark:text-white font-medium">
                        {row.aiCallValue || (
                          <span className="text-slate-400 dark:text-slate-500 italic">Pending...</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span className={`text-xs font-semibold ${
                          row.aiCallValue
                            ? 'text-status-green'
                            : 'text-status-red'
                        }`}>
                          {row.aiCallValue ? 'Yes' : 'No'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmithAICenter;
