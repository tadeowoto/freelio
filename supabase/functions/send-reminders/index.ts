// @ts-nocheck — Archivo ejecutado en Deno, no en el toolchain de Astro/TS
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface EventWithRelations {
  id: string;
  title: string;
  start_at: string;
  description: string | null;
  client_id: string | null;
  user_id: string;
  clients: { email: string | null; name: string } | null;
  profiles: { full_name: string } | null;
}

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;

Deno.serve(async () => {
  const now = new Date().toISOString();

  const { data: events, error } = await supabase
    .from("events")
    .select(`
      id,
      title,
      start_at,
      description,
      client_id,
      user_id,
      clients (email, name),
      profiles!events_user_id_fkey (full_name)
    `)
    .eq("reminder_sent", false)
    .not("reminder", "is", null)
    .lte("reminder", now);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!events?.length) {
    return new Response("Sin recordatorios pendientes", { status: 200 });
  }

  const results: { id: string; status: string; detail?: unknown }[] = [];

  for (const raw of events) {
    const event = raw as unknown as EventWithRelations;
    const client = event.clients;
    const profile = event.profiles;

    const clientName = client?.name ?? "Sin cliente";
    const recipientEmail = client?.email ?? "tadeo.woto@gmail.com";

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: recipientEmail,
        subject: `Recordatorio: ${event.title}`,
        html: `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f7f7f7;font-family:'Inter',ui-sans-serif,system-ui,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f7f7;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

          <tr>
            <td style="background-color:#000000;border-radius:6px 6px 0 0;padding:24px 32px;position:relative;overflow:hidden;">
              <div style="position:absolute;top:0;right:40px;width:60px;height:100%;background-color:#ff5500;opacity:0.9;"></div>
              <div style="position:absolute;top:0;right:100px;width:20px;height:100%;background-color:#1ec072;opacity:0.7;"></div>
              <p style="margin:0;font-family:'Inter',ui-sans-serif,system-ui,sans-serif;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;position:relative;z-index:1;">
                Freelio
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color:#ffffff;padding:32px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">

              <p style="margin:0 0 8px 0;font-size:14px;color:#bec6cc;letter-spacing:0.224px;">
                Recordatorio
              </p>
              <h1 style="margin:0 0 24px 0;font-size:36px;font-weight:700;color:#000000;letter-spacing:0.225px;line-height:1.25;">
                Hola, ${profile?.full_name ?? ""}
              </h1>

              <p style="margin:0 0 24px 0;font-size:16px;color:#101516;line-height:1.43;letter-spacing:0.4px;">
                Te recordamos que tenés un evento pr\u00f3ximamente.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f7f7;border-radius:6px;border-left:3px solid #ff5500;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 4px 0;font-size:14px;color:#bec6cc;letter-spacing:0.224px;">Evento</p>
                    <h2 style="margin:0 0 16px 0;font-size:24px;font-weight:700;color:#000000;letter-spacing:0.24px;line-height:1.33;">
                      ${event.title}
                    </h2>

                    <p style="margin:0 0 4px 0;font-size:14px;color:#bec6cc;letter-spacing:0.224px;">Fecha</p>
                    <p style="margin:0 0 16px 0;font-size:16px;font-weight:500;color:#101516;letter-spacing:0.4px;">
                      ${new Date(event.start_at).toLocaleString("es-AR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                    ${event.description ? `
                    <p style="margin:0 0 4px 0;font-size:14px;color:#bec6cc;letter-spacing:0.224px;">Descripci\u00f3n</p>
                    <p style="margin:0 0 16px 0;font-size:16px;color:#101516;line-height:1.43;letter-spacing:0.4px;">
                      ${event.description}
                    </p>
                    ` : ""}

                    <p style="margin:0 0 4px 0;font-size:14px;color:#bec6cc;letter-spacing:0.224px;">Cliente</p>
                    <p style="margin:0;font-size:16px;font-weight:500;color:#101516;letter-spacing:0.4px;">
                      ${clientName}
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <tr>
            <td style="background-color:#262d2f;border-radius:0 0 6px 6px;padding:20px 32px;">
              <p style="margin:0;font-size:14px;color:#bec6cc;letter-spacing:0.224px;">
                Este recordatorio fue generado autom\u00e1ticamente por Freelio.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`,
      }),
    });

    if (emailRes.ok) {
      await supabase
        .from("events")
        .update({ reminder_sent: true })
        .eq("id", event.id);

      results.push({ id: event.id, status: "enviado" });
    } else {
      const err = await emailRes.json();
      results.push({ id: event.id, status: "error", detail: err });
    }
  }

  return new Response(JSON.stringify(results), {
    headers: { "Content-Type": "application/json" },
  });
});
