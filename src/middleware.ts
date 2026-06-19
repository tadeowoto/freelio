import { defineMiddleware } from "astro:middleware";
import { createClient } from "./lib/supabase";


const PUBLIC_ROUTES = [
  "/",
  "/api/auth/signin",  
  "/api/auth/signout",
  "/auth/callback",
];

export const onRequest = defineMiddleware(async ({ request, cookies, redirect, url }, next) => {
  if (PUBLIC_ROUTES.some(route => url.pathname.startsWith(route))) {
    return next();
  }

  const supabase = createClient({ request, cookies });
  const { data } = await supabase.auth.getUser();

  if (!data.user) return redirect("/");


  return next();
});