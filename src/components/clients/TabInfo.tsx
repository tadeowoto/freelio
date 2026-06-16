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
          : client.rate_type === "por_proyecto"
            ? "/proy"
            : "";
    return `$${client.rate}${suffix}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
      <div className="bg-white border border-ash-gray rounded-md p-6 md:p-8 lg:col-span-2 flex flex-col">
        <h2 className="font-display font-bold text-[24px] text-midnight-ink leading-none tracking-tight mb-8">
          Información
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
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
            <div key={label} className="flex flex-col">
              <span className="font-body text-[11px] font-bold text-steel-gray uppercase tracking-wider mb-2 leading-none">
                {label}
              </span>
              <span className="font-body font-medium text-[14px] text-midnight-ink leading-none">
                {value || "—"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-ash-gray rounded-md p-6 md:p-8 relative overflow-hidden flex flex-col min-h-[200px]">
        <div className="absolute top-8 right-0 w-3 h-16 bg-sunset-orange mix-blend-multiply" />
        <h2 className="font-display font-bold text-[24px] text-midnight-ink leading-none tracking-tight mb-6">
          Notas
        </h2>
        <p className="font-body text-[14px] font-medium text-iron leading-relaxed">
          {client.notes || "Sin notas."}
        </p>
      </div>
    </div>
  );
}
