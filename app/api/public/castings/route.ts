import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  try {
    // Fetch all published projects with producer info
    const { data: projects, error } = await supabase
      .from("projects")
      .select(`
        *,
        users!projects_user_id_fkey (
          id,
          email,
          role
        ),
        producer_profiles!inner (
          company_name,
          location
        )
      `)
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Map to public-safe format
    const publicProjects = projects?.map((project) => ({
      id: project.id,
      title: project.title,
      description: project.description,
      projectType: project.project_type,
      location: project.location || project.producer_profiles?.[0]?.location,
      startDate: project.start_date,
      endDate: project.end_date,
      createdAt: project.created_at,
      roles: project.roles || [],
      compensation: project.compensation,
      unionStatus: project.union_status,
      producer: {
        id: project.users?.id,
        companyName: project.producer_profiles?.[0]?.company_name || "Production Company",
        location: project.producer_profiles?.[0]?.location,
      },
    })) || [];

    return NextResponse.json({ castings: publicProjects });
  } catch (error) {
    console.error("[Public Castings] Error:", error);
    return NextResponse.json(
      { error: "Error fetching castings" },
      { status: 500 }
    );
  }
}
