import type { APIRoute } from "astro";
import { createClient } from "../../../lib/supabase";

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const supabase = createClient({ request, cookies });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:4321/auth/callback",
    },
  });

  if (error) return new Response(error.message, { status: 500 });

  return redirect(data.url);
};