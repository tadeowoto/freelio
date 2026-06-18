import type { APIRoute } from "astro";
import { createClient } from "../../../lib/supabase";

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const supabase = createClient({ request, cookies });

  const url = new URL(request.url);
  const redirectTo = `${url.origin}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
    },
  });

  if (error) return new Response(error.message, { status: 500 });

  return redirect(data.url);
};