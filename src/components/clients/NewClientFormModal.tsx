import { useState } from "react";
import { useForm } from "react-hook-form";

type NewClientFormModalProps = {
  isOpenModal: boolean;
  onClose: () => void;
};

export default function NewClientFormModal({
  isOpenModal,
  onClose,
}: NewClientFormModalProps) {
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
  const [modalidad, setModalidad] = useState("por_hora");
  const [estadoCobro, setEstadoCobro] = useState("pendiente");
  const [estadoCliente, setEstadoCliente] = useState("activo");

  const onSubmit = handleSubmit(async (data, e) => {
    const formData = {
      name: data.name,
      company: data.company,
      status: data.status,
      payment_status: data.payment_status,
      contact: data.contact,
      email: data.email,
      phone: data.phone,
      payment_method: data.paymenth_method,
      first_contact_at: data.first_contact_at,
      last_contact_at: data.last_contact_at,
      fee: data.fee,
    };

    try {
      const response = await fetch("/api/clients", {
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

  return (
    <div
      className="fixed  inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4"
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
          <h1 className="font-sans text-4xl font-bold text-(--text-heading) tracking-heading text-midnight-ink mb-2">
            Nuevo cliente
          </h1>

          <div className="bg-white border border-ash-gray rounded-xl p-6 shadow-(--shadow-card) flex flex-col gap-4">
            <h2 className="font-sans font-bold text-base text-midnight-ink">
              Información básica
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-[11px] font-bold text-steel-gray uppercase tracking-wider">
                  Nombre completo
                </label>
                <input
                  type="text"
                  placeholder="María García"
                  className="border border-ash-gray rounded-md h-10 px-3 font-body text-(--text-body-sm) outline-none focus:border-composer-blue focus:shadow-(--shadow-subtle) transition-all"
                  {...register("name", {
                    required: "El nombre es obligatorio",
                  })}
                />
                {errors.name && (
                  <span className="font-body text-[11px] text-action-red">
                    {errors.name.message as string}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-[11px] font-bold text-steel-gray uppercase tracking-wider">
                  Empresa
                </label>
                <input
                  placeholder="Mundo Padel..."
                  type="text"
                  className="border border-ash-gray rounded-md h-10 px-3 font-body text-(--text-body-sm) outline-none focus:border-composer-blue focus:shadow-(--shadow-subtle) transition-all"
                  {...register("company", {
                    required: "La empresa es obligatoria",
                  })}
                />
                {errors.company && (
                  <span className="font-body text-[11px] text-action-red">
                    {errors.company.message as string}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-[11px] font-bold text-steel-gray uppercase tracking-wider">
                  Rol del contacto
                </label>
                <input
                  type="text"
                  placeholder="CEO, Marketing Manager"
                  className="border border-ash-gray rounded-md h-10 px-3 font-body text-(--text-body-sm) outline-none focus:border-composer-blue focus:shadow-(--shadow-subtle) transition-all"
                  {...register("contact", {
                    required: "El rol del contacto es obligatorio",
                  })}
                />
                {errors.contact && (
                  <span className="font-body text-[11px] text-action-red">
                    {errors.contact.message as string}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border border-ash-gray rounded-xl p-6 shadow-(--shadow-card) flex flex-col gap-4">
            <h2 className="font-sans font-bold text-base text-midnight-ink">
              Contacto
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-[11px] font-bold text-steel-gray uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  className="border border-ash-gray rounded-md h-10 px-3 font-body text-(--text-body-sm) outline-none focus:border-composer-blue focus:shadow-(--shadow-subtle) transition-all"
                  {...register("email", {
                    required: "El email es obligatorio",
                  })}
                />
                {errors.email && (
                  <span className="font-body text-[11px] text-action-red">
                    {errors.email.message as string}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-[11px] font-bold text-steel-gray uppercase tracking-wider">
                  Teléfono
                </label>
                <input
                  type="tel"
                  className="border border-ash-gray rounded-md h-10 px-3 font-body text-(--text-body-sm) outline-none focus:border-composer-blue focus:shadow-(--shadow-subtle) transition-all"
                  {...register("phone", {
                    required: "El teléfono es obligatorio",
                  })}
                />
                {errors.phone && (
                  <span className="font-body text-[11px] text-action-red">
                    {errors.phone.message as string}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border border-ash-gray rounded-xl p-6 shadow-(--shadow-card) flex flex-col gap-4">
            <h2 className="font-sans font-bold text-base text-midnight-ink">
              Comercial
            </h2>

            <div className="flex flex-col gap-1.5">
              <label className="font-body text-[11px] font-bold text-steel-gray uppercase tracking-wider">
                Tarifa
              </label>
              <input
                type="number"
                placeholder="45"
                className="border border-ash-gray rounded-md h-10 px-3 font-body text-(--text-body-sm) outline-none focus:border-composer-blue focus:shadow-(--shadow-subtle) transition-all"
                {...register("fee", { required: "La tarifa es obligatoria" })}
              />
              {errors.fee && (
                <span className="font-body text-[11px] text-action-red">
                  {errors.fee.message as string}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-[11px] font-bold text-steel-gray uppercase tracking-wider">
                Primer contacto
              </label>
              <input
                type="date"
                className="border border-ash-gray rounded-md h-10 px-3 font-body text-(--text-body-sm) outline-none focus:border-composer-blue focus:shadow-(--shadow-subtle) transition-all"
                {...register("first_contact_at", {
                  required: "La fecha es obligatoria",
                })}
              />
              {errors.first_contact_at && (
                <span className="font-body text-[11px] text-action-red">
                  {errors.first_contact_at.message as string}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-[11px] font-bold text-steel-gray uppercase tracking-wider">
                Ultimo contacto
              </label>
              <input
                type="date"
                placeholder=" 45"
                className="border border-ash-gray rounded-md h-10 px-3 font-body text-(--text-body-sm) outline-none focus:border-composer-blue focus:shadow-(--shadow-subtle) transition-all"
                {...register("last_contact_at")}
              />
              {errors.last_contact_at && (
                <span className="font-body text-[11px] text-action-red">
                  {errors.last_contact_at.message as string}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-body text-[11px] font-bold text-steel-gray uppercase tracking-wider">
                Modalidad
              </label>
              <select
                {...register("payment_method")}
                value={modalidad}
                onChange={(e) => setModalidad(e.target.value)}
                className="border border-ash-gray bg-white rounded-md h-10 px-3 font-body text-(--text-body-sm) text-graphite outline-none focus:border-composer-blue focus:shadow-(--shadow-subtle) cursor-pointer transition-all"
              >
                <option value="">Ingrese una modalidad</option>
                <option value="por_hora">Por hora</option>
                <option value="por_proyecto">Por proyecto</option>
                <option value="mensual">Mensual</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-body text-[11px] font-bold text-steel-gray uppercase tracking-wider">
                Estado de cobro
              </label>
              <select
                {...register("payment_status")}
                value={estadoCobro}
                onChange={(e) => setEstadoCobro(e.target.value)}
                className="border border-ash-gray bg-white rounded-md h-10 px-3 font-body text-(--text-body-sm) text-graphite outline-none focus:border-composer-blue focus:shadow-(--shadow-subtle) cursor-pointer transition-all"
              >
                <option value="">Ingrese un estado</option>
                <option value="cobrado">Cobrado</option>
                <option value="pendiente">Pendiente</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-body text-[11px] font-bold text-steel-gray uppercase tracking-wider">
                Estado del cliente
              </label>
              <select
                {...register("status")}
                value={estadoCliente}
                onChange={(e) => setEstadoCliente(e.target.value)}
                className="border border-ash-gray bg-white rounded-md h-10 px-3 font-body text-(--text-body-sm) text-graphite outline-none focus:border-composer-blue focus:shadow-(--shadow-subtle) cursor-pointer transition-all"
              >
                <option value="">Ingrese un estado</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
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
              Guardar cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
