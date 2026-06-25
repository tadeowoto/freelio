import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { slideUp, fadeIn } from "../../lib/animations";
import TabInfo from "./TabInfo";
import TabBrandKit from "./TabBrandKit";
import TabEventos from "./TabEventos";
import type { Client, BrandKit, Tab, Event } from "../../types/types";

interface Props {
  client: Client;
  brandKit: BrandKit | null;
  events: Event[];
}

export default function ClientTabs({ client, brandKit: initialBrandKit, events }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("info");
  const [currentBrandKit, setCurrentBrandKit] = useState(initialBrandKit);

  const handleBrandKitSaved = (updated: any) => {
    setCurrentBrandKit(updated);
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "info", label: "Info" },
    { id: "brandkit", label: "Brand Kit" },
    { id: "eventos", label: "Eventos" },
  ];

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-row gap-8 border-b border-ash-gray relative">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 font-body text-body-sm cursor-pointer transition-colors border-b-2 -mb-px outline-none relative ${
              activeTab === tab.id
                ? "font-bold text-midnight-ink"
                : "font-medium text-steel-gray border-transparent hover:text-midnight-ink"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-midnight-ink"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={slideUp}
          initial={false}
          animate="visible"
          exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
        >
          {activeTab === "info" && <TabInfo client={client} />}
          {activeTab === "brandkit" && (
            <TabBrandKit brandKit={currentBrandKit} clientId={client.id} clientName={client.name} onBrandKitSaved={handleBrandKitSaved} />
          )}
          {activeTab === "eventos" && <TabEventos events={events ?? []} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
