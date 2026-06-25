import type { Database } from "./database";

export type Tab = "info" | "brandkit" | "eventos";

export interface Color {
  name: string;
  hex: string;
}

export interface Font {
  name: string;
  role: "heading" | "body" | "accent";
  url?: string;
}

export interface AssetLink {
  label: string;
  url: string;
}

export type Client = Database["public"]["Tables"]["clients"]["Row"];

export type Event = Database["public"]["Tables"]["events"]["Row"];

export type BrandKit = Omit<
  Database["public"]["Tables"]["brand_kits"]["Row"],
  "colors" | "fonts" | "assets_links"
> & {
  colors: Color[];
  fonts: Font[];
  assets_links: AssetLink[];
};

export interface ClientWithBrandKit extends Client {
  brand_kits?: Array<{
    colors: Color[];
  }>;
}

export interface FullCalendarEvent {
  id: string;
  client_id: string;
  title: string;
  date: string;
  type: string;
  status: string;
  description: string;
  end_at: string;
  reminder?: string;
  reminder_sent?: boolean;
}

export type EventFormValues = {
  title: string;
  description?: string;
  client_id?: string;
  start_at: string;
  end_at?: string;
  reminder?: string;
  status?: string;
};
