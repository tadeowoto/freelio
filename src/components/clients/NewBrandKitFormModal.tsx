import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import type { Color, Font, AssetLink, BrandKit } from "../../types/types";

type NewBrandkitFormModalProps = {
  isOpenModal: boolean;
  onClose: () => void;
  clientId: string;
  brandKit?: BrandKit | null;
  isEdit: boolean;
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
  brandKit,
  isEdit,
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
    reset,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      colors: [],
      fonts: [],
      assets_links: [],
      notes: "",
    },
  });

  useEffect(() => {
    if (isEdit && brandKit) {
      reset({
        colors: brandKit.colors || [],
        fonts: brandKit.fonts || [],
        assets_links: brandKit.assets_links || [],
        notes: brandKit.notes || "",
      });
    } else if (!isEdit) {
      reset({
        colors: [],
        fonts: [],
        assets_links: [],
        notes: "",
      });
    }
  }, [isEdit, brandKit, reset, isOpenModal]);

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
    fontRole: "heading" | "body" | "accent",
  ) => {
    if (!fontName) return;
    appendFont({ name: fontName, role: fontRole });
  };

  const handleAddAssetClick = (assetLabel: string, assetUrl: string) => {
    if (!assetLabel || !assetUrl) return;
    appendAsset({ label: assetLabel, url: assetUrl });
  };

  const onSubmit = handleSubmit(async (data) => {
    const formData = {
      id: brandKit?.id,
      client_id: clientId,
      colors: data.colors,
      fonts: data.fonts,
      notes: data.notes,
      assets_links: data.assets_links,
    };

    if (isEdit) {
      try {
        const response = await fetch("/api/edit/brandkits", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error("Error al editar el brand kit");

        onClose();
        window.location.reload();
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const response = await fetch("/api/brandkits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error("Error al guardar el brand kit");

        onClose();
        window.location.reload();
      } catch (err) {
        console.error(err);
      }
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

        <form
          onSubmit={onSubmit}
          className="p-8 pt-16 flex flex-col gap-6 text-graphite"
        >
          <div className="flex flex-col gap-0.5 mb-2">
            <span className="font-body text-(--text-body-sm) font-bold text-steel-gray uppercase tracking-wider">
              María García
            </span>
            <h1 className="font-sans text-4xl font-bold text-(--text-heading) tracking-heading text-midnight-ink">
              {isEdit ? "Editar brand kit" : "Nuevo brand kit"}
            </h1>
          </div>

          <div className="bg-white border border-ash-gray rounded-xl p-6 shadow-(--shadow-card) flex flex-col gap-4">
            <h2 className="font-sans font-bold text-base text-midnight-ink">
              Paleta de colores
            </h2>

            {colorFields.length > 0 && (
              <div className="flex flex-row gap-6 flex-wrap pb-2">
                {colorFields.map((field, index) => (
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
                      onClick={() => removeColor(index)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-white border border-ash-gray text-action-red rounded-full flex items-center justify-center text-[11px] font-bold cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}

            <ColorInputForm onAdd={handleAddColorClick} />
          </div>

          <div className="bg-white border border-ash-gray rounded-xl p-6 shadow-(--shadow-card) flex flex-col gap-4">
            <h2 className="font-sans font-bold text-base text-midnight-ink">
              Tipografías
            </h2>

            {fontFields.length > 0 && (
              <div className="flex flex-col gap-2.5">
                {fontFields.map((field, index) => (
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
                      onClick={() => removeFont(index)}
                      className="w-8 h-8 flex items-center justify-center text-steel-gray hover:text-action-red rounded-md hover:bg-canvas-white transition-colors cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <FontInputForm onAdd={handleAddFontClick} />
          </div>

          <div className="bg-white border border-ash-gray rounded-xl p-6 shadow-(--shadow-card) flex flex-col gap-4">
            <h2 className="font-sans font-bold text-base text-midnight-ink">
              Links de assets
            </h2>

            {assetFields.length > 0 && (
              <div className="flex flex-col gap-2.5">
                {assetFields.map((field, index) => (
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
                      onClick={() => removeAsset(index)}
                      className="w-8 h-8 flex items-center justify-center text-steel-gray hover:text-action-red rounded-md hover:bg-canvas-white transition-colors cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            <AssetInputForm onAdd={handleAddAssetClick} />
          </div>

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
  const [fontRole, setFontRole] = useState<"heading" | "body" | "accent">(
    "body",
  );

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
