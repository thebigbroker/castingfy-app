import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET: Obtener mensajes de una conversación
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const conversationId = searchParams.get("conversationId");

  if (!conversationId) {
    return NextResponse.json(
      { error: "conversationId is required" },
      { status: 400 }
    );
  }

  // Verificar que el usuario participa en la conversación
  const { data: conversation } = await supabase
    .from("conversations")
    .select("user1_id, user2_id")
    .eq("id", conversationId)
    .single();

  if (
    !conversation ||
    (conversation.user1_id !== user.id && conversation.user2_id !== user.id)
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Obtener mensajes
  const { data: messages, error } = await supabase
    .from("messages")
    .select("id, content, sender_id, is_read, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Marcar mensajes como leídos
  await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("conversation_id", conversationId)
    .neq("sender_id", user.id)
    .eq("is_read", false);

  return NextResponse.json({ messages: messages || [] });
}

// POST: Enviar un mensaje
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { conversationId, content } = body;

  if (!conversationId || !content?.trim()) {
    return NextResponse.json(
      { error: "conversationId and content are required" },
      { status: 400 }
    );
  }

  // Verificar que el usuario participa en la conversación
  const { data: conversation } = await supabase
    .from("conversations")
    .select("user1_id, user2_id")
    .eq("id", conversationId)
    .single();

  if (
    !conversation ||
    (conversation.user1_id !== user.id && conversation.user2_id !== user.id)
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Crear mensaje
  const { data: message, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: content.trim(),
    })
    .select("id, content, sender_id, is_read, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message });
}
