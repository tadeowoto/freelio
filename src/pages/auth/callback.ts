import type { APIRoute } from "astro";
import { createClient } from "../../lib/supabase";

export const GET: APIRoute = async ({ url, request, cookies, redirect }) => {
  const code = url.searchParams.get("code");

  if (!code) return redirect("/auth/signin?error=no-code");

  const supabase = createClient({ request, cookies });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) return redirect("/auth/signin?error=auth-failed");

  return redirect("/dashboard");
};