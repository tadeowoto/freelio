import type { BrandKit } from "../../types/types";
import NewBrandKitButton from "./BrandKitButton";

type TabBrandKitProps = {
  brandKit: BrandKit | null;
  clientId: string;
};

export default function TabBrandKit({ brandKit, clientId }: TabBrandKitProps) {
  if (!brandKit) {
    return (
      <>
        <div className="text-center py-16 text-steel-gray font-body">
          Este cliente no tiene brand kit todavía.
        </div>
        <NewBrandKitButton
          clientId={clientId}
          isEdit={false}
          text={"Crear BrandKit"}
        />
      </>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <NewBrandKitButton
          clientId={clientId}
          brandKit={brandKit}
          isEdit={true}
          text={"Editar el BrandKit"}
        />
      </div>

      <div className="bg-white border border-ash-gray rounded-xl p-8 shadow-(--shadow-card)">
        <h2 className="font-sans font-bold text-(--text-subheading) tracking-subheading text-midnight-ink mb-6">
          Paleta de colores
        </h2>
        <div className="flex flex-row gap-6 flex-wrap">
          {brandKit.colors.map((color) => (
            <div key={color.hex} className="flex flex-col items-center gap-2">
              <div
                className="w-16 h-16 rounded-full border-2 border-white shadow-(--shadow-subtle)"
                style={{ background: color.hex }}
              />
              <span className="font-body font-medium text-(--text-body-sm) text-midnight-ink">
                {color.name}
              </span>
              <span className="font-body text-[11px] text-steel-gray">
                {color.hex}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-ash-gray rounded-xl p-8 shadow-(--shadow-card)">
        <h2 className="font-sans font-bold text-(--text-subheading) tracking-subheading text-midnight-ink mb-6">
          Tipografías
        </h2>
        <div className="flex flex-col gap-3">
          {brandKit.fonts.map((font) => (
            <div
              key={font.name}
              className="flex items-center gap-4 p-4 border border-ash-gray rounded-xl"
            >
              <span className="font-serif text-3xl text-midnight-ink w-12">
                Aa
              </span>
              <span className="font-body font-medium text-(--text-body) text-midnight-ink flex-1">
                {font.name}
              </span>
              <span className="px-2 py-0.5 bg-midnight-ink text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                {font.role}
              </span>
            </div>
          ))}
        </div>
      </div>

      {brandKit.assets_links.length > 0 && (
        <div className="bg-white border border-ash-gray rounded-xl p-8 shadow-(--shadow-card)">
          <h2 className="font-sans font-bold text-(--text-subheading) tracking-subheading text-midnight-ink mb-6">
            Links de assets
          </h2>
          <div className="flex flex-col gap-2">
            {brandKit.assets_links.map((link) => (
              <div
                key={link.url}
                className="flex items-center justify-between p-4 border border-ash-gray rounded-xl hover:border-composer-blue transition-colors group"
              >
                <span className="font-body font-medium text-(--text-body) text-midnight-ink">
                  {link.label}
                </span>
                <span className="text-steel-gray group-hover:text-composer-blue transition-colors">
                  Ver link
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white border border-ash-gray rounded-xl p-8 shadow-(--shadow-card)">
        <h2 className="font-sans font-bold text-(--text-subheading) tracking-subheading text-midnight-ink mb-6">
          Notas
        </h2>
        <div className="flex flex-col gap-2">
          {" "}
          <span className="text-steel-gray group-hover:text-composer-blue transition-colors">
            {brandKit.notes}
          </span>
        </div>
      </div>
    </div>
  );
}
