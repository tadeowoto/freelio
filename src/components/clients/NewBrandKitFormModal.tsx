import { useState } from "react";
import { useForm } from "react-hook-form";

type NewBrandkitFormModalProps = {
  isOpenModal: boolean;
  onClose: () => void;
};

export default function NewBrandKitFormModal({
  isOpenModal,
  onClose,
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
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data, e) => {
    const formData = {
      //TODO
    };

    try {
      const response = await fetch("/api/brandkits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Error al guardar");

      const data = await response.json();

      onClose();
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  });

  return <h1>Me quede sin tokens :(</h1>;
}
