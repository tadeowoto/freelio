import { useState } from "react";
import TabInfo from "./TabInfo";
import TabBrandKit from "./TabBrandKit";
import TabEventos from "./TabEventos";
import type { Client, BrandKit, Tab, Event } from "../../types/types";

interface Props {
  client: Client;
  brandKit: BrandKit | null;
  events: Event[];
}

export default function ClientTabs({ client, brandKit, events }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("info");

  const tabs: { id: Tab; label: string }[] = [
    { id: "info", label: "Info" },
    { id: "brandkit", label: "Brand Kit" },
    { id: "eventos", label: "Eventos" },
  ];

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-row gap-8 border-b border-ash-gray">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 font-body text-body-sm cursor-pointer transition-colors border-b-2 -mb-px outline-none ${
              activeTab === tab.id
                ? "font-bold text-midnight-ink border-midnight-ink"
                : "font-medium text-steel-gray border-transparent hover:text-midnight-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "info" && <TabInfo client={client} />}
      {activeTab === "brandkit" && (
        <TabBrandKit brandKit={brandKit} clientId={client.id} />
      )}
      {activeTab === "eventos" && <TabEventos events={events ?? []} />}
    </div>
  );
}
