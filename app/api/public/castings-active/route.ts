import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Mock data to show when no castings are available
const MOCK_CASTINGS = [
  {
    id: "mock-1",
    title: "Cortometraje 'El Último Café'",
    description: "Buscamos actores y actrices para un cortometraje dramático sobre las últimas conversaciones en un café antes de cerrar definitivamente. Rodaje en Madrid durante 5 días.",
    project_type: "Cortometraje",
    location: "Madrid, España",
    created_at: new Date().toISOString(),
    status: "published",
    compensation: {
      type: "paid",
      amount: "500€ por día",
    },
    roles: [
      {
        id: "role-1",
        name: "Camarero Principal",
        category: "Actores",
        gender: "Hombre",
        ageRange: "30-45",
        description: "Personaje principal que ha trabajado en el café toda su vida.",
      },
      {
        id: "role-2",
        name: "Cliente Nostálgico",
        category: "Actores",
        gender: "Mujer",
        ageRange: "25-35",
        description: "Cliente habitual que visita el café por última vez.",
      },
    ],
    producer: {
      company_name: "Producciones Luna",
    },
  },
  {
    id: "mock-2",
    title: "Serie Web 'Vecinos' - Temporada 2",
    description: "Casting abierto para la segunda temporada de nuestra exitosa serie web sobre la vida en un edificio de vecinos en Barcelona. Buscamos caras frescas y talento emergente.",
    project_type: "Serie Web",
    location: "Barcelona, España",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    status: "published",
    compensation: {
      type: "paid",
      amount: "300€ por episodio",
    },
    roles: [
      {
        id: "role-3",
        name: "Vecino Nuevo",
        category: "Actores",
        gender: "All Genders",
        ageRange: "20-30",
        description: "Personaje cómico que llega al edificio y genera situaciones divertidas.",
      },
      {
        id: "role-4",
        name: "Portero",
        category: "Actores",
        gender: "Hombre",
        ageRange: "45-60",
        description: "Portero del edificio, personaje secundario recurrente.",
      },
    ],
    producer: {
      company_name: "BCN Productions",
    },
  },
  {
    id: "mock-3",
    title: "Anuncio Comercial - Marca de Moda",
    description: "Importante marca de moda busca modelos para campaña de primavera/verano. Rodaje profesional en estudio y exteriores en Valencia.",
    project_type: "Publicidad",
    location: "Valencia, España",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    status: "published",
    compensation: {
      type: "paid",
      amount: "800€ por día",
    },
    roles: [
      {
        id: "role-5",
        name: "Modelo Principal",
        category: "Modelos",
        gender: "Mujer",
        ageRange: "18-28",
        description: "Modelo principal para la campaña. Experiencia en moda requerida.",
      },
      {
        id: "role-6",
        name: "Modelo Masculino",
        category: "Modelos",
        gender: "Hombre",
        ageRange: "20-30",
        description: "Modelo masculino para escenas de pareja.",
      },
    ],
    producer: {
      company_name: "Fashion Films SL",
    },
  },
  {
    id: "mock-4",
    title: "Largometraje 'Caminos Cruzados'",
    description: "Largometraje independiente sobre tres historias que se entrelazan en Sevilla. Proyecto de bajo presupuesto con distribución en festivales internacionales asegurada.",
    project_type: "Largometraje",
    location: "Sevilla, España",
    created_at: new Date(Date.now() - 259200000).toISOString(),
    status: "published",
    compensation: {
      type: "revenue_share",
      details: "Participación en beneficios + dietas",
    },
    roles: [
      {
        id: "role-7",
        name: "Protagonista Historia 1",
        category: "Actores",
        gender: "Mujer",
        ageRange: "25-35",
        description: "Protagonista de una de las tres historias principales.",
      },
      {
        id: "role-8",
        name: "Protagonista Historia 2",
        category: "Actores",
        gender: "Hombre",
        ageRange: "30-40",
        description: "Protagonista masculino de la segunda historia.",
      },
    ],
    producer: {
      company_name: "Cine Sur Producciones",
    },
  },
  {
    id: "mock-5",
    title: "Videoclip Musical - Artista Emergente",
    description: "Buscamos actores/bailarines para videoclip de artista emergente de pop urbano. Concepto visual innovador y artístico. Rodaje en un día en Madrid.",
    project_type: "Videoclip",
    location: "Madrid, España",
    created_at: new Date(Date.now() - 345600000).toISOString(),
    status: "published",
    compensation: {
      type: "paid",
      amount: "200€ + uso de imagen",
    },
    roles: [
      {
        id: "role-9",
        name: "Bailarín/Actor Principal",
        category: "Bailarines",
        gender: "All Genders",
        ageRange: "18-30",
        description: "Debe saber bailar estilos urbanos. Actuación secundaria.",
      },
      {
        id: "role-10",
        name: "Extras Bailarines",
        category: "Bailarines",
        gender: "All Genders",
        ageRange: "18-35",
        description: "Grupo de bailarines para coreografías grupales.",
      },
    ],
    producer: {
      company_name: "Urban Vision Records",
    },
  },
];

export async function GET() {
  try {
    const supabase = await createClient();

    // Get all published projects with their roles and producer info
    const { data: projects, error } = await supabase
      .from("projects")
      .select(
        `
        id,
        title,
        description,
        project_type,
        location,
        created_at,
        status,
        roles,
        compensation,
        user_id,
        producer_profiles!inner(company_name)
      `
      )
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching castings:", error);
      // Return mock data on error
      return NextResponse.json({
        castings: MOCK_CASTINGS,
        isMockData: true,
        count: MOCK_CASTINGS.length,
      });
    }

    // If no projects found, return mock data
    if (!projects || projects.length === 0) {
      return NextResponse.json({
        castings: MOCK_CASTINGS,
        isMockData: true,
        count: MOCK_CASTINGS.length,
      });
    }

    // Transform the data to match the expected format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const castings = projects.map((project: any) => ({
      id: project.id,
      title: project.title,
      description: project.description,
      project_type: project.project_type,
      location: project.location,
      created_at: project.created_at,
      status: project.status,
      roles: project.roles || [],
      compensation: project.compensation,
      producer: {
        company_name: project.producer_profiles?.company_name || "Productor",
      },
    }));

    return NextResponse.json({
      castings,
      isMockData: false,
      count: castings.length,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({
      castings: MOCK_CASTINGS,
      isMockData: true,
      count: MOCK_CASTINGS.length,
    });
  }
}
