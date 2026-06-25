import type {APIRoute} from "astro";
import { createClient } from "../../../lib/supabase";

export const PATCH: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const supabase = createClient({ request, cookies });

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
      });
    }

    const { id, ...fields } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ error: "Se requiere el id del cliente" }),
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("clients")
      .update(fields)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;    

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};