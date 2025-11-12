export interface Patient {
  id: string;
  active: boolean;
  name: PatientName;
  gender: string;
  birthDate: string;
  telecom: Telecom[];
  address: Address[];
  insurance?: Insurance[];
  appointments?: Appointment[];
  treatments?: Treatment[];
  coverage?: CoverageDetails;
  verificationStatus?: VerificationStatus;
}

export interface VerificationStatus {
  eligibilityCheck: 'completed' | 'in_progress' | 'pending';
  benefitsVerification: 'completed' | 'in_progress' | 'pending';
  aiCallVerification: 'completed' | 'in_progress' | 'pending';
  sendToPMS: 'completed' | 'in_progress' | 'pending';
}

export interface PatientName {
  given: string[];
  family: string;
}

export interface Telecom {
  system: 'phone' | 'email';
  value: string;
}

export interface Address {
  line: string[];
  city: string;
  state: string;
  postalCode: string;
}

export interface Insurance {
  type: 'Primary' | 'Secondary';
  provider: string;
  policyNumber: string;
  groupNumber: string;
  subscriberName: string;
  subscriberId: string;
  relationship: string;
  effectiveDate: string;
  expirationDate: string;
  coverage: {
    deductible: string;
    deductibleMet: string;
    maxBenefit: string;
    preventiveCoverage: string;
    basicCoverage: string;
    majorCoverage: string;
  };
}

export interface Appointment {
  date: string;
  time: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  provider: string;
}

export interface Treatment {
  name: string;
  date: string;
  cost: string;
}

export interface Procedure {
  code: string;
  name: string;
  category: 'Preventive' | 'Basic' | 'Major' | 'Orthodontic';
  coverage: string;
  estimated_cost: string;
  patient_pays: string;
}

export interface CoverageDetails {
  annual_maximum: number;
  annual_used: number;
  deductible: number;
  deductible_met: number;
  procedures: Procedure[];
}

export interface VerificationFormData {
  // Patient Information
  patientName: string;
  patientSSN: string;
  patientDOB: string;
  relationshipToSubscriber: string;

  // Subscriber Information
  subscriberName: string;
  subscriberSSN: string;
  subscriberDOB: string;
  subscriberID: string;

  // Insurance Information
  insuranceCompany: string;
  insurerType: 'Primary' | 'Secondary';
  insuranceAddress: string;
  insurancePhone: string;
  employer: string;
  groupNumber: string;
  effectiveDate: string;
  renewalMonth: string;
  yearlyMax: string;
  deductiblePerIndividual: string;
  deductiblePerFamily: string;
  deductibleAppliesTo: {
    preventative: boolean;
    basic: boolean;
    major: boolean;
  };

  // Preventative Coverage
  preventativeCoveredAt: string;
  preventativeWaitingPeriod: boolean;
  preventativeEffectiveDate: string;
  bitewingFrequency: string;
  prophylaxisExamFrequency: string;
  lastFMS: string;
  eligibleForFMSNow: boolean;
  eligibleForFMSEvery: string;
  fluorideVarnishFrequency: string;
  fluorideAgeLimitExists: boolean;
  fluorideAgeLimit: string;
  sealantCoverage: boolean;
  sealantTeethCovered: {
    molars: boolean;
    premolars: boolean;
  };
  sealantAgeLimitExists: boolean;
  sealantAgeLimit: string;
  sealantReplacement: string;

  // Basic Coverage
  basicCoveredAt: string;
  basicWaitingPeriod: boolean;
  basicEffectiveDate: string;
  basicIncludes: string;

  // Major Coverage
  majorCoveredAt: string;
  majorWaitingPeriod: boolean;
  majorEffectiveDate: string;
  majorIncludes: string;

  // Periodontal Coverage
  srpHistory: boolean;
  srpHistoryDate: string;
  srpCovered: boolean;
  srpFrequency: string;
  srpAllQuadrantsSameVisit: boolean;
  srpWaitingPeriod: string;
  adultProphylaxisWithSRP: boolean;
  adultProphylaxisWaitingPeriod: string;
  periodontalMaintenanceCovered: boolean;
  periodontalMaintenanceFrequency: string;

  // Implant Coverage
  endostealImplantsCovered: boolean;
  endostealImplantsCoveredAt: string;
  boneReplacementGraftsCovered: boolean;
  boneReplacementGraftsCoveredAt: string;
  guidedTissueRegenerationCovered: boolean;
  guidedTissueRegenerationCoveredAt: string;
  implantAbutmentsCovered: boolean;
  implantAbutmentsCoveredAt: string;
  implantCrownsCovered: boolean;
  implantCrownsCoveredAt: string;
  implantPreDeterminationRequired: boolean;

  // Orthodontic Coverage
  orthodonticsCovered: boolean;
  orthodonticsCoveredAt: string;
  orthodonticsAgeLimitExists: boolean;
  orthodonticsAgeLimit: string;
  orthodonticsLifetimeMaxExists: boolean;
  orthodonticsLifetimeMax: string;

  // Miscellaneous
  nightguardsCovered: boolean;
  nightguardsCoveredAt: string;
  nitrousOxideCovered: boolean;
  nitrousOxideCoveredAt: string;
  crownsAndBridgesReplacement: string;
  denturesReplacement: string;
  missingToothClauseCovered: boolean;

  // Additional Notes
  additionalNotes: string;
}

export type FilterType =
  | 'Active'
  | 'Inactive'
  | 'Eligibility'
  | 'Verification'
  | 'Authorization';
export type TabType = 'Demographics' | 'Insurance' | 'Appointments' | 'Treatment History' | 'Coverage Details' | 'AI Call History' | 'Verification Form';
