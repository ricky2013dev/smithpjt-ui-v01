import React, { useState } from "react";

interface CoverageModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  isLoading?: boolean;
  error?: string | null;
  curlCommand?: string | null;
}

const CoverageModal: React.FC<CoverageModalProps> = ({
  isOpen,
  onClose,
  data,
  isLoading = false,
  error = null,
  curlCommand = null
}) => {
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [viewMode, setViewMode] = useState<'document' | 'json'>('json');

  const handleCopyCurl = async () => {
    if (curlCommand) {
      try {
        await navigator.clipboard.writeText(curlCommand);
        setCopiedCurl(true);
        setTimeout(() => setCopiedCurl(false), 2000);
      } catch (err) {
        console.error('Failed to copy curl command:', err);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined">verified_user</span>
            Coverage Verification Results
          </h2>
          <div className="flex items-center gap-3">
            {/* View Toggle Buttons */}
            {!isLoading && !error && data && (
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('json')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
                    viewMode === 'json'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">data_object</span>
                  JSON
                </button>
                <button
                  onClick={() => setViewMode('document')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
                    viewMode === 'document'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">description</span>
                  Document
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              {/* Loading Icon */}
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 dark:border-slate-700"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-green-600 border-r-transparent border-b-transparent border-l-transparent absolute top-0 left-0"></div>
              </div>

              {/* Loading Message */}
              <div className="text-center">
                <p className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Availity API Connecting....
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Please wait while we verify coverage information
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-md">
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full animate-progress"></div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-600 dark:text-red-400">
                    error
                  </span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-900 dark:text-red-200 mb-1">
                      Verification Error
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {error}
                    </p>
                  </div>
                </div>
              </div>

              {curlCommand && (
                <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="material-symbols-outlined">terminal</span>
                      Test with cURL
                    </h3>
                    <button
                      onClick={handleCopyCurl}
                      className="px-3 py-1.5 bg-slate-700 dark:bg-slate-600 text-white rounded-lg hover:bg-slate-600 dark:hover:bg-slate-500 transition-colors flex items-center gap-2 text-sm"
                    >
                      <span className="material-symbols-outlined text-base">
                        {copiedCurl ? 'check' : 'content_copy'}
                      </span>
                      {copiedCurl ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre className="text-xs text-slate-700 dark:text-slate-300 overflow-x-auto whitespace-pre-wrap break-words bg-slate-100 dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-700">
                    {curlCommand}
                  </pre>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                    Copy this command and run it in your terminal to test the API directly.
                  </p>
                </div>
              )}
            </div>
          )}

          {!isLoading && !error && data && (
            <div className="space-y-4">
              {viewMode === 'json' ? (
                /* JSON View */
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined">data_object</span>
                    API Response Data
                  </h3>
                  <pre className="text-xs text-slate-700 dark:text-slate-300 overflow-x-auto whitespace-pre-wrap break-words">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </div>
              ) : (
                /* Document View */
                <div className="bg-white dark:bg-slate-900 space-y-6">
                  {/* Coverage Summary Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                          Coverage Verification Report
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Control Number: {data.controlNumber || 'N/A'}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          data.status === 'Completed' || data.status === 'Active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {data.status || 'Unknown'}
                        </span>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                          {data.createdDate ? new Date(data.createdDate).toLocaleDateString() : ''}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Patient & Subscriber Info */}
                  {(data.patient || data.subscriber) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Patient Information */}
                      {data.patient && (
                        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-600">person</span>
                            Patient Information
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-slate-600 dark:text-slate-400">Name:</span>
                              <span className="ml-2 font-medium text-slate-900 dark:text-white">
                                {data.patient.firstName} {data.patient.middleName} {data.patient.lastName}
                              </span>
                            </div>
                            {data.patient.birthDate && (
                              <div>
                                <span className="text-slate-600 dark:text-slate-400">Birth Date:</span>
                                <span className="ml-2 text-slate-900 dark:text-white">
                                  {new Date(data.patient.birthDate).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                            {data.patient.memberId && (
                              <div>
                                <span className="text-slate-600 dark:text-slate-400">Member ID:</span>
                                <span className="ml-2 font-mono text-slate-900 dark:text-white">
                                  {data.patient.memberId}
                                </span>
                              </div>
                            )}
                            {data.patient.gender && (
                              <div>
                                <span className="text-slate-600 dark:text-slate-400">Gender:</span>
                                <span className="ml-2 text-slate-900 dark:text-white">
                                  {data.patient.gender === 'M' ? 'Male' : data.patient.gender === 'F' ? 'Female' : data.patient.gender}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Subscriber Information */}
                      {data.subscriber && (
                        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-purple-600">badge</span>
                            Subscriber Information
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-slate-600 dark:text-slate-400">Name:</span>
                              <span className="ml-2 font-medium text-slate-900 dark:text-white">
                                {data.subscriber.firstName} {data.subscriber.lastName}
                              </span>
                            </div>
                            {data.subscriber.relationshipToPatient && (
                              <div>
                                <span className="text-slate-600 dark:text-slate-400">Relationship:</span>
                                <span className="ml-2 text-slate-900 dark:text-white">
                                  {data.subscriber.relationshipToPatient}
                                </span>
                              </div>
                            )}
                            {data.subscriber.memberId && (
                              <div>
                                <span className="text-slate-600 dark:text-slate-400">Member ID:</span>
                                <span className="ml-2 font-mono text-slate-900 dark:text-white">
                                  {data.subscriber.memberId}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Payer Information */}
                  {data.payer && (
                    <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-green-600">business</span>
                        Insurance Payer
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-600 dark:text-slate-400">Payer Name:</span>
                          <span className="ml-2 font-medium text-slate-900 dark:text-white">
                            {data.payer.name}
                          </span>
                        </div>
                        {data.payer.payerId && (
                          <div>
                            <span className="text-slate-600 dark:text-slate-400">Payer ID:</span>
                            <span className="ml-2 font-mono text-slate-900 dark:text-white">
                              {data.payer.payerId}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Coverage Plans */}
                  {data.plans && data.plans.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-indigo-600">health_and_safety</span>
                        Coverage Plans
                      </h4>
                      {data.plans.map((plan: any, index: number) => (
                        <div key={index} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-4">
                          {/* Plan Header */}
                          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                            <div>
                              <h5 className="font-semibold text-slate-900 dark:text-white">
                                {plan.planName || 'Coverage Plan'}
                              </h5>
                              {plan.groupNumber && (
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  Group: {plan.groupNumber}
                                </p>
                              )}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              plan.status === 'Active'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                            }`}>
                              {plan.status || 'Unknown'}
                            </span>
                          </div>

                          {/* Deductibles and Maximums */}
                          {plan.benefits && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {plan.benefits.deductible && (
                                <div className="bg-white dark:bg-slate-900 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                                  <h6 className="font-medium text-slate-900 dark:text-white mb-2 text-sm">Deductible</h6>
                                  {plan.benefits.deductible.individual && (
                                    <div className="flex justify-between text-sm mb-1">
                                      <span className="text-slate-600 dark:text-slate-400">Individual:</span>
                                      <span className="font-medium text-slate-900 dark:text-white">
                                        ${plan.benefits.deductible.individual.amount?.toFixed(2)}
                                        <span className="text-xs text-green-600 dark:text-green-400 ml-1">
                                          (${plan.benefits.deductible.individual.remaining?.toFixed(2)} remaining)
                                        </span>
                                      </span>
                                    </div>
                                  )}
                                  {plan.benefits.deductible.family && (
                                    <div className="flex justify-between text-sm">
                                      <span className="text-slate-600 dark:text-slate-400">Family:</span>
                                      <span className="font-medium text-slate-900 dark:text-white">
                                        ${plan.benefits.deductible.family.amount?.toFixed(2)}
                                        <span className="text-xs text-green-600 dark:text-green-400 ml-1">
                                          (${plan.benefits.deductible.family.remaining?.toFixed(2)} remaining)
                                        </span>
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {plan.benefits.maximumBenefit && (
                                <div className="bg-white dark:bg-slate-900 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                                  <h6 className="font-medium text-slate-900 dark:text-white mb-2 text-sm">Annual Maximum</h6>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600 dark:text-slate-400">Total:</span>
                                    <span className="font-medium text-slate-900 dark:text-white">
                                      ${plan.benefits.maximumBenefit.amount?.toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-slate-600 dark:text-slate-400">Remaining:</span>
                                    <span className="font-semibold text-green-600 dark:text-green-400">
                                      ${plan.benefits.maximumBenefit.remaining?.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Coverage Levels */}
                          {plan.benefits && (
                            <div className="space-y-3">
                              <h6 className="font-medium text-slate-900 dark:text-white text-sm">Coverage Levels</h6>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {plan.benefits.preventiveCare && (
                                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="font-medium text-slate-900 dark:text-white text-sm">Preventive Care</span>
                                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                        {plan.benefits.preventiveCare.coverage}%
                                      </span>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                      {plan.benefits.preventiveCare.description}
                                    </p>
                                  </div>
                                )}

                                {plan.benefits.basicServices && (
                                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="font-medium text-slate-900 dark:text-white text-sm">Basic Services</span>
                                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                        {plan.benefits.basicServices.coverage}%
                                      </span>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                      {plan.benefits.basicServices.description}
                                    </p>
                                  </div>
                                )}

                                {plan.benefits.majorServices && (
                                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="font-medium text-slate-900 dark:text-white text-sm">Major Services</span>
                                      <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                                        {plan.benefits.majorServices.coverage}%
                                      </span>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                      {plan.benefits.majorServices.description}
                                    </p>
                                  </div>
                                )}

                                {plan.benefits.orthodontics && (
                                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="font-medium text-slate-900 dark:text-white text-sm">Orthodontics</span>
                                      <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                        {plan.benefits.orthodontics.coverage}%
                                      </span>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                      Lifetime Max: ${plan.benefits.orthodontics.lifetimeMaximum?.toFixed(2)}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Limitations */}
                          {plan.limitations && plan.limitations.length > 0 && (
                            <div>
                              <h6 className="font-medium text-slate-900 dark:text-white text-sm mb-2">Service Limitations</h6>
                              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                                  {plan.limitations.map((limitation: any, idx: number) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <span className="text-yellow-600 dark:text-yellow-500 mt-0.5">•</span>
                                      <span>
                                        <strong>{limitation.service}</strong> ({limitation.code}): {limitation.frequency}
                                        {limitation.lastService && (
                                          <span className="text-slate-500 dark:text-slate-400 ml-1">
                                            - Last: {new Date(limitation.lastService).toLocaleDateString()}
                                          </span>
                                        )}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}

                          {/* Exclusions */}
                          {plan.exclusions && plan.exclusions.length > 0 && (
                            <div>
                              <h6 className="font-medium text-slate-900 dark:text-white text-sm mb-2">Exclusions</h6>
                              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                                  {plan.exclusions.map((exclusion: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <span className="text-red-600 dark:text-red-500 mt-0.5">✕</span>
                                      <span>{exclusion}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Additional Information */}
                  {data.additionalInformation && (
                    <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-600">info</span>
                        Additional Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        {data.additionalInformation.coordinationOfBenefits && (
                          <div>
                            <span className="text-slate-600 dark:text-slate-400">Coordination of Benefits:</span>
                            <span className="ml-2 text-slate-900 dark:text-white">
                              {data.additionalInformation.coordinationOfBenefits}
                            </span>
                          </div>
                        )}
                        {data.additionalInformation.customerServicePhone && (
                          <div>
                            <span className="text-slate-600 dark:text-slate-400">Customer Service:</span>
                            <span className="ml-2 text-slate-900 dark:text-white font-mono">
                              {data.additionalInformation.customerServicePhone}
                            </span>
                          </div>
                        )}
                        {data.additionalInformation.memberServiceWebsite && (
                          <div>
                            <span className="text-slate-600 dark:text-slate-400">Member Portal:</span>
                            <a
                              href={data.additionalInformation.memberServiceWebsite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {data.additionalInformation.memberServiceWebsite}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-800">
          {/* <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Close
          </button> */}
          {/* {!isLoading && !error && data && (
            <button
              onClick={() => {
                const dataStr = JSON.stringify(data, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `coverage-verification-${new Date().toISOString()}.json`;
                link.click();
                URL.revokeObjectURL(url);
              }}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">download</span>
              Download JSON
            </button>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default CoverageModal;
