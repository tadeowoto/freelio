interface Client {
  id: string;
  name: string;
  company: string;
  status: string;
  rate: number;
  rate_type: "por_hora" | "por_proyecto" | "mensual";
  last_contact_at: string;
  brand_kits?: {
    colors: Array<{ name: string; hex: string }> | string[];
  };
}

export default function ClientsCard({ client }: { client: Client }) {
  const clientColors = client.brand_kits?.colors || [];

  return (
    <a href={`/clients/${client.id}`} className="block group">
      <div className="bg-white border border-ash-gray rounded-xl p-6 shadow-(--shadow-card) flex flex-col justify-between min-h-[200px] transition-transform duration-150 hover:scale-[1.01]">
        <div className="flex flex-row justify-between items-start">
          <div className="flex flex-col">
            <h2 className="font-sans font-bold text-(--text-subheading) tracking-subheading text-midnight-ink">
              {client.name}
            </h2>
            <span className="font-body text-steel-gray mt-0.5">
              {client.company || "Sin empresa"}
            </span>
          </div>

          {client.status === "activo" ? (
            <span className="px-3 py-0.5 font-body font-medium rounded-full bg-vivid-green text-white text-(--text-body-sm)">
              Activo
            </span>
          ) : (
            <span className="px-3 py-0.5 font-body font-medium rounded-full bg-ash-gray text-steel-gray text-(--text-body-sm)">
              Inactivo
            </span>
          )}
        </div>

        <div className="flex flex-row gap-2 my-4 min-h-6">
          {clientColors.length > 0 ? (
            clientColors.map((color, index) => {
              const hexColor = typeof color === "string" ? color : color.hex;
              return (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full border border-ash-gray shadow-sm"
                  style={{ backgroundColor: hexColor }}
                />
              );
            })
          ) : (
            <span className="font-body text-[12px] text-steel-gray italic">
              Sin paleta asignada
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 border-t border-canvas-white pt-4">
          <div className="flex flex-col">
            <span className="font-body text-[12px] text-steel-gray">
              Último contacto
            </span>
            <span className="font-sans font-medium text-graphite mt-0.5 text-(--text-body-sm)">
              {client.last_contact_at}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}
