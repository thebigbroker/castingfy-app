import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      // Check if user exists in database
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, role")
        .eq("id", data.user.id)
        .single();

      // If user doesn't exist in our users table, create it
      if (userError || !userData) {
        await supabase.from("users").insert({
          id: data.user.id,
          email: data.user.email!,
          role: "talento", // Default role, can be changed later
          status: "verified",
        });

        // Redirect to complete profile
        return NextResponse.redirect(
          `${requestUrl.origin}/registro/completar-perfil?role=talento`
        );
      }

      // User exists, redirect to next page
      return NextResponse.redirect(`${requestUrl.origin}${next}`);
    }

    // If there's an error, log it and redirect with specific error
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=${error?.message || "auth_callback_failed"}`
    );
  }

  // No code provided
  return NextResponse.redirect(`${requestUrl.origin}/login?error=no_code`);
}
