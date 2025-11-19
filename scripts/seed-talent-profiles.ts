/**
 * Script para crear perfiles de talento de prueba con headshots
 * Ejecutar: npx tsx scripts/seed-talent-profiles.ts
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Faltan variables de entorno: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Perfiles de prueba con headshots reales de Unsplash
const mockTalents = [
  {
    email: "maria.garcia@example.com",
    stageName: "María García",
    location: "Madrid, España",
    age: 28,
    gender: "Mujer",
    height: 168,
    bio: "Actriz profesional con 5 años de experiencia en teatro y cine",
    headshotUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&q=80",
    languages: ["Español", "Inglés"],
    skills: ["Actuación", "Danza", "Canto"],
  },
  {
    email: "carlos.rodriguez@example.com",
    stageName: "Carlos Rodríguez",
    location: "Barcelona, España",
    age: 32,
    gender: "Hombre",
    height: 180,
    bio: "Actor de cine y televisión, especializado en drama",
    headshotUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80",
    languages: ["Español", "Catalán", "Inglés"],
    skills: ["Actuación", "Artes marciales"],
  },
  {
    email: "lucia.martin@example.com",
    stageName: "Lucía Martín",
    location: "Valencia, España",
    age: 25,
    gender: "Mujer",
    height: 165,
    bio: "Modelo y actriz emergente con pasión por el arte dramático",
    headshotUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&q=80",
    languages: ["Español", "Francés"],
    skills: ["Modelaje", "Actuación", "Ballet"],
  },
  {
    email: "javier.lopez@example.com",
    stageName: "Javier López",
    location: "Sevilla, España",
    age: 35,
    gender: "Hombre",
    height: 175,
    bio: "Actor de teatro con más de 10 años de trayectoria",
    headshotUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&q=80",
    languages: ["Español", "Inglés"],
    skills: ["Actuación", "Improvisación", "Dirección"],
  },
  {
    email: "ana.fernandez@example.com",
    stageName: "Ana Fernández",
    location: "Bilbao, España",
    age: 29,
    gender: "Mujer",
    height: 170,
    bio: "Actriz de doblaje y teatro musical",
    headshotUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&q=80",
    languages: ["Español", "Euskera", "Inglés"],
    skills: ["Doblaje", "Canto", "Teatro musical"],
  },
  {
    email: "miguel.sanchez@example.com",
    stageName: "Miguel Sánchez",
    location: "Madrid, España",
    age: 40,
    gender: "Hombre",
    height: 182,
    bio: "Actor veterano con experiencia en cine, teatro y televisión",
    headshotUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&q=80",
    languages: ["Español", "Inglés", "Italiano"],
    skills: ["Actuación", "Dirección", "Escritura"],
  },
  {
    email: "carmen.ruiz@example.com",
    stageName: "Carmen Ruiz",
    location: "Granada, España",
    age: 26,
    gender: "Mujer",
    height: 162,
    bio: "Bailaora flamenca y actriz de teatro",
    headshotUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&q=80",
    languages: ["Español"],
    skills: ["Flamenco", "Actuación", "Danza contemporánea"],
  },
  {
    email: "david.torres@example.com",
    stageName: "David Torres",
    location: "Zaragoza, España",
    age: 31,
    gender: "Hombre",
    height: 178,
    bio: "Actor de cine independiente y cortometrajes",
    headshotUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80",
    languages: ["Español", "Inglés"],
    skills: ["Actuación", "Producción", "Edición"],
  },
  {
    email: "elena.jimenez@example.com",
    stageName: "Elena Jiménez",
    location: "Málaga, España",
    age: 27,
    gender: "Mujer",
    height: 166,
    bio: "Actriz de teatro y modelo publicitaria",
    headshotUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&q=80",
    languages: ["Español", "Inglés"],
    skills: ["Actuación", "Modelaje", "Fotografía"],
  },
];

async function seedTalents() {
  console.log("🌱 Iniciando seed de perfiles de talento...\n");

  for (const talent of mockTalents) {
    try {
      // 1. Crear usuario auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: talent.email,
        password: "CastingfyDemo2025!",
        email_confirm: true,
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          console.log(`⚠️  Usuario ${talent.email} ya existe, saltando...`);
          continue;
        }
        throw authError;
      }

      const userId = authData.user.id;

      // 2. Crear registro en users
      const { error: userError } = await supabase.from("users").insert({
        id: userId,
        email: talent.email,
        role: "talento",
        status: "verified",
      });

      if (userError && !userError.message.includes("duplicate")) {
        throw userError;
      }

      // 3. Crear perfil de talento
      const { error: profileError } = await supabase.from("talent_profiles").upsert({
        user_id: userId,
        stage_name: talent.stageName,
        location: talent.location,
        age: talent.age,
        gender: talent.gender,
        height: talent.height,
        bio: talent.bio,
        headshot_url: talent.headshotUrl,
        languages: talent.languages,
        skills: talent.skills,
      }, {
        onConflict: 'user_id'
      });

      if (profileError) {
        throw profileError;
      }

      console.log(`✅ Creado: ${talent.stageName} (${talent.email})`);
    } catch (error) {
      console.error(`❌ Error creando ${talent.email}:`, error);
    }
  }

  console.log("\n🎉 Seed completado!");
  console.log(`📊 Total intentados: ${mockTalents.length}`);
  console.log("\n🔑 Credenciales de prueba:");
  console.log("   Email: cualquiera de los arriba");
  console.log("   Password: CastingfyDemo2025!");
}

seedTalents();
