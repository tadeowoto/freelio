export interface ClientCardInterface {
  id: string;
  name: string;
  company: string;
  status: string;
  fee: number | null;
  payment_method: "por_hora" | "por_proyecto" | "mensual" | null;
  last_contact_at: string;
  brand_kits?: Array<{
    colors: Array<{ name: string; hex: string }> | string[];
  }>;
}

export default function ClientsCard({
  client,
}: {
  client: ClientCardInterface;
}) {
  const clientColors = client.brand_kits?.[0]?.colors || [];
  const fechaContacto = client.last_contact_at
    ? client.last_contact_at.split("T")[0]
    : "--";

  return (
    <a href={`/clients/${client.id}`} className="block group w-full h-full">
      <div className="bg-white border border-ash-gray rounded-2xl p-6 flex flex-col justify-between h-full hover:bg-canvas-white/50 transition-colors cursor-pointer">
        <div className="flex flex-row justify-between items-start">
          <div className="flex flex-col">
            <h2 className="font-display font-bold text-subheading text-midnight-ink leading-none mb-1.5 group-hover:text-composer-blue transition-colors">
              {client.name}
            </h2>
            <span className="font-body text-body-sm text-iron leading-none">
              {client.company || "Sin empresa"}
            </span>
          </div>

          <span
            className={`font-body text-body-sm px-4 py-1.5 rounded-full font-medium shrink-0 ml-4 border ${
              client.status === "activo"
                ? "bg-vivid-green border-vivid-green text-white"
                : "bg-canvas-white border-ash-gray text-steel-gray"
            }`}
          >
            {client.status === "activo" ? "Activo" : "Inactivo"}
          </span>
        </div>

        <div className="flex flex-row items-center mt-6 mb-8 min-h-[32px]">
          {clientColors.length > 0 ? (
            clientColors.map((color, index) => {
              const hexColor = typeof color === "string" ? color : color.hex;
              return (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full border-2 border-white ${
                    index !== 0 ? "-ml-2" : ""
                  }`}
                  style={{ backgroundColor: hexColor }}
                />
              );
            })
          ) : (
            <span className="font-body text-body-sm text-steel-gray">
              Sin paleta asignada
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="font-body text-body-sm text-iron leading-none">
              Tarifa
            </span>
            <span className="font-display font-bold text-body text-midnight-ink leading-none">
              {client.fee !== null ? `$${client.fee}` : "--"}
              {client.payment_method === "por_hora"
                ? "/h"
                : client.payment_method === "mensual"
                  ? "/mes"
                  : client.payment_method === "por_proyecto"
                    ? "/proy"
                    : ""}
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-body text-body-sm text-iron leading-none">
              Último contacto
            </span>
            <span className="font-display font-bold text-body text-midnight-ink leading-none">
              {fechaContacto}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}
