import { useInView } from "motion/react";
import { useRef } from "react";
import { motion } from "motion/react";
import { slideUp } from "../../lib/animations";
import type { BrandKit } from "../../types/types";
import NewBrandKitButton from "./BrandKitButton";

type TabBrandKitProps = {
  brandKit: BrandKit | null;
  clientId: string;
  clientName: string;
  onBrandKitSaved?: (data: any) => void;
};

function SectionReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      variants={slideUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
}

export default function TabBrandKit({ brandKit, clientId, clientName, onBrandKitSaved }: TabBrandKitProps) {
  if (!brandKit) {
    return (
      <motion.div
        variants={slideUp}
        initial={false}
        animate="visible"
        className="flex flex-col items-center justify-center py-20 gap-6"
      >
        <div className="text-center font-body text-body-sm text-steel-gray">
          Este cliente no tiene brand kit todavía.
        </div>
        <NewBrandKitButton
          clientId={clientId}
          clientName={clientName}
          isEdit={false}
          text={"Crear BrandKit"}
          onSuccess={onBrandKitSaved}
        />
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <motion.div
        variants={slideUp}
        initial={false}
        animate="visible"
        className="flex justify-end w-full"
      >
        <NewBrandKitButton
          clientId={clientId}
          clientName={clientName}
          brandKit={brandKit}
          isEdit={true}
          text={"Editar brand kit"}
          onSuccess={onBrandKitSaved}
        />
      </motion.div>

      <SectionReveal>
        <div className="bg-white border border-ash-gray rounded-md p-6 md:p-8 flex flex-col w-full">
          <h2 className="font-display font-bold text-[24px] text-midnight-ink leading-none tracking-tight mb-8">
            Paleta de colores
          </h2>
          <div className="flex flex-row gap-8 flex-wrap">
            {brandKit.colors.map((color) => (
              <div key={color.hex} className="flex flex-col items-center gap-2">
                <div
                  className="w-16 h-16 rounded-full"
                  style={{ background: color.hex }}
                />
                <span className="font-body font-bold text-[12px] text-midnight-ink mt-2 leading-none">
                  {color.name}
                </span>
                <span className="font-body text-[11px] text-steel-gray leading-none uppercase">
                  {color.hex}
                </span>
              </div>
            ))}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal>
        <div className="bg-white border border-ash-gray rounded-md p-6 md:p-8 flex flex-col w-full">
          <h2 className="font-display font-bold text-[24px] text-midnight-ink leading-none tracking-tight mb-8">
            Tipografías
          </h2>
          <div className="flex flex-col gap-4">
            {brandKit.fonts.map((font) => (
              <div
                key={font.name}
                className="flex items-center gap-6 p-4 border border-ash-gray rounded-md"
              >
                <span className="font-serif text-[32px] text-midnight-ink leading-none w-12 text-center">
                  Aa
                </span>
                <div className="flex flex-col gap-1.5 flex-1 justify-center">
                  <span className="font-body font-bold text-[16px] text-midnight-ink leading-none">
                    {font.name}
                  </span>
                  <span className="px-2 py-1 bg-midnight-ink text-white text-[10px] font-bold rounded-full uppercase tracking-wider self-start leading-none">
                    {font.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionReveal>

      {brandKit.assets_links.length > 0 && (
        <SectionReveal>
          <div className="bg-white border border-ash-gray rounded-md p-6 md:p-8 flex flex-col w-full">
            <h2 className="font-display font-bold text-[24px] text-midnight-ink leading-none tracking-tight mb-8">
              Links de assets
            </h2>
            <div className="flex flex-col gap-4">
              {brandKit.assets_links.map((link) => (
                <div
                  key={link.url}
                  className="flex items-center justify-between p-4 border border-ash-gray rounded-md hover:bg-canvas-white transition-colors group cursor-pointer"
                >
                  <span className="font-body font-medium text-[14px] text-midnight-ink leading-none">
                    {link.label}
                  </span>
                  <span className="text-steel-gray text-[14px] leading-none opacity-0 group-hover:opacity-100 transition-opacity">
                    ↗
                  </span>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>
      )}

      {brandKit.notes && (
        <SectionReveal>
          <div className="bg-white border border-ash-gray rounded-md p-6 md:p-8 flex flex-col w-full">
            <h2 className="font-display font-bold text-[24px] text-midnight-ink leading-none tracking-tight mb-6">
              Notas de estilo
            </h2>
            <div className="font-body text-[14px] font-medium text-iron leading-relaxed">
              {brandKit.notes}
            </div>
          </div>
        </SectionReveal>
      )}
    </div>
  );
}
