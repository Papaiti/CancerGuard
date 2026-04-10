export interface HealthData {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  isSmoker: boolean;
  smokingYears?: number;
  familyHistory: boolean;
  familyHistoryTypes?: string[];
  familyHistoryDetails?: string;
  geneticHistory: boolean;
  geneticMarkers?: string[];
  geneticHistoryDetails?: string;
  symptoms: string[];
  weight: number;
  height: number;
  alcoholConsumption: 'none' | 'occasional' | 'regular';
  physicalActivity: 'sedentary' | 'moderate' | 'active';
  dietType: string;
  useActionableDevices: boolean;
  deviceTypes?: string[];
}

export interface AssessmentResult {
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  summary: string;
  recommendations: string[];
  suggestedScreenings: string[];
  timestamp: number;
}
