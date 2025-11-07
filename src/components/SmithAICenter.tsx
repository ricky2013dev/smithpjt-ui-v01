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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="material-symbols-outlined text-3xl">smart_toy</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Smith AI Center</h2>
                <p className="text-cyan-100 text-sm">Interactive Insurance Assistant</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Patient Info Card - Separate Section */}
        <div className="bg-white dark:bg-slate-900 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900 dark:to-blue-900 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-cyan-600 dark:text-cyan-400">person</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{getFullName()}</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-1 text-sm text-slate-600 dark:text-slate-400">
                <div>
                  <span className="material-symbols-outlined text-xs align-middle mr-1">badge</span>
                  ID: {patient.id}
                </div>
                <div>
                  <span className="material-symbols-outlined text-xs align-middle mr-1">cake</span>
                  {calculateAge(patient.birthDate)} years
                </div>
                <div>
                  <span className="material-symbols-outlined text-xs align-middle mr-1">phone</span>
                  {getPhone()}
                </div>
                <div>
                  <span className="material-symbols-outlined text-xs align-middle mr-1">email</span>
                  {getEmail()}
                </div>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-lg font-semibold ${patient.active ? 'bg-green-500' : 'bg-red-500'} text-white`}>
              {patient.active ? 'Active' : 'Inactive'}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - AI Chat */}
          <div className="flex-1 flex flex-col border-r border-slate-200 dark:border-slate-700">
            {/* Call Status */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isCallActive ? (
                    <>
                      <div className="relative">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Call Active</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{formatDuration(callDuration)}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Ready to Connect</p>
                    </>
                  )}
                </div>
                {!isCallActive ? (
                  <button
                    onClick={startCall}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">call</span>
                    Start Call
                  </button>
                ) : (
                  <button
                    onClick={endCall}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">call_end</span>
                    End Call
                  </button>
                )}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] ${message.sender === 'ai' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'} rounded-2xl px-4 py-3`}>
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.sender === 'ai' ? 'text-cyan-100' : 'text-slate-500 dark:text-slate-400'}`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-all">
                  <span className="material-symbols-outlined text-lg">send</span>
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Quick Actions & Info */}
          <div className="w-80 p-4 bg-slate-50 dark:bg-slate-800 overflow-y-auto">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
                >
                  <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center text-white`}>
                    <span className="material-symbols-outlined text-2xl">{action.icon}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-200 text-center">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>

            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">
              Verification Status
            </h3>
            <div className="space-y-2">
              {patient.verificationStatus && (
                <>
                  <div className="bg-white dark:bg-slate-900 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Eligibility</span>
                      <span className={`text-xs font-semibold ${patient.verificationStatus.eligibilityCheck === 'completed' ? 'text-green-500' : patient.verificationStatus.eligibilityCheck === 'in_progress' ? 'text-blue-500' : 'text-slate-400'}`}>
                        {patient.verificationStatus.eligibilityCheck === 'completed' ? 'Completed' : patient.verificationStatus.eligibilityCheck === 'in_progress' ? 'In Progress' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Benefits</span>
                      <span className={`text-xs font-semibold ${patient.verificationStatus.benefitsVerification === 'completed' ? 'text-green-500' : patient.verificationStatus.benefitsVerification === 'in_progress' ? 'text-blue-500' : 'text-slate-400'}`}>
                        {patient.verificationStatus.benefitsVerification === 'completed' ? 'Completed' : patient.verificationStatus.benefitsVerification === 'in_progress' ? 'In Progress' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">AI Call Verification</span>
                      <span className={`text-xs font-semibold ${patient.verificationStatus.aiCallVerification === 'completed' ? 'text-green-500' : patient.verificationStatus.aiCallVerification === 'in_progress' ? 'text-blue-500' : 'text-slate-400'}`}>
                        {patient.verificationStatus.aiCallVerification === 'completed' ? 'Completed' : patient.verificationStatus.aiCallVerification === 'in_progress' ? 'In Progress' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Send To PMS</span>
                      <span className={`text-xs font-semibold ${patient.verificationStatus.sendToPMS === 'completed' ? 'text-green-500' : patient.verificationStatus.sendToPMS === 'in_progress' ? 'text-blue-500' : 'text-slate-400'}`}>
                        {patient.verificationStatus.sendToPMS === 'completed' ? 'Completed' : patient.verificationStatus.sendToPMS === 'in_progress' ? 'In Progress' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 relative overflow-hidden bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-cyan-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 border border-cyan-200 dark:border-cyan-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              {/* Decorative gradient orbs */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-400/20 to-indigo-400/20 rounded-full blur-xl"></div>

              <div className="relative p-4 flex items-start gap-3">
                <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-white text-lg">lightbulb</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 mb-1">
                    AI Assistant Tip
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
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
