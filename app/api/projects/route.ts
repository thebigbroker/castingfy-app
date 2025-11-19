import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET: Obtener proyectos del usuario
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: projects, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Map database fields to frontend format for each project
    const mappedProjects = projects?.map((project) => ({
      id: project.id,
      title: project.title,
      type: project.project_type,
      description: project.description,
      project_type: project.project_type, // Keep for backward compatibility
      status: project.status,
      budget_range: project.budget_range,
      start_date: project.start_date,
      end_date: project.end_date,
      location: project.location,
      created_at: project.created_at,
      // Wizard fields
      unionStatus: project.union_status || "",
      datesAndLocations: project.dates_and_locations || "",
      hireFrom: project.hire_from || "",
      hasSpecialInstructions: project.has_special_instructions || false,
      specialInstructions: project.special_instructions || "",
      materials: project.materials || { media: [], texts: [] },
      roles: project.roles || [],
      compensation: project.compensation || { byRole: {} },
      prescreens: project.prescreens || {
        questions: [],
        mediaRequirements: [],
        auditionInstructions: "",
      },
      meta: project.meta || {},
    })) || [];

    return NextResponse.json({ projects: mappedProjects });
  } catch (error) {
    console.error("[Projects] Error:", error);
    return NextResponse.json(
      { error: "Error fetching projects" },
      { status: 500 }
    );
  }
}

// POST: Crear nuevo proyecto
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (!body.title) {
    return NextResponse.json(
      { error: "Title is required" },
      { status: 400 }
    );
  }

  try {
    const { data: newProject, error } = await supabase
      .from("projects")
      .insert({
        user_id: user.id,
        title: body.title,
        description: body.description || "",
        project_type: body.type || "",
        union_status: body.unionStatus || "",
        dates_and_locations: body.datesAndLocations || "",
        hire_from: body.hireFrom || "",
        has_special_instructions: body.hasSpecialInstructions || false,
        special_instructions: body.specialInstructions || "",
        materials: body.materials || { media: [], texts: [] },
        roles: body.roles || [],
        compensation: body.compensation || { byRole: {} },
        prescreens: body.prescreens || {
          questions: [],
          mediaRequirements: [],
          auditionInstructions: "",
        },
        meta: body.meta || {},
        status: "draft",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ project: newProject });
  } catch (error) {
    console.error("[Projects] Error:", error);
    return NextResponse.json(
      { error: "Error creating project" },
      { status: 500 }
    );
  }
}

// PATCH: Actualizar proyecto
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { projectId, id, ...data } = body;
  const actualProjectId = projectId || id;

  if (!actualProjectId) {
    return NextResponse.json(
      { error: "projectId is required" },
      { status: 400 }
    );
  }

  // Map the data to database fields
  const updates: Record<string, unknown> = {};
  if (data.title !== undefined) updates.title = data.title;
  if (data.description !== undefined) updates.description = data.description;
  if (data.type !== undefined) updates.project_type = data.type;
  if (data.unionStatus !== undefined) updates.union_status = data.unionStatus;
  if (data.datesAndLocations !== undefined)
    updates.dates_and_locations = data.datesAndLocations;
  if (data.hireFrom !== undefined) updates.hire_from = data.hireFrom;
  if (data.hasSpecialInstructions !== undefined)
    updates.has_special_instructions = data.hasSpecialInstructions;
  if (data.specialInstructions !== undefined)
    updates.special_instructions = data.specialInstructions;
  if (data.materials !== undefined) updates.materials = data.materials;
  if (data.roles !== undefined) updates.roles = data.roles;
  if (data.compensation !== undefined) updates.compensation = data.compensation;
  if (data.prescreens !== undefined) updates.prescreens = data.prescreens;
  if (data.meta !== undefined) updates.meta = data.meta;
  if (data.status !== undefined) updates.status = data.status;

  try {
    const { data: updatedProject, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", actualProjectId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ project: updatedProject });
  } catch (error) {
    console.error("[Projects] Error:", error);
    return NextResponse.json(
      { error: "Error updating project" },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar proyecto
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json(
      { error: "projectId is required" },
      { status: 400 }
    );
  }

  try {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId)
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Projects] Error:", error);
    return NextResponse.json(
      { error: "Error deleting project" },
      { status: 500 }
    );
  }
}
