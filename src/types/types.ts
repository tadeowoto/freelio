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

export interface BrandKit {
  id: string;
  colors: Color[];
  fonts: Font[];
  notes: string | null;
  assets_links: AssetLink[];
}

export interface Client {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  payment_status: string | null;
  payment_method: string | null;
  first_contact_at: string | null;
  last_contact_at: string | null;
  notes: string | null;
  status: string;
  fee: number | null;
  
}

export interface Event {
  id: string;
  user_id: string;
  client_id: string;
  title: string;
  description: string;
  type: string;
  start_at: Date;
  end_at: Date;
  reminder: Date;
  status: string;
}

export interface FullCalendarEvent {
  id: string;
  title: string;
  date: string;
  type: string;
  status: string;
  description: string;
  end_at: string;
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

export type EventClient = {
  title: string;
  description?: string;
  start_at: string;
  end_at?: string;
  reminder?: string;
  status?: string;
  clients: Client[];
}