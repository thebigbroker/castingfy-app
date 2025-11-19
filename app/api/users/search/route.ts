import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";
  const role = searchParams.get("role"); // talento, productor, null (todos)
  const limit = parseInt(searchParams.get("limit") || "20");

  // Advanced filters (only for talents)
  const gender = searchParams.get("gender") || "";
  const skillsParam = searchParams.get("skills") || "";
  const skills = skillsParam ? skillsParam.split(",").filter(Boolean) : [];
  const locationFilter = searchParams.get("location") || "";

  try {
    // Buscar usuarios (excluyendo al usuario actual)
    let usersQuery = supabase
      .from("users")
      .select("id, email, role, status")
      .neq("id", user.id)
      .eq("status", "verified")
      .limit(limit);

    // Filtrar por rol si se especifica
    if (role && (role === "talento" || role === "productor")) {
      usersQuery = usersQuery.eq("role", role);
    }

    const { data: users, error: usersError } = await usersQuery;

    if (usersError) throw usersError;

    // Para cada usuario, obtener su perfil
    const usersWithProfiles = await Promise.all(
      (users || []).map(async (foundUser) => {
        let displayName = foundUser.email.split("@")[0];
        let avatarUrl = null;
        let bio = null;
        let location = null;

        if (foundUser.role === "talento") {
          const { data: talentProfile } = await supabase
            .from("talent_profiles")
            .select("stage_name, headshot_url, bio, location, gender, skills, age")
            .eq("user_id", foundUser.id)
            .single();

          if (talentProfile) {
            displayName = talentProfile.stage_name || displayName;
            avatarUrl = talentProfile.headshot_url;
            bio = talentProfile.bio;
            location = talentProfile.location;

            // Apply advanced filters for talents
            // Gender filter
            if (gender && talentProfile.gender !== gender) {
              return null;
            }

            // Skills filter (AND logic - must have ALL selected skills)
            if (skills.length > 0) {
              const profileSkills = talentProfile.skills || [];
              const hasAllSkills = skills.every((skill) =>
                profileSkills.includes(skill)
              );
              if (!hasAllSkills) {
                return null;
              }
            }

            // Location filter (partial match, case-insensitive)
            if (
              locationFilter &&
              !talentProfile.location
                ?.toLowerCase()
                .includes(locationFilter.toLowerCase())
            ) {
              return null;
            }
          }
        } else if (foundUser.role === "productor") {
          const { data: producerProfile } = await supabase
            .from("producer_profiles")
            .select("company_name, headshot_url, bio, location")
            .eq("user_id", foundUser.id)
            .single();

          if (producerProfile) {
            displayName = producerProfile.company_name || displayName;
            avatarUrl = producerProfile.headshot_url;
            bio = producerProfile.bio;
            location = producerProfile.location;
          }
        }

        // Verificar estado de conexión con este usuario
        const { data: existingConnection } = await supabase
          .from("connections")
          .select("id, status")
          .or(
            `and(user_id.eq.${user.id},connected_user_id.eq.${foundUser.id}),and(user_id.eq.${foundUser.id},connected_user_id.eq.${user.id})`
          )
          .single();

        let connectionStatus = "none"; // none, pending, accepted, rejected
        if (existingConnection) {
          connectionStatus = existingConnection.status;
        }

        // Filtrar por búsqueda de texto si hay query
        const searchableText = `${displayName} ${bio || ""} ${location || ""}`.toLowerCase();
        if (query && !searchableText.includes(query.toLowerCase())) {
          return null;
        }

        return {
          id: foundUser.id,
          email: foundUser.email,
          role: foundUser.role,
          displayName,
          avatarUrl,
          bio,
          location,
          connectionStatus,
        };
      })
    );

    // Filtrar nulls (usuarios que no coincidieron con la búsqueda)
    const filteredUsers = usersWithProfiles.filter((u) => u !== null);

    return NextResponse.json({ users: filteredUsers });
  } catch (error) {
    console.error("[User Search] Error:", error);
    return NextResponse.json(
      { error: "Error searching users" },
      { status: 500 }
    );
  }
}
