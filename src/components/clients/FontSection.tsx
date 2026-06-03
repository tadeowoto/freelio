import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import type { UseFormRegister } from "react-hook-form";
import type { Font } from "../../types/types";

type FontSectionProps = {
  fields: (Font & { id: string })[];
  register: UseFormRegister<any>;
  onAdd: (name: string, role: "heading" | "body" | "accent") => void;
  onRemove: (index: number) => void;
};

export default function FontSection({
  fields,
  register,
  onAdd,
  onRemove,
}: FontSectionProps) {
  const [fontName, setFontName] = useState("");
  const [fontRole, setFontRole] = useState<"heading" | "body" | "accent">(
    "body",
  );

  const handleAddClick = () => {
    onAdd(fontName, fontRole);
    setFontName("");
    setFontRole("body");
  };

  return (
    <div className="bg-white border border-ash-gray rounded-xl p-6 shadow-(--shadow-card) flex flex-col gap-4">
      <h2 className="font-sans font-bold text-base text-midnight-ink">
        Tipografías
      </h2>

      {fields.length > 0 && (
        <div className="flex flex-col gap-2.5">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-center justify-between p-3 border border-ash-gray rounded-xl bg-white font-body group hover:border-steel-gray transition-colors"
            >
              <input type="hidden" {...register(`fonts.${index}.name`)} />
              <input type="hidden" {...register(`fonts.${index}.role`)} />
              <input type="hidden" {...register(`fonts.${index}.url`)} />

              <div className="flex items-center gap-4">
                <span className="font-serif text-2xl text-midnight-ink font-semibold select-none">
                  Aa
                </span>
                <div className="flex flex-col">
                  <span className="text-midnight-ink font-medium text-(--text-body-sm)">
                    {field.name}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-steel-gray mt-0.5">
                    {field.role}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="w-8 h-8 flex items-center justify-center text-steel-gray hover:text-action-red rounded-md hover:bg-canvas-white transition-colors cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="font-body text-[11px] font-bold text-steel-gray uppercase tracking-wider">
            Nombre de la fuente
          </label>
          <input
            type="text"
            placeholder="Ej. Playfair Display"
            value={fontName}
            onChange={(e) => setFontName(e.target.value)}
            className="border border-ash-gray rounded-md h-10 px-3 font-body text-(--text-body-sm) outline-none focus:border-composer-blue transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-body text-[11px] font-bold text-steel-gray uppercase tracking-wider">
            Rol
          </label>
          <div className="flex flex-row gap-2">
            {(["heading", "body", "accent"] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setFontRole(role)}
                className={`px-4 h-8 flex items-center justify-center font-body font-medium text-(--text-body-sm) rounded-full cursor-pointer transition-colors uppercase tracking-wider text-[10px] ${
                  fontRole === role
                    ? "bg-midnight-ink text-white"
                    : "bg-white border border-ash-gray text-graphite hover:bg-canvas-white"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddClick}
          className="h-10 px-4 bg-composer-blue text-white rounded-md font-sans font-medium text-(--text-body-sm) self-start mt-1 cursor-pointer hover:opacity-90"
        >
          + Añadir tipografía
        </button>
      </div>
    </div>
  );
}
