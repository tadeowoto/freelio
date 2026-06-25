import { useState } from "react";
import type { UseFormRegister } from "react-hook-form";
import type { Color } from "../../types/types";

type ColorSectionProps = {
  fields: (Color & { id: string })[];
  register: UseFormRegister<any>;
  onAdd: (name: string, hex: string) => void;
  onRemove: (index: number) => void;
};

export default function ColorSection({
  fields,
  register,
  onAdd,
  onRemove,
}: ColorSectionProps) {
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("#1871da");

  const handleAddClick = () => {
    onAdd(colorName, colorHex);
    setColorName("");
    setColorHex("#1871da");
  };

  return (
    <div className="bg-white border border-ash-gray rounded-xl p-6 shadow-(--shadow-card) flex flex-col gap-4">
      <h2 className="font-sans font-bold text-base text-midnight-ink">
        Paleta de colores
      </h2>

      {fields.length > 0 && (
        <div className="flex flex-row gap-6 flex-wrap pb-2">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col items-center gap-1.5 relative group"
            >
              <input
                type="hidden"
                {...register(`colors.${index}.name`)}
              />
              <input type="hidden" {...register(`colors.${index}.hex`)} />

              <div
                className="w-12 h-12 rounded-full border border-ash-gray shadow-(--shadow-subtle) transition-transform group-hover:scale-105"
                style={{ backgroundColor: field.hex }}
              />
              <span className="font-body font-medium text-[12px] text-midnight-ink">
                {field.name}
              </span>
              <span className="font-body text-[10px] text-steel-gray -mt-1">
                {field.hex}
              </span>

              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute -top-1 -right-1 w-5 h-5 bg-white border border-ash-gray text-action-red rounded-full flex items-center justify-center text-[11px] font-bold cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-row items-center gap-3">
        <input
          type="color"
          value={colorHex}
          onChange={(e) => setColorHex(e.target.value)}
          className="w-10 h-10 rounded-md border border-ash-gray cursor-pointer bg-white p-1"
        />
        <input
          type="text"
          placeholder="Nombre (ej. Coral)"
          value={colorName}
          onChange={(e) => setColorName(e.target.value)}
          className="flex-1 border border-ash-gray rounded-md h-10 px-3 font-body text-(--text-body-sm) outline-none focus:border-composer-blue transition-all"
        />
        <button
          type="button"
          onClick={handleAddClick}
          className="h-10 px-4 bg-composer-blue text-white rounded-md font-sans font-medium text-(--text-body-sm) cursor-pointer hover:opacity-90 transition-opacity"
        >
          + Color
        </button>
      </div>
    </div>
  );
}
