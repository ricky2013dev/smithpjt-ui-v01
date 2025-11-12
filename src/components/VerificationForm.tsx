import React from "react";
import { Patient } from "../types/patient";

interface VerificationFormProps {
  patient: Patient;
}

const VerificationForm: React.FC<VerificationFormProps> = ({ patient }) => {
  const getFullName = () => {
    const given = patient.name.given.join(" ");
    return `${given} ${patient.name.family}`.trim();
  };

  return (
    <div className="mt-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined">assignment</span>
            Dental Insurance Verification Form
          </h3>
        </div>
        <div className="p-6 space-y-8">
          {/* Patient Information Section */}
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-lg">
              <h4 className="font-semibold text-slate-900 dark:text-white uppercase text-sm">
                Patient Information
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  defaultValue={getFullName()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  SSN
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="___-__-____"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Date of Birth
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  defaultValue={patient.birthDate}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Relationship to Subscriber
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Self, Spouse, Child, etc."
                />
              </div>
            </div>
          </div>

          {/* Subscriber Information Section */}
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-lg">
              <h4 className="font-semibold text-slate-900 dark:text-white uppercase text-sm">
                Subscriber Information
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Subscriber Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Subscriber name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  SSN
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="___-__-____"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Date of Birth
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="MM/DD/YYYY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Subscriber ID Number
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Subscriber ID"
                />
              </div>
            </div>
          </div>

          {/* Insurance Information Section */}
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-lg">
              <h4 className="font-semibold text-slate-900 dark:text-white uppercase text-sm">
                Insurance Information
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Insurance Company
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Insurance company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Insurer Type
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Primary</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Secondary</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Insurance address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Employer
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Employer name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Group Number
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Group number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Effective Date
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="MM/DD/YYYY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Renewal Month
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Month"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Yearly Max
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="$"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Deductible Per Individual
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="$"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Deductible Per Family
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="$"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Deductible Applies To
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Preventative</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Basic</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Major</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Preventative Coverage Section */}
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-lg">
              <h4 className="font-semibold text-slate-900 dark:text-white uppercase text-sm">
                Preventative Coverage
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Covered at (%)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="%"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Waiting Period?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="preventativeWaiting" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="preventativeWaiting" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Effective Date
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="MM/DD/YYYY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Bitewing Frequency
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="e.g., Every 6 months"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Prophylaxis/Exam Frequency
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="e.g., Every 6 months"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Last FMS
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="MM/DD/YYYY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Eligible for FMS Now?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="fmsNow" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="fmsNow" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Eligible for FMS Every (Years)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Years"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Fluoride Varnish (D1203/D1204/D1206) Frequency
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Frequency"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Age Limit on Fluoride?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="fluorideAge" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="fluorideAge" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  If yes, at what age?
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Sealant (D1351) Coverage?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="sealant" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="sealant" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Sealant Teeth Covered
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Molars</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Premolars</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Age Limit on Sealants?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="sealantAge" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="sealantAge" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  If yes, at what age?
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Age"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Replacement on Sealant
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Replacement policy"
                />
              </div>
            </div>
          </div>

          {/* Basic Coverage Section */}
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-lg">
              <h4 className="font-semibold text-slate-900 dark:text-white uppercase text-sm">
                Basic Coverage
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Covered at (%)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="%"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Waiting Period?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="basicWaiting" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="basicWaiting" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Effective Date
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="MM/DD/YYYY"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Includes
                </label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="List covered services"
                />
              </div>
            </div>
          </div>

          {/* Major Coverage Section */}
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-lg">
              <h4 className="font-semibold text-slate-900 dark:text-white uppercase text-sm">
                Major Coverage
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Covered at (%)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="%"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Waiting Period?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="majorWaiting" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="majorWaiting" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Effective Date
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="MM/DD/YYYY"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Includes
                </label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="List covered services"
                />
              </div>
            </div>
          </div>

          {/* Periodontal Coverage Section */}
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-lg">
              <h4 className="font-semibold text-slate-900 dark:text-white uppercase text-sm">
                Periodontal Coverage
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  History of SRP (D4341/D4342)?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="srpHistory" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="srpHistory" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  If yes, when?
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="MM/DD/YYYY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  SRP Covered?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="srpCovered" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="srpCovered" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  SRP Frequency
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Frequency"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  SRP All Quadrants Same Visit?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="srpQuadrants" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="srpQuadrants" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  If not, waiting period?
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Waiting period"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Adult Prophylaxis & Isolated SRP Same Visit?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="prophylaxisSRP" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="prophylaxisSRP" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  If not, waiting period?
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Waiting period"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Periodontal Maintenance (D4910) Covered?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="perioMaintenance" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="perioMaintenance" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Frequency
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Frequency"
                />
              </div>
            </div>
          </div>

          {/* Implant Coverage Section */}
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-lg">
              <h4 className="font-semibold text-slate-900 dark:text-white uppercase text-sm">
                Implant Coverage
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Endosteal Implants (D6012) Covered?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="endosteal" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="endosteal" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  If yes, covered at (%)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="%"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Bone Replacement Grafts (D7953) Covered?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="boneGrafts" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="boneGrafts" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  If yes, covered at (%)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="%"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Guided-Tissue Regeneration (D4266/D4267) Covered?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="guidedTissue" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="guidedTissue" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  If yes, covered at (%)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="%"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Implant Abutments (D6056/D6057) Covered?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="abutments" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="abutments" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  If yes, covered at (%)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="%"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Implant Crowns (D6065/D6066/D6067) Covered?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="implantCrowns" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="implantCrowns" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  If yes, covered at (%)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="%"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Pre-determination Required Prior to Implant Surgery?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="preDetermination" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="preDetermination" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Orthodontic Coverage Section */}
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-lg">
              <h4 className="font-semibold text-slate-900 dark:text-white uppercase text-sm">
                Orthodontic Coverage
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Orthodontics Covered?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="orthodontics" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="orthodontics" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  If yes, covered at (%)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="%"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Age Limit on Orthodontic Coverage?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="orthodonticsAge" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="orthodonticsAge" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  If yes, at what age?
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Lifetime Maximum?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="orthodonticsLifetime" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="orthodonticsLifetime" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  If yes, lifetime maximum ($)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="$"
                />
              </div>
            </div>
          </div>

          {/* Miscellaneous Section */}
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-lg">
              <h4 className="font-semibold text-slate-900 dark:text-white uppercase text-sm">
                Miscellaneous
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nightguards (D9940) Covered?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="nightguards" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="nightguards" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  If yes, covered at (%)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="%"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nitrous Oxide (D9230) Covered?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="nitrousOxide" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="nitrousOxide" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  If yes, covered at (%)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="%"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Replacement on Crowns and Bridges (Years)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Years"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Replacement on Complete and Partial Dentures (Years)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Years"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Prior Extractions Covered (Missing Tooth Clause)?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="missingTooth" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="missingTooth" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Notes Section */}
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-lg">
              <h4 className="font-semibold text-slate-900 dark:text-white uppercase text-sm">
                Additional Notes
              </h4>
            </div>
            <div>
              <textarea
                rows={6}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="Add any additional notes or information..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
              Clear Form
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
              Save Verification Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationForm;
