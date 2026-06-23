import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { motion } from "motion/react";
import { modalBackdrop, modalContent } from "../../lib/animations";
import type { Color, Font, AssetLink, BrandKit } from "../../types/types";
import BrandKitModalHeader from "./BrandKitModalHeader";
import ColorSection from "./ColorSection";
import FontSection from "./FontSection";
import AssetSection from "./AssetSection";
import { toast } from "sonner";

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
    setError,
    clearErrors,
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
    const isAllEmpty =
      data.colors.length === 0 &&
      data.fonts.length === 0 &&
      data.assets_links.length === 0 &&
      !data.notes?.trim();

    if (isAllEmpty) {
      setError("root", {
        type: "manual",
        message:
          "Agregá al menos un color, una fuente, un asset o una nota antes de guardar.",
      });
      return;
    }

    clearErrors("root");

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

        toast.success("Brand kit editado exitosamente");
        onClose();
        window.location.reload();
      } catch (err) {
        toast.error("Error al editar el brand kit");
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

        toast.success("Brand kit guardado exitosamente");
        onClose();
        window.location.reload();
      } catch (err) {
        toast.error("Error al guardar el brand kit");
        console.error(err);
      }
    }
  });

  return (
    <motion.div
      variants={modalBackdrop}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4"
      onClick={handleBackdropClick}
    >
      <motion.div
        variants={modalContent}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-canvas-white w-full max-w-[640px] max-h-[90vh] rounded-2xl shadow-dark overflow-y-auto relative flex flex-col hide-scrollbar"
      >
        <div className="absolute top-0 left-0 w-full h-40 pointer-events-none overflow-hidden select-none rounded-t-2xl z-0">
          <div className="absolute top-0 left-0 w-24 h-24 bg-vivid-green"></div>
          <div className="absolute top-0 left-24 w-16 h-8 bg-bubblegum-pink"></div>
          <div className="absolute top-0 right-32 w-16 h-8 bg-vivid-green opacity-90"></div>
          <div className="absolute top-0 right-16 w-16 h-12 bg-sunny-yellow"></div>
          <div className="absolute top-8 right-0 w-16 h-16 bg-composer-blue"></div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-white border border-ash-gray text-midnight-ink font-bold text-lg cursor-pointer hover:bg-canvas-white transition-colors z-20 shadow-sm"
        >
          &times;
        </button>

        <form
          onSubmit={onSubmit}
          className="p-8 pt-20 flex flex-col gap-6 relative z-10 w-full"
        >
          <div className="flex flex-col gap-1 mb-2">
            <span className="font-body text-[11px] font-bold text-steel-gray uppercase tracking-wider">
              María García
            </span>
            <h1 className="font-display font-bold text-[48px] tracking-tighter text-midnight-ink leading-none">
              {isEdit ? "Editar brand kit" : "Nuevo brand kit"}
            </h1>
          </div>

          <div className="bg-white border border-ash-gray rounded-xl p-6 md:p-8 flex flex-col gap-8 w-full">
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

            <div className="flex flex-col gap-3">
              <h2 className="font-display font-bold text-[20px] text-midnight-ink leading-none tracking-tight">
                Notas de estilo
              </h2>
              <textarea
                rows={4}
                placeholder="Editorial, fotografía analógica, mucho aire. Evitar gradientes."
                className="border border-ash-gray rounded-md p-4 font-body text-[14px] text-midnight-ink outline-none focus:border-cadet-blue transition-all resize-none w-full"
                {...register("notes")}
              />
            </div>
          </div>
          {errors.root && (
            <p className="font-body text-[13px] font-bold text-sunset-orange -mt-2">
              {errors.root.message}
            </p>
          )}
          <div className="w-full flex flex-row items-center justify-end gap-6 pt-2 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="font-body font-bold text-[16px] text-midnight-ink bg-transparent border-none cursor-pointer hover:underline outline-none"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="h-12 px-8 bg-cadet-blue text-white border-none rounded-full font-body font-bold text-[16px] cursor-pointer hover:opacity-90 transition-opacity outline-none focus:ring-2 focus:ring-cadet-blue/50 focus:ring-offset-2"
            >
              Guardar brand kit
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
