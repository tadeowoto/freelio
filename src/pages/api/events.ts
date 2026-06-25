import type { APIRoute } from "astro";
import { createClient } from "../../lib/supabase";

export const POST: APIRoute = async ({ request, cookies }) => {
    try {
        const body = await request.json();
        const supabase = createClient({ request, cookies });    

        const { data: { user } } = await supabase.auth.getUser();    
        if (!user) {
            return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
        }
    
        const { data, error } = await supabase
            .from("events")
            .insert({
                ...body,
                user_id: user.id
            })
            .select()
            .single();
    
        if (error) throw error;
    
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        return new Response(JSON.stringify({ error: message }), { status: 500 });
    }
};