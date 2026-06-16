import { useState } from "react";
import ClientsCard from "./ClientsCard";
import type { Client } from "../../types/types";


type Filter = "all" | "active" | "inactive";

const filterButtons: { label: string; value: Filter }[] = [
  { label: "Todos", value: "all" },
  { label: "Activos", value: "active" },
  { label: "Inactivos", value: "inactive" },
];

export default function ClientsList({ clients }: { clients: Client[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = clients.filter((client) => {
    if (filter === "active") return client.status === "activo";
    if (filter === "inactive") return client.status === "inactivo";
    return true;
  });

  return (
    <>
      <div className="flex flex-row items-center gap-3">
        {filterButtons.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={[
              "px-4 h-8 flex items-center justify-center font-body font-medium text-(--text-body-sm) rounded-full cursor-pointer transition-colors",
              filter === value
                ? "bg-midnight-ink text-white"
                : "text-graphite bg-white border border-ash-gray hover:bg-canvas-white",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((client) => (
          <ClientsCard key={client.id} client={client} />
        ))}
      </div>
    </>
  );
}