import { useState } from "react";
import { AnimatePresence } from "motion/react";
import ClientsList from "./ClientsList";
import NewClientFormModal from "./NewClientFormModal";
import type { Client, ClientWithBrandKit } from "../../types/types";

export default function ClientsPage({
  clients: initialClients,
}: {
  clients: ClientWithBrandKit[];
}) {
  const [clients, setClients] = useState(initialClients);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClientCreated = (newClient: Client) => {
    setClients((prev) => [{ ...newClient, brand_kits: [] }, ...prev]);
  };

  return (
    <div className="w-full flex flex-col gap-10 mt-10">
      <div className="w-full flex flex-row items-center justify-between">
        <h1 className="font-display font-bold text-heading md:text-[80px] tracking-tighter text-midnight-ink leading-none title-fade-in">
          Clientes
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="h-10 px-6 flex items-center gap-2 bg-sunset-orange border-none rounded-sm font-sans font-medium text-(--text-body) cursor-pointer hover:opacity-90 transition-opacity"
        >
          <span className="text-xl font-bold">+</span> Nuevo cliente
        </button>
      </div>

      <ClientsList clients={clients} />

      <AnimatePresence>
        {isModalOpen && (
          <NewClientFormModal
            onClose={() => setIsModalOpen(false)}
            isOpenModal={isModalOpen}
            onSuccess={handleClientCreated}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
