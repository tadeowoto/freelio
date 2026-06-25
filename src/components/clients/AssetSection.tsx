import { useState } from "react";
import { Trash2 } from "lucide-react";
import type { UseFormRegister } from "react-hook-form";
import type { AssetLink } from "../../types/types";

type AssetSectionProps = {
  fields: (AssetLink & { id: string })[];
  register: UseFormRegister<any>;
  onAdd: (label: string, url: string) => void;
  onRemove: (index: number) => void;
};

export default function AssetSection({
  fields,
  register,
  onAdd,
  onRemove,
}: AssetSectionProps) {
  const [assetLabel, setAssetLabel] = useState("");
  const [assetUrl, setAssetUrl] = useState("");

  const handleAddClick = () => {
    onAdd(assetLabel, assetUrl);
    setAssetLabel("");
    setAssetUrl("");
  };

  return (
    <div className="bg-white border border-ash-gray rounded-xl p-6 shadow-(--shadow-card) flex flex-col gap-4">
      <h2 className="font-sans font-bold text-base text-midnight-ink">
        Links de assets
      </h2>

      {fields.length > 0 && (
        <div className="flex flex-col gap-2.5">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-center justify-between p-3 border border-ash-gray rounded-xl bg-white font-body group hover:border-steel-gray transition-colors"
            >
              <input
                type="hidden"
                {...register(`assets_links.${index}.label`)}
              />
              <input
                type="hidden"
                {...register(`assets_links.${index}.url`)}
              />

              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-midnight-ink font-semibold text-(--text-body-sm)">
                  {field.label}
                </span>
                <span className="text-steel-gray text-[12px] truncate max-w-[450px] mt-0.5">
                  {field.url}
                </span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Label (Figma, Drive...)"
            value={assetLabel}
            onChange={(e) => setAssetLabel(e.target.value)}
            className="border border-ash-gray rounded-md h-10 px-3 font-body text-(--text-body-sm) outline-none focus:border-composer-blue transition-all"
          />
          <input
            type="text"
            placeholder="https://"
            value={assetUrl}
            onChange={(e) => setAssetUrl(e.target.value)}
            className="border border-ash-gray rounded-md h-10 px-3 font-body text-(--text-body-sm) outline-none focus:border-composer-blue transition-all"
          />
        </div>
        <button
          type="button"
          onClick={handleAddClick}
          className="h-10 px-4 bg-composer-blue text-white rounded-md font-sans font-medium text-(--text-body-sm) self-start cursor-pointer hover:opacity-90"
        >
          + Añadir link
        </button>
      </div>
    </div>
  );
}
