import { Database } from "./database";

export type UserRole = "talento" | "productor";
export type UserStatus = "pendiente" | "verificado" | "rechazado";

export type User = Database["public"]["Tables"]["users"]["Row"];
export type TalentProfile = Database["public"]["Tables"]["talent_profiles"]["Row"];
export type ProducerProfile = Database["public"]["Tables"]["producer_profiles"]["Row"];

export interface TalentFormData {
  email: string;
  stageName: string;
  location: string;
  age?: number;
  gender?: string;
  height?: number;
  bio?: string;
  headshotUrl: string;
  reelUrl?: string;
  languages?: string[];
  skills?: string[];
}

export interface ProducerFormData {
  email: string;
  companyName: string;
  projectTypes?: string[];
  website?: string;
  credits?: string;
}
