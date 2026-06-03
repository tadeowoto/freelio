import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import type { Color, Font, AssetLink, BrandKit } from "../../types/types";
import BrandKitModalHeader from "./BrandKitModalHeader";
import ColorSection from "./ColorSection";
import FontSection from "./FontSection";
import AssetSection from "./AssetSection";

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
        <BrandKitModalHeader onClose={onClose} />

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

          <ColorSection
            fields={colorFields}
            register={register}
            onAdd={handleAddColorClick}
            onRemove={removeColor}
          />

          <FontSection
            fields={fontFields}
            register={register}
            onAdd={handleAddFontClick}
            onRemove={removeFont}
          />

          <AssetSection
            fields={assetFields}
            register={register}
            onAdd={handleAddAssetClick}
            onRemove={removeAsset}
          />

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
