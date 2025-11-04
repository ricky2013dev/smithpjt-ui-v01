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

export type FilterType = 'Status: Active' | 'Joined: Last 30 Days';
export type TabType = 'Demographics' | 'Insurance' | 'Appointments' | 'Treatment History' | 'Coverage Details';
