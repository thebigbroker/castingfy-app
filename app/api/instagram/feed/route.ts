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
    console.log(`[Instagram Feed] Fetching data for username: ${username}`);

    // Método alternativo: obtener el HTML y parsearlo
    const response = await fetch(`https://www.instagram.com/${username}/`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      next: { revalidate: 3600 }, // Cache por 1 hora
    });

    console.log(`[Instagram Feed] Response status: ${response.status}`);

    if (!response.ok) {
      console.error(
        `[Instagram Feed] Instagram error: ${response.status} ${response.statusText}`
      );
      throw new Error("Instagram returned an error");
    }

    const html = await response.text();

    // Buscar el script tag con los datos JSON
    const scriptMatch = html.match(
      /<script type="application\/ld\+json">({.*?})<\/script>/
    );

    if (!scriptMatch) {
      // Intentar extraer datos del script window._sharedData
      const sharedDataMatch = html.match(/window\._sharedData = ({.*?});/);

      if (sharedDataMatch) {
        const sharedData = JSON.parse(sharedDataMatch[1]);
        const user =
          sharedData?.entry_data?.ProfilePage?.[0]?.graphql?.user;

        if (user?.edge_owner_to_timeline_media?.edges) {
          const edges = user.edge_owner_to_timeline_media.edges;

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

          console.log(`[Instagram Feed] Found ${photos.length} photos via sharedData`);

          return NextResponse.json({
            success: true,
            photos,
            username: user.username || username,
          });
        }
      }

      console.warn("[Instagram Feed] Could not find Instagram data in HTML");
      throw new Error("Could not extract Instagram data");
    }

    // El JSON-LD no siempre tiene las fotos, así que devolvemos placeholder
    console.log("[Instagram Feed] Instagram has blocked API access");

    return NextResponse.json({
      success: false,
      photos: [],
      error: "Instagram API blocked",
    });
  } catch (error) {
    console.error("[Instagram Feed] Error fetching Instagram feed:", error);

    // Fallback: devolver array vacío para que el frontend use placeholders
    return NextResponse.json({
      success: false,
      photos: [],
      error: "Could not fetch Instagram photos",
    });
  }
}
