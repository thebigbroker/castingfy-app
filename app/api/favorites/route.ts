import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET: Obtener favoritos del usuario
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: favorites, error } = await supabase
      .from("favorites")
      .select("favorited_user_id")
      .eq("user_id", user.id);

    if (error) throw error;

    const favoriteIds = (favorites || []).map((f) => f.favorited_user_id);

    return NextResponse.json({ favorites: favoriteIds });
  } catch (error) {
    console.error("[Favorites] Error:", error);
    return NextResponse.json(
      { error: "Error fetching favorites" },
      { status: 500 }
    );
  }
}

// POST: Agregar usuario a favoritos
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { favoritedUserId } = body;

  if (!favoritedUserId) {
    return NextResponse.json(
      { error: "favoritedUserId is required" },
      { status: 400 }
    );
  }

  try {
    const { data: newFavorite, error } = await supabase
      .from("favorites")
      .insert({
        user_id: user.id,
        favorited_user_id: favoritedUserId,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ favorite: newFavorite });
  } catch (error) {
    console.error("[Favorites] Error:", error);
    return NextResponse.json(
      { error: "Error adding favorite" },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar usuario de favoritos
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const favoritedUserId = searchParams.get("favoritedUserId");

  if (!favoritedUserId) {
    return NextResponse.json(
      { error: "favoritedUserId is required" },
      { status: 400 }
    );
  }

  try {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("favorited_user_id", favoritedUserId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Favorites] Error:", error);
    return NextResponse.json(
      { error: "Error removing favorite" },
      { status: 500 }
    );
  }
}
