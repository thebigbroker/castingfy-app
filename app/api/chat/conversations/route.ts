import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET: Obtener todas las conversaciones del usuario
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Obtener conversaciones donde el usuario participa
  const { data: conversations, error } = await supabase
    .from("conversations")
    .select(`
      id,
      user1_id,
      user2_id,
      updated_at,
      created_at
    `)
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Para cada conversación, obtener info del otro usuario y el último mensaje
  const conversationsWithDetails = await Promise.all(
    (conversations || []).map(async (conv) => {
      const otherUserId = conv.user1_id === user.id ? conv.user2_id : conv.user1_id;

      // Obtener info del otro usuario
      const { data: otherUser } = await supabase
        .from("users")
        .select("id, email, role")
        .eq("id", otherUserId)
        .single();

      // Obtener su perfil
      let otherProfile = null;
      if (otherUser?.role === "talento") {
        const { data } = await supabase
          .from("talent_profiles")
          .select("stage_name, headshot_url")
          .eq("user_id", otherUserId)
          .single();
        otherProfile = data;
      } else if (otherUser?.role === "productor") {
        const { data } = await supabase
          .from("producer_profiles")
          .select("company_name, headshot_url")
          .eq("user_id", otherUserId)
          .single();
        otherProfile = data;
      }

      // Obtener último mensaje
      const { data: lastMessage } = await supabase
        .from("messages")
        .select("content, created_at, sender_id")
        .eq("conversation_id", conv.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      // Contar mensajes no leídos
      const { count: unreadCount } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("conversation_id", conv.id)
        .eq("is_read", false)
        .neq("sender_id", user.id);

      return {
        id: conv.id,
        otherUser: {
          ...otherUser,
          displayName:
            otherProfile?.stage_name ||
            otherProfile?.company_name ||
            otherUser?.email?.split("@")[0],
          avatarUrl: otherProfile?.headshot_url,
        },
        lastMessage,
        unreadCount: unreadCount || 0,
        updatedAt: conv.updated_at,
      };
    })
  );

  return NextResponse.json({ conversations: conversationsWithDetails });
}

// POST: Crear o obtener conversación con otro usuario
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { otherUserId } = body;

  if (!otherUserId) {
    return NextResponse.json({ error: "otherUserId is required" }, { status: 400 });
  }

  // Ordenar IDs para mantener consistencia
  const [user1Id, user2Id] = [user.id, otherUserId].sort();

  // Buscar conversación existente
  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("user1_id", user1Id)
    .eq("user2_id", user2Id)
    .single();

  if (existing) {
    return NextResponse.json({ conversationId: existing.id });
  }

  // Crear nueva conversación
  const { data: newConv, error } = await supabase
    .from("conversations")
    .insert({
      user1_id: user1Id,
      user2_id: user2Id,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ conversationId: newConv.id });
}
