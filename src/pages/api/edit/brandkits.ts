import type { APIRoute } from "astro";
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

    const { id, client_id, ...fields } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ error: "Se requiere el id del brand kit" }),
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("brand_kits")
      .update(fields)
      .eq("id", id)
      .eq("client_id", client_id)
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
