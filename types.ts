
export enum DocumentType {
  PRESCRIPTION = 'PRESCRIPTION',
  LAB_REPORT = 'LAB_REPORT',
  HOSPITAL_BILL = 'HOSPITAL_BILL',
  INSURANCE_REJECTION = 'INSURANCE_REJECTION',
  UNKNOWN = 'UNKNOWN'
}

export interface GenericAlternative {
  brandedName: string;
  genericName: string;
  approxBrandedPrice: string;
  approxGenericPrice: string;
  savingsPercentage: string;
}

export interface CostInsight {
  procedureName: string;
  billedAmount?: string;
  expectedRange: {
    privateLow: string;
    privateHigh: string;
    government: string;
  };
  isOvercharged: boolean;
  tierComparison: string;
}

export interface MedicalAnalysis {
  id?: string;
  timestamp?: number;
  documentType: DocumentType;
  summary: string;
  simplifiedTerms: {
    jargon: string;
    meaning: string;
    importance: string;
  }[];
  criticalFindings: {
    issue: string;
    description: string;
    action: string;
  }[];
  genericAlternatives?: GenericAlternative[];
  costInsights?: CostInsight;
  billAnalysis?: {
    totalAmount: string;
    potentialOvercharges: {
      item: string;
      reason: string;
      suggestedAction: string;
    }[];
  };
  insuranceInsights?: {
    rejectionReason?: string;
    appealAdvice?: string;
  };
  nextSteps: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  cityTier?: 'Tier-1' | 'Tier-2' | 'Tier-3';
}

export interface AnalysisState {
  file: File | null;
  preview: string | null;
  isAnalyzing: boolean;
  result: MedicalAnalysis | null;
  error: string | null;
}
