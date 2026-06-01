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
  colors: Color[];
  fonts: Font[];
  style_notes: string | null;
  assets_links: AssetLink[];
}

export interface Client {
  id: string;
  name: string;
  company: string | null;
  industry: string | null;
  email: string | null;
  phone: string | null;
  rate: number | null;
  rate_type: string | null;
  payment_status: string | null;
  last_contact_at: string | null;
  notes: string | null;
  status: string;
}
