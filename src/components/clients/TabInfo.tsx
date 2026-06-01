interface Client {
  id: string;
  name: string;
  company: string | null;
  industry: string | null;
  email: string | null;
  phone: string | null;
  rate: number | null;
  rate_type: string | null;
  payment_status: string | null;
  last_contact_at: string | null;
  notes: string | null;
  status: string;
}

export default function TabInfo({ client }: { client: Client }) {
  const formatRate = () => {
    if (!client.rate) return "—";
    const suffix =
      client.rate_type === "por_hora"
        ? "/h"
        : client.rate_type === "mensual"
          ? "/mes"
          : "";
    return `$${client.rate}${suffix}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <div className="bg-white border border-ash-gray rounded-xl p-8 shadow-(--shadow-card) lg:col-span-2">
        <h2 className="font-sans font-bold text-(--text-subheading) tracking-subheading text-midnight-ink mb-6">
          Información
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
          {[
            { label: "Empresa", value: client.company },
            { label: "Industria / Disciplina", value: client.industry },
            { label: "Email", value: client.email },
            { label: "Teléfono", value: client.phone },
            { label: "Tarifa", value: formatRate() },
            {
              label: "Estado de cobro",
              value:
                client.payment_status === "cobrado" ? "Al día" : "Pendiente",
            },
            {
              label: "Último contacto",
              value: client.last_contact_at
                ? new Date(client.last_contact_at).toLocaleDateString("es-AR")
                : "—",
            },
          ].map(({ label, value }) => (
            <div key={label}>
              <span className="block font-body text-[11px] font-bold text-steel-gray uppercase tracking-wider">
                {label}
              </span>
              <span className="block font-sans font-medium text-graphite text-(--text-body) mt-1">
                {value || "—"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-ash-gray rounded-xl p-8 shadow-(--shadow-card) relative overflow-hidden">
        <div className="absolute top-4 right-0 w-3 h-16 bg-hot-pink/90 rounded-l-sm" />
        <h2 className="font-sans font-bold text-(--text-subheading) tracking-subheading text-midnight-ink mb-4">
          Notas
        </h2>
        <p className="font-body text-(--text-body) text-graphite">
          {client.notes || "Sin notas."}
        </p>
      </div>
    </div>
  );
}
