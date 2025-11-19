import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id: userId } = await params;

  try {
    // Get user basic info
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email, role, status")
      .eq("id", userId)
      .eq("role", "talento")
      .eq("status", "verified")
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "Talent not found" }, { status: 404 });
    }

    // Get talent profile
    const { data: profile, error: profileError } = await supabase
      .from("talent_profiles")
      .select("stage_name, bio, location, headshot_url, cover_image_url, instagram_url, imdb_url")
      .eq("user_id", userId)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // Return public data only (no sensitive info like email)
    return NextResponse.json({
      talent: {
        id: user.id,
        role: user.role,
        stageName: profile?.stage_name || user.email.split("@")[0],
        bio: profile?.bio,
        location: profile?.location,
        headshotUrl: profile?.headshot_url,
        coverImageUrl: profile?.cover_image_url,
        instagramUrl: profile?.instagram_url,
        imdbUrl: profile?.imdb_url,
      },
    });
  } catch (error) {
    console.error("[Public Talent Profile] Error:", error);
    return NextResponse.json(
      { error: "Error fetching profile" },
      { status: 500 }
    );
  }
}
