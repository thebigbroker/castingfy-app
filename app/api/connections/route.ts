import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET: Obtener conexiones del usuario
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status"); // pending, accepted, rejected

  try {
    // Obtener conexiones donde el usuario es participante
    let query = supabase
      .from("connections")
      .select("*")
      .or(`user_id.eq.${user.id},connected_user_id.eq.${user.id}`)
      .order("updated_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data: connections, error } = await query;

    if (error) throw error;

    // Para cada conexión, obtener info del otro usuario
    const connectionsWithUsers = await Promise.all(
      (connections || []).map(async (conn) => {
        const otherUserId =
          conn.user_id === user.id ? conn.connected_user_id : conn.user_id;
        const isIncoming = conn.connected_user_id === user.id;

        // Obtener info del otro usuario
        const { data: otherUser } = await supabase
          .from("users")
          .select("id, email, role")
          .eq("id", otherUserId)
          .single();

        // Obtener su perfil
        let displayName = otherUser?.email?.split("@")[0] || "";
        let avatarUrl = null;
        let bio = null;
        let location = null;

        if (otherUser?.role === "talento") {
          const { data } = await supabase
            .from("talent_profiles")
            .select("stage_name, headshot_url, bio, location")
            .eq("user_id", otherUserId)
            .single();
          if (data) {
            displayName = data.stage_name || displayName;
            avatarUrl = data.headshot_url;
            bio = data.bio;
            location = data.location;
          }
        } else if (otherUser?.role === "productor") {
          const { data } = await supabase
            .from("producer_profiles")
            .select("company_name, headshot_url, bio, location")
            .eq("user_id", otherUserId)
            .single();
          if (data) {
            displayName = data.company_name || displayName;
            avatarUrl = data.headshot_url;
            bio = data.bio;
            location = data.location;
          }
        }

        return {
          id: conn.id,
          status: conn.status,
          createdAt: conn.created_at,
          updatedAt: conn.updated_at,
          isIncoming,
          otherUser: {
            ...otherUser,
            displayName,
            avatarUrl,
            bio,
            location,
          },
        };
      })
    );

    return NextResponse.json({ connections: connectionsWithUsers });
  } catch (error) {
    console.error("[Connections] Error:", error);
    return NextResponse.json(
      { error: "Error fetching connections" },
      { status: 500 }
    );
  }
}

// POST: Enviar solicitud de conexión
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { connectedUserId } = body;

  if (!connectedUserId) {
    return NextResponse.json(
      { error: "connectedUserId is required" },
      { status: 400 }
    );
  }

  try {
    // Verificar que no exista ya una conexión
    const { data: existing } = await supabase
      .from("connections")
      .select("id")
      .or(
        `and(user_id.eq.${user.id},connected_user_id.eq.${connectedUserId}),and(user_id.eq.${connectedUserId},connected_user_id.eq.${user.id})`
      )
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Connection already exists" },
        { status: 400 }
      );
    }

    // Crear nueva solicitud de conexión
    const { data: newConnection, error } = await supabase
      .from("connections")
      .insert({
        user_id: user.id,
        connected_user_id: connectedUserId,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ connection: newConnection });
  } catch (error) {
    console.error("[Connections] Error:", error);
    return NextResponse.json(
      { error: "Error creating connection" },
      { status: 500 }
    );
  }
}

// PATCH: Aceptar/Rechazar solicitud de conexión
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { connectionId, status } = body;

  if (!connectionId || !status || !["accepted", "rejected"].includes(status)) {
    return NextResponse.json(
      { error: "connectionId and valid status are required" },
      { status: 400 }
    );
  }

  try {
    // Actualizar estado de la conexión
    const { data: updatedConnection, error } = await supabase
      .from("connections")
      .update({ status })
      .eq("id", connectionId)
      .eq("connected_user_id", user.id) // Solo el receptor puede actualizar
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ connection: updatedConnection });
  } catch (error) {
    console.error("[Connections] Error:", error);
    return NextResponse.json(
      { error: "Error updating connection" },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar conexión
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const connectionId = searchParams.get("connectionId");

  if (!connectionId) {
    return NextResponse.json(
      { error: "connectionId is required" },
      { status: 400 }
    );
  }

  try {
    const { error } = await supabase
      .from("connections")
      .delete()
      .eq("id", connectionId)
      .or(`user_id.eq.${user.id},connected_user_id.eq.${user.id}`);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Connections] Error:", error);
    return NextResponse.json(
      { error: "Error deleting connection" },
      { status: 500 }
    );
  }
}
