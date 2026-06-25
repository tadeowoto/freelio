import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import { modalBackdrop, modalContent } from "../../lib/animations";
import type { Client } from "../../types/types";
import { toast } from "sonner";

type ClientFormData = {
  name: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  fee: number;
};

type NewClientFormModalProps = {
  isOpenModal: boolean;
  onClose: () => void;
  onSuccess?: (data: Client) => void;
};

export default function NewClientFormModal({
  onClose,
  onSuccess,
}: NewClientFormModalProps) {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>();
  const [modalidad, setModalidad] = useState("por_hora");
  const [estadoCobro, setEstadoCobro] = useState("pendiente");
  const [estadoCliente, setEstadoCliente] = useState("activo");

  const onSubmit = handleSubmit(async (data) => {
    const formData = {
      name: data.name,
      company: data.company,
      contact: data.contact,
      email: data.email,
      phone: data.phone,
      fee: data.fee,
      status: estadoCliente,
      payment_status: estadoCobro,
      payment_method: modalidad,
    };

    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Error al guardar");

      const newClient = await response.json();
      toast.success("Cliente guardado");

      onSuccess?.(newClient);
      onClose();
    } catch (err) {
      toast.error("Error al guardar el cliente");
      console.error(err);
    }
  });

  return (
    <motion.div
      variants={modalBackdrop}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4"
      onClick={handleBackdropClick}
    >
      <motion.div
        variants={modalContent}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-white w-full max-w-160 max-h-[90vh] rounded-2xl shadow-dark overflow-y-auto relative flex flex-col"
      >
        <div className="absolute top-0 left-0 w-full h-24 pointer-events-none overflow-hidden select-none z-0">
          <div className="absolute top-0 left-0 w-24 h-24 bg-vivid-green"></div>
          <div className="absolute top-0 left-24 w-16 h-8 bg-bubblegum-pink"></div>
          <div className="absolute top-0 right-32 w-16 h-8 bg-vivid-green opacity-90"></div>
          <div className="absolute top-0 right-16 w-16 h-12 bg-sunny-yellow"></div>
          <div className="absolute top-8 right-0 w-16 h-16 bg-composer-blue"></div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-canvas-white border border-ash-gray text-midnight-ink font-bold text-lg cursor-pointer hover:bg-ash-gray/50 transition-colors z-10"
        >
          &times;
        </button>

        <form
          onSubmit={onSubmit}
          className="p-8 pt-20 flex flex-col gap-6 text-midnight-ink"
        >
          <h1 className="font-sans text-5xl font-bold tracking-tighter text-midnight-ink mb-2">
            Nuevo cliente
          </h1>

          <div className="bg-white border border-ash-gray rounded-xl p-6 flex flex-col gap-4">
            <h2 className="font-sans font-bold text-sm text-midnight-ink">
              Información básica
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-[10px] font-bold text-steel-gray uppercase tracking-wider">
                  Nombre completo
                </label>
                <input
                  type="text"
                  placeholder="María García"
                  className="border border-ash-gray rounded-lg h-11 px-3 font-body text-sm outline-none focus:border-composer-blue transition-all"
                  {...register("name", {
                    required: "El nombre es obligatorio",
                  })}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-[10px] font-bold text-steel-gray uppercase tracking-wider">
                  Empresa
                </label>
                <input
                  placeholder="Mundo Padel..."
                  type="text"
                  className="border border-ash-gray rounded-lg h-11 px-3 font-body text-sm outline-none focus:border-composer-blue transition-all"
                  {...register("company", {
                    required: "La empresa es obligatoria",
                  })}
                />
                <span className="font-body text-[11px] text-action-red mt-1">
                  {errors.company?.message as string}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-[10px] font-bold text-steel-gray uppercase tracking-wider">
                Rol del contacto
              </label>
              <input
                type="text"
                placeholder="CEO, Marketing Manager"
                className="border border-ash-gray rounded-lg h-11 px-3 font-body text-sm outline-none focus:border-composer-blue transition-all"
                {...register("contact", { required: "El rol es obligatorio" })}
              />
              <span className="font-body text-[11px] text-action-red mt-1">
                {errors.contact?.message as string}
              </span>
            </div>
          </div>

          <div className="bg-white border border-ash-gray rounded-xl p-6 flex flex-col gap-4">
            <h2 className="font-sans font-bold text-sm text-midnight-ink">
              Contacto
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-[10px] font-bold text-steel-gray uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  className="border border-ash-gray rounded-lg h-11 px-3 font-body text-sm outline-none focus:border-composer-blue"
                  {...register("email", {
                    required: "El email es obligatorio",
                  })}
                />
                <span className="font-body text-[11px] text-action-red mt-1">
                  {errors.email?.message as string}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-[10px] font-bold text-steel-gray uppercase tracking-wider">
                  Teléfono
                </label>
                <input
                  type="tel"
                  className="border border-ash-gray rounded-lg h-11 px-3 font-body text-sm outline-none focus:border-composer-blue"
                  {...register("phone", {
                    required: "El teléfono es obligatorio",
                  })}
                />
                <span className="font-body text-[11px] text-action-red mt-1">
                  {errors.phone?.message as string}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-ash-gray rounded-xl p-6 flex flex-col gap-4">
            <h2 className="font-sans font-bold text-sm text-midnight-ink">
              Comercial
            </h2>
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-[10px] font-bold text-steel-gray uppercase tracking-wider">
                Tarifa
              </label>
              <input
                type="number"
                placeholder="45"
                className="border border-ash-gray rounded-lg h-11 px-3 font-body text-sm outline-none focus:border-composer-blue"
                {...register("fee")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-body text-[10px] font-bold text-steel-gray uppercase tracking-wider">
                Modalidad
              </label>
              <div className="flex gap-2">
                {["por_hora", "por_proyecto", "mensual"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setModalidad(m)}
                    className={`px-4 py-2 rounded-full text-xs font-bold ${modalidad === m ? "bg-midnight-ink text-white" : "bg-canvas-white border border-ash-gray"}`}
                  >
                    {m === "por_hora"
                      ? "Por hora"
                      : m === "por_proyecto"
                        ? "Por proyecto"
                        : "Mensual"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-body text-[10px] font-bold text-steel-gray uppercase tracking-wider">
                Estado de cobro
              </label>
              <div className="flex gap-2">
                {["cobrado", "pendiente"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setEstadoCobro(s)}
                    className={`px-4 py-2 rounded-full text-xs font-bold ${estadoCobro === s ? (s === "cobrado" ? "bg-vivid-green text-white" : "bg-sunset-orange text-white") : "bg-canvas-white border border-ash-gray"}`}
                  >
                    {s === "cobrado" ? "Cobrado" : "Pendiente"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-body text-[10px] font-bold text-steel-gray uppercase tracking-wider">
                Estado del cliente
              </label>
              <div className="flex gap-2">
                {["activo", "inactivo"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setEstadoCliente(s)}
                    className={`px-4 py-2 rounded-full text-xs font-bold ${estadoCliente === s ? (s === "activo" ? "bg-vivid-green text-white" : "bg-ash-gray text-midnight-ink") : "bg-canvas-white border border-ash-gray"}`}
                  >
                    {s === "activo" ? "Activo" : "Inactivo"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 font-bold text-midnight-ink"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-composer-blue text-white rounded-full font-bold"
            >
              Guardar cliente
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
