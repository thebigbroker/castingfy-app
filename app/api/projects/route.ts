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

    return NextResponse.json({ projects });
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
  const {
    title,
    description,
    projectType,
    budgetRange,
    startDate,
    endDate,
    location,
  } = body;

  if (!title) {
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
        title,
        description,
        project_type: projectType,
        budget_range: budgetRange,
        start_date: startDate,
        end_date: endDate,
        location,
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
  const { projectId, ...updates } = body;

  if (!projectId) {
    return NextResponse.json(
      { error: "projectId is required" },
      { status: 400 }
    );
  }

  try {
    const { data: updatedProject, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", projectId)
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
