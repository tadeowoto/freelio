import { useState } from "react";
import { motion } from "motion/react";
import { staggerContainer, staggerItem } from "../../lib/animations";
import ClientsCard, { type ClientCardInterface } from "./ClientsCard";

type Filter = "all" | "active" | "inactive";

const filterButtons: { label: string; value: Filter }[] = [
  { label: "Todos", value: "all" },
  { label: "Activos", value: "active" },
  { label: "Inactivos", value: "inactive" },
];

export default function ClientsList({
  clients,
}: {
  clients: ClientCardInterface[];
}) {
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
            className={`px-4 h-8 flex items-center justify-center font-body font-medium text-(--text-body-sm) rounded-full cursor-pointer transition-all relative ${
              filter === value
                ? "text-white"
                : "text-graphite bg-white border border-ash-gray hover:bg-canvas-white"
            }`}
          >
            {filter === value && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 rounded-full bg-midnight-ink"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10">{label}</span>
          </button>
        ))}
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filtered.map((client) => (
          <motion.div key={client.id} variants={staggerItem} layout>
            <ClientsCard client={client} />
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
