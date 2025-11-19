import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  try {
    // Intentar obtener datos de Instagram usando el endpoint público
    const response = await fetch(
      `https://www.instagram.com/${username}/?__a=1&__d=dis`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "application/json",
          "Accept-Language": "en-US,en;q=0.9",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
        },
        next: { revalidate: 3600 }, // Cache por 1 hora
      }
    );

    if (!response.ok) {
      throw new Error("Instagram API returned an error");
    }

    const data = await response.json();

    // Extraer las fotos del perfil
    const edges =
      data?.graphql?.user?.edge_owner_to_timeline_media?.edges || [];

    interface InstagramEdge {
      node: {
        id: string;
        thumbnail_src?: string;
        display_url: string;
        shortcode: string;
      };
    }

    const photos = edges.slice(0, 6).map((edge: InstagramEdge) => ({
      id: edge.node.id,
      thumbnail: edge.node.thumbnail_src || edge.node.display_url,
      url: `https://www.instagram.com/p/${edge.node.shortcode}/`,
    }));

    return NextResponse.json({
      success: true,
      photos,
      username: data?.graphql?.user?.username || username,
    });
  } catch (error) {
    console.error("Error fetching Instagram feed:", error);

    // Fallback: devolver array vacío para que el frontend use placeholders
    return NextResponse.json({
      success: false,
      photos: [],
      error: "Could not fetch Instagram photos",
    });
  }
}
