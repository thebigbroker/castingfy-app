import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET: Obtener un proyecto específico por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: project, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (error) throw error;

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Map database fields to frontend format
    const mappedProject = {
      id: project.id,
      title: project.title,
      type: project.project_type,
      description: project.description,
      unionStatus: project.union_status,
      datesAndLocations: project.dates_and_locations,
      hireFrom: project.hire_from,
      hasSpecialInstructions: project.has_special_instructions,
      specialInstructions: project.special_instructions,
      materials: project.materials || { media: [], texts: [] },
      roles: project.roles || [],
      compensation: project.compensation || { byRole: {} },
      prescreens: project.prescreens || {
        questions: [],
        mediaRequirements: [],
        auditionInstructions: "",
      },
      meta: project.meta || {},
      status: project.status,
      createdAt: project.created_at,
      updatedAt: project.updated_at,
    };

    return NextResponse.json({ project: mappedProject });
  } catch (error) {
    console.error("[Project] Error:", error);
    return NextResponse.json(
      { error: "Error fetching project" },
      { status: 500 }
    );
  }
}
