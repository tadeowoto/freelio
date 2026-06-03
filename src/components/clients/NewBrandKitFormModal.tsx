import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import type { Color, Font, AssetLink } from "../../types/types";

type NewBrandkitFormModalProps = {
  isOpenModal: boolean;
  onClose: () => void;
  clientId: string;
};

type FormInputs = {
  colors: Color[];
  fonts: Font[];
  assets_links: AssetLink[];
  notes: string;
};

export default function NewBrandKitFormModal({
  isOpenModal,
  onClose,
  clientId,
}: NewBrandkitFormModalProps) {
  if (!isOpenModal) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      colors: [],
      fonts: [],
      assets_links: [],
      notes: "",
    },
  });

  const {
    fields: colorFields,
    append: appendColor,
    remove: removeColor,
  } = useFieldArray({
    control,
    name: "colors",
  });

  const {
    fields: fontFields,
    append: appendFont,
    remove: removeFont,
  } = useFieldArray({
    control,
    name: "fonts",
  });

  const {
    fields: assetFields,
    append: appendAsset,
    remove: removeAsset,
  } = useFieldArray({
    control,
    name: "assets_links",
  });

  const handleAddColorClick = (colorName: string, colorHex: string) => {
    if (!colorName) return;
    appendColor({ name: colorName, hex: colorHex });
  };

  const handleAddFontClick = (
    fontName: string,
    fontRole: "heading" | "body" | "accent"
  ) => {
    if (!fontName) return;
    appendFont({ name: fontName, role: fontRole });
  };

  const handleAddAssetClick = (assetLabel: string, assetUrl: string) => {
    if (!assetLabel || !assetUrl) return;
    appendAsset({ label: assetLabel, url: assetUrl });
  };

  const onSubmit = handleSubmit(async (data) => {
    console.log("Form data:", data);
    const formData = {
      client_id: clientId,
      colors: data.colors,
      fonts: data.fonts,
      notes: data.notes,
      assets_links: data.assets_links,
    };

    try {
      const response = await fetch("/api/brandkits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Error al guardar el brand kit");


      const data = await response.json();

      onClose();
      window.location.reload();
    } catch (err) {
      console.error(err);
      
    }
  });


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white w-full max-w-[720px] max-h-[90vh] rounded-xl shadow-(--shadow-dark) overflow-y-auto relative flex flex-col">
        <div className="absolute top-0 left-0 w-full h-12 pointer-events-none overflow-hidden select-none">
          <div className="absolute top-0 left-0 w-12 h-12 bg-vivid-green"></div>
          <div className="absolute top-0 left-20 w-16 h-4 bg-bubblegum-pink"></div>
          <div className="absolute top-0 right-24 w-12 h-4 bg-vivid-green opacity-90 grid grid-cols-4 gap-1 p-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white/30 w-1 h-1 rounded-full"></div>
            ))}
          </div>
          <div className="absolute top-0 right-8 w-16 h-6 bg-sunny-yellow"></div>
          <div className="absolute top-6 right-0 w-8 h-8 bg-composer-blue"></div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute top-10 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-canvas-white border border-ash-gray text-graphite font-body font-medium text-lg cursor-pointer hover:bg-ash-gray/50 transition-colors z-10"
        >
          &times;
        </button>

        <form onSubmit={onSubmit} className="p-8 pt-16 flex flex-col gap-6 text-graphite">
          <div className="flex flex-col gap-0.5 mb-2">
            <span className="font-body text-[11px] font-bold text-steel-gray uppercase tracking-wider">
              María García
            </span>
            <h1 className="font-sans text-4xl font-bold text-(--text-heading) tracking-heading text-midnight-ink">
              Editar brand kit
            </h1>
          </div>

         
          <div className="bg-white border border-ash-gray rounded-xl p-6 shadow-(--shadow-card) flex flex-col gap-4">
            <h2 className="font-sans font-bold text-base text-midnight-ink">
              Paleta de colores
            </h2>

            <ColorInputForm onAdd={handleAddColorClick} />

            {colorFields.length > 0 && (
              <div className="flex flex-row gap-2 flex-wrap border-t border-canvas-white pt-3 mt-1">
                {colorFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-center gap-2 px-2 py-1 bg-canvas-white rounded-md border border-ash-gray group hover:border-red-300 transition-colors"
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-ash-gray"
                      style={{ backgroundColor: field.hex }}
                    />
                    <span className="font-body text-[12px] text-graphite font-medium">
                      {field.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeColor(index)}
                      className="ml-1 text-gray-400 hover:text-red-500 text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          
          <div className="bg-white border border-ash-gray rounded-xl p-6 shadow-(--shadow-card) flex flex-col gap-4">
            <h2 className="font-sans font-bold text-base text-midnight-ink">
              Tipografías
            </h2>

            <FontInputForm onAdd={handleAddFontClick} />

            {fontFields.length > 0 && (
              <div className="flex flex-col gap-1.5 border-t border-canvas-white pt-3">
                {fontFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex justify-between items-center text-(--text-body-sm) bg-canvas-white p-2 rounded-md font-body group hover:bg-red-50 transition-colors"
                  >
                    <span className="text-graphite font-medium">{field.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-ash-gray text-steel-gray px-2 py-0.5 rounded-full font-bold uppercase">
                        {field.role}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFont(index)}
                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

         
          <div className="bg-white border border-ash-gray rounded-xl p-6 shadow-(--shadow-card) flex flex-col gap-4">
            <h2 className="font-sans font-bold text-base text-midnight-ink">
              Links de assets
            </h2>

            <AssetInputForm onAdd={handleAddAssetClick} />

            {assetFields.length > 0 && (
              <div className="flex flex-col gap-1.5 border-t border-canvas-white pt-3">
                {assetFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex justify-between text-(--text-body-sm) bg-canvas-white p-2 rounded-md font-body group hover:bg-red-50 transition-colors"
                  >
                    <span className="text-graphite font-medium">{field.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-steel-gray truncate max-w-[200px]">
                        {field.url}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeAsset(index)}
                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* NOTAS */}
          <div className="bg-white border border-ash-gray rounded-xl p-6 shadow-(--shadow-card) flex flex-col gap-4">
            <h2 className="font-sans font-bold text-base text-midnight-ink">
              Notas de estilo
            </h2>
            <textarea
              rows={4}
              placeholder="Editorial, fotografía analógica, mucho aire. Evitar gradientes."
              className="border border-ash-gray rounded-md p-3 font-body text-(--text-body-sm) outline-none focus:border-composer-blue resize-none transition-all"
              {...register("notes")}
            />
          </div>

          {/* BOTONES */}
          <div className="w-full flex flex-row items-center justify-end gap-4 mt-2 border-t border-canvas-white pt-4">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 font-body font-medium text-(--text-body-sm) text-graphite bg-transparent border-none cursor-pointer hover:underline"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="h-10 px-6 bg-composer-blue text-white border-none rounded-md font-sans font-medium text-(--text-body) cursor-pointer hover:opacity-90 transition-opacity"
            >
              Guardar brand kit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


function ColorInputForm({
  onAdd,
}: {
  onAdd: (name: string, hex: string) => void;
}) {
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("#1871da");

  const handleClick = () => {
    onAdd(colorName, colorHex);
    setColorName("");
    setColorHex("#1871da");
  };

  return (
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
        onClick={handleClick}
        className="h-10 px-4 bg-composer-blue text-white rounded-md font-sans font-medium text-(--text-body-sm) cursor-pointer hover:opacity-90 transition-opacity"
      >
        + Color
      </button>
    </div>
  );
}


function FontInputForm({
  onAdd,
}: {
  onAdd: (name: string, role: "heading" | "body" | "accent") => void;
}) {
  const [fontName, setFontName] = useState("");
  const [fontRole, setFontRole] =
    useState<"heading" | "body" | "accent">("body");

  const handleClick = () => {
    onAdd(fontName, fontRole);
    setFontName("");
    setFontRole("body");
  };

  return (
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
        onClick={handleClick}
        className="h-10 px-4 bg-composer-blue text-white rounded-md font-sans font-medium text-(--text-body-sm) self-start mt-1 cursor-pointer hover:opacity-90"
      >
        + Añadir tipografía
      </button>
    </div>
  );
}


function AssetInputForm({
  onAdd,
}: {
  onAdd: (label: string, url: string) => void;
}) {
  const [assetLabel, setAssetLabel] = useState("");
  const [assetUrl, setAssetUrl] = useState("");

  const handleClick = () => {
    onAdd(assetLabel, assetUrl);
    setAssetLabel("");
    setAssetUrl("");
  };

  return (
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
        onClick={handleClick}
        className="h-10 px-4 bg-composer-blue text-white rounded-md font-sans font-medium text-(--text-body-sm) self-start cursor-pointer hover:opacity-90"
      >
        + Añadir link
      </button>
    </div>
  );
}
