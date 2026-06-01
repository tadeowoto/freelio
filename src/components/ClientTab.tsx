import { useState } from "react";
import TabInfo from "./TabInfo";
import TabBrandKit from "./TabBrandKit";
import TabEventos from "./TabEventos";
import type { Client, BrandKit, Tab } from "../types/types";

interface Props {
  client: Client;
  brandKit: BrandKit | null;
}

export default function ClientTabs({ client, brandKit }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("info");

  const tabs: { id: Tab; label: string }[] = [
    { id: "info", label: "Info" },
    { id: "brandkit", label: "Brand Kit" },
    { id: "eventos", label: "Eventos" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row gap-6 border-b border-ash-gray/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 font-body text-(--text-body-sm) cursor-pointer transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? "font-semibold text-midnight-ink border-midnight-ink"
                : "font-medium text-steel-gray border-transparent hover:text-graphite"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "info" && <TabInfo client={client} />}
      {activeTab === "brandkit" && <TabBrandKit brandKit={brandKit} />}
      {activeTab === "eventos" && <TabEventos clientId={client.id} />}
    </div>
  );
}
