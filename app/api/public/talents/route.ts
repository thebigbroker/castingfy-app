import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "9");

    const supabase = await createClient();

    // Obtener los últimos perfiles de talento con headshots
    const { data: talents, error } = await supabase
      .from("talent_profiles")
      .select("user_id, stage_name, headshot_url, location, created_at")
      .not("headshot_url", "is", null)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching talents:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Formatear respuesta
    const formattedTalents = talents.map((talent) => ({
      id: talent.user_id,
      name: talent.stage_name,
      avatar: talent.headshot_url,
      location: talent.location,
    }));

    return NextResponse.json(
      { talents: formattedTalents },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("Error in talents API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
