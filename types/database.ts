export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: "talento" | "productor";
          status: "pendiente" | "verificado" | "rechazado";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          role: "talento" | "productor";
          status?: "pendiente" | "verificado" | "rechazado";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: "talento" | "productor";
          status?: "pendiente" | "verificado" | "rechazado";
          created_at?: string;
          updated_at?: string;
        };
      };
      talent_profiles: {
        Row: {
          id: string;
          user_id: string;
          stage_name: string;
          bio: string | null;
          location: string;
          age: number | null;
          gender: string | null;
          height: number | null;
          headshot_url: string;
          reel_url: string | null;
          languages: string[] | null;
          skills: string[] | null;
          availability: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stage_name: string;
          bio?: string | null;
          location: string;
          age?: number | null;
          gender?: string | null;
          height?: number | null;
          headshot_url: string;
          reel_url?: string | null;
          languages?: string[] | null;
          skills?: string[] | null;
          availability?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stage_name?: string;
          bio?: string | null;
          location?: string;
          age?: number | null;
          gender?: string | null;
          height?: number | null;
          headshot_url?: string;
          reel_url?: string | null;
          languages?: string[] | null;
          skills?: string[] | null;
          availability?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      producer_profiles: {
        Row: {
          id: string;
          user_id: string;
          company_name: string;
          project_types: string[] | null;
          website: string | null;
          credits: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_name: string;
          project_types?: string[] | null;
          website?: string | null;
          credits?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          company_name?: string;
          project_types?: string[] | null;
          website?: string | null;
          credits?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
