import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  confirmPassword: z.string(),
  role: z.enum(["talento", "productor"], {
    required_error: "Selecciona un rol",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export const talentProfileSchema = z.object({
  stageName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  location: z.string().min(2, "La ubicación es requerida"),
  age: z.number().min(16, "Debes tener al menos 16 años").max(99).optional(),
  gender: z.string().optional(),
  height: z.number().min(100).max(250).optional(),
  bio: z.string().max(500, "La bio no puede tener más de 500 caracteres").optional(),
  headshotUrl: z.string().url("URL de imagen inválida"),
  reelUrl: z.string().url("URL de video inválida").optional().or(z.literal("")),
  languages: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
});

export const producerProfileSchema = z.object({
  companyName: z.string().min(2, "El nombre de la empresa es requerido"),
  projectTypes: z.array(z.string()).optional(),
  website: z.string().url("URL inválida").optional().or(z.literal("")),
  credits: z.string().max(1000, "Los créditos no pueden tener más de 1000 caracteres").optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type TalentProfileFormData = z.infer<typeof talentProfileSchema>;
export type ProducerProfileFormData = z.infer<typeof producerProfileSchema>;
