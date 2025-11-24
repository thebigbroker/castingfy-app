import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET - Fetch gallery images for a user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId parameter is required" },
        { status: 400 }
      );
    }

    const { data: images, error } = await supabase
      .from("gallery_images")
      .select("*")
      .eq("user_id", userId)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching gallery images:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ images: images || [] });
  } catch (error) {
    console.error("Error in gallery GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new gallery image
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { image_url, title, description, display_order, is_cover } = body;

    if (!image_url) {
      return NextResponse.json(
        { error: "image_url is required" },
        { status: 400 }
      );
    }

    // If this is set as cover, unset all other covers
    if (is_cover) {
      await supabase
        .from("gallery_images")
        .update({ is_cover: false })
        .eq("user_id", user.id)
        .eq("is_cover", true);
    }

    const { data: newImage, error } = await supabase
      .from("gallery_images")
      .insert([
        {
          user_id: user.id,
          image_url,
          title: title || null,
          description: description || null,
          display_order: display_order || 0,
          is_cover: is_cover || false,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating gallery image:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ image: newImage });
  } catch (error) {
    console.error("Error in gallery POST:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH - Update a gallery image
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { imageId, title, description, display_order, is_cover } = body;

    if (!imageId) {
      return NextResponse.json(
        { error: "imageId is required" },
        { status: 400 }
      );
    }

    // If this is set as cover, unset all other covers
    if (is_cover) {
      await supabase
        .from("gallery_images")
        .update({ is_cover: false })
        .eq("user_id", user.id)
        .eq("is_cover", true)
        .neq("id", imageId);
    }

    const updates: Record<string, unknown> = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (display_order !== undefined) updates.display_order = display_order;
    if (is_cover !== undefined) updates.is_cover = is_cover;

    const { data: updatedImage, error } = await supabase
      .from("gallery_images")
      .update(updates)
      .eq("id", imageId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating gallery image:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ image: updatedImage });
  } catch (error) {
    console.error("Error in gallery PATCH:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a gallery image
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const imageId = searchParams.get("imageId");

    if (!imageId) {
      return NextResponse.json(
        { error: "imageId parameter is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("gallery_images")
      .delete()
      .eq("id", imageId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting gallery image:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in gallery DELETE:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
