import React, { useState } from 'react';
import { Patient } from '../types/patient';

interface SmithAICenterProps {
  patient: Patient;
  onClose: () => void;
}

const SmithAICenter: React.FC<SmithAICenterProps> = ({ patient, onClose }) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user', text: string, time: string }>>([
    {
      sender: 'ai',
      text: `Hello! I'm Smith AI Assistant. I'm ready to help with insurance verification for ${patient.name.given.join(' ')} ${patient.name.family}. Start Call when you're ready.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

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

  const startCall = () => {
    setIsCallActive(true);
    setCallDuration(0);

    // Add message when call starts
    const callMessage = {
      sender: 'ai' as const,
      text: `Initiating call to insurance provider on behalf of ${getFullName()}. Connecting with verification agent to process insurance eligibility and benefits verification...`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, callMessage]);

    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  };

  const endCall = () => {
    setIsCallActive(false);
    setCallDuration(0);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const quickActions = [
    { icon: 'verified_user', label: 'Verify Eligibility', color: 'bg-green-500' },
    { icon: 'description', label: 'Check Benefits', color: 'bg-blue-500' },
    { icon: 'approval', label: 'Request Auth', color: 'bg-purple-500' },
    { icon: 'update', label: 'Update Info', color: 'bg-orange-500' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
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

        {/* Patient Info Card - Separate Section */}
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
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] ${message.sender === 'ai' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'} rounded-lg px-4 py-3`}>
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.sender === 'ai' ? 'text-slate-500 dark:text-slate-400' : 'text-white/70 dark:text-slate-900/70'}`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-600"
                />
                <button className="bg-slate-900 dark:bg-white hover:bg-slate-700 dark:hover:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors">
                  <span className="material-symbols-outlined text-base">send</span>
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Quick Actions & Info */}
          <div className="w-80 p-4 bg-slate-50 dark:bg-slate-800 overflow-y-auto">
            <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wide">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                >
                  <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg text-slate-600 dark:text-slate-400">{action.icon}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 text-center">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>

            <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wide">
              Verification Status
            </h3>
            <div className="space-y-2">
              {patient.verificationStatus && (
                <>
                  <div className="bg-white dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Eligibility</span>
                      <span className={`text-xs font-medium ${patient.verificationStatus.eligibilityCheck === 'completed' ? 'text-status-green' : patient.verificationStatus.eligibilityCheck === 'in_progress' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                        {patient.verificationStatus.eligibilityCheck === 'completed' ? 'Completed' : patient.verificationStatus.eligibilityCheck === 'in_progress' ? 'In Progress' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Benefits</span>
                      <span className={`text-xs font-medium ${patient.verificationStatus.benefitsVerification === 'completed' ? 'text-status-green' : patient.verificationStatus.benefitsVerification === 'in_progress' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                        {patient.verificationStatus.benefitsVerification === 'completed' ? 'Completed' : patient.verificationStatus.benefitsVerification === 'in_progress' ? 'In Progress' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">AI Call Verification</span>
                      <span className={`text-xs font-medium ${patient.verificationStatus.aiCallVerification === 'completed' ? 'text-status-green' : patient.verificationStatus.aiCallVerification === 'in_progress' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                        {patient.verificationStatus.aiCallVerification === 'completed' ? 'Completed' : patient.verificationStatus.aiCallVerification === 'in_progress' ? 'In Progress' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Send To PMS</span>
                      <span className={`text-xs font-medium ${patient.verificationStatus.sendToPMS === 'completed' ? 'text-status-green' : patient.verificationStatus.sendToPMS === 'in_progress' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                        {patient.verificationStatus.sendToPMS === 'completed' ? 'Completed' : patient.verificationStatus.sendToPMS === 'in_progress' ? 'In Progress' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-slate-200 dark:bg-slate-800 rounded-md flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-slate-600 dark:text-slate-400 text-base">lightbulb</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-medium text-slate-900 dark:text-white mb-1">
                    AI Assistant Tip
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    I can help verify insurance, check benefits, and process authorizations in real-time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmithAICenter;
