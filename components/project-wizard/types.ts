// Shared types for Project Wizard components

export interface Role {
  id?: string;
  category: string;
  subtype: string;
  name: string;
  description: string;
  ageMin: number;
  ageMax: number;
  isRemote: boolean;
  requirements: {
    gender: string[];
    ethnicity: string[];
    skills: string[];
    media: string[];
    accent: string[];
    language: string[];
    voiceStyle: string[];
    softwareSkills: string[];
  };
  flags: {
    nudity: boolean;
    explicitContent: boolean;
  };
}

export interface CompensationData {
  rateType: string;
  amount: number | null;
  currency: string;
  notes: string;
}

export interface PrescreenQuestion {
  id: string;
  question: string;
  type: string;
}

export interface ProjectData {
  id?: string;
  title: string;
  type: string;
  description: string;
  unionStatus: string;
  datesAndLocations: string;
  hireFrom: string;
  hasSpecialInstructions: boolean;
  specialInstructions: string;
  materials: {
    media: string[];
    texts: string[];
  };
  roles: Role[];
  compensation: {
    byRole: Record<string, CompensationData>;
  };
  prescreens: {
    questions: PrescreenQuestion[];
    mediaRequirements: string[];
    auditionInstructions: string;
  };
  meta: {
    createdAt: string;
    updatedAt: string;
    lastSavedBy: string;
  };
}
