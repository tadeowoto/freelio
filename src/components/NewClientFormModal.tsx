import { useState } from "react";
import {useForm} from "react-hook-form";

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
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [modalidad, setModalidad] = useState("por_hora");
  const [estadoCobro, setEstadoCobro] = useState("pendiente");
  const [estadoCliente, setEstadoCliente] = useState("activo");

  const onSubmit = handleSubmit((data) => {
    console.log(data);
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

        <form onSubmit={onSubmit} 
          className="p-8 pt-16 flex flex-col gap-6 text-graphite">
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
                  {...register("nombreCompleto", { required: "El nombre es obligatorio" })}
                />
                {errors.nombreCompleto && (
                  <span className="font-body text-[11px] text-action-red">
                    {errors.nombreCompleto.message as string}
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
                  {...register("empresa", { required: "La empresa es obligatoria" })}
                />
                {errors.empresa && (
                  <span className="font-body text-[11px] text-action-red">
                    {errors.empresa.message as string}
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
                  {...register("rolContacto", { required: "El rol del contacto es obligatorio" })}
                />
                {errors.rolContacto && (
                  <span className="font-body text-[11px] text-action-red">
                    {errors.rolContacto.message as string}
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
                  {...register("email", { required: "El email es obligatorio" })}
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
                  {...register("telefono", { required: "El teléfono es obligatorio" })}
                />
                {errors.telefono && (
                  <span className="font-body text-[11px] text-action-red">
                    {errors.telefono.message as string}
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
                {...register("tarifa", { required: "La tarifa es obligatoria" })}
              />
              {errors.tarifa && (
                <span className="font-body text-[11px] text-action-red">
                  {errors.tarifa.message as string}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-body text-[11px] font-bold text-steel-gray uppercase tracking-wider">
                Modalidad
              </label>
              <select
                {...register("modalidad")}
                value={modalidad}
                onChange={(e) => setModalidad(e.target.value)}
                className="border border-ash-gray bg-white rounded-md h-10 px-3 font-body text-(--text-body-sm) text-graphite outline-none focus:border-composer-blue focus:shadow-(--shadow-subtle) cursor-pointer transition-all"
                
              >
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
                {...register("estadoCobro")}
                value={estadoCobro}
                onChange={(e) => setEstadoCobro(e.target.value)}
                className="border border-ash-gray bg-white rounded-md h-10 px-3 font-body text-(--text-body-sm) text-graphite outline-none focus:border-composer-blue focus:shadow-(--shadow-subtle) cursor-pointer transition-all"
                
              >
                <option value="cobrado">Cobrado</option>
                <option value="pendiente">Pendiente</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-body text-[11px] font-bold text-steel-gray uppercase tracking-wider">
                Estado del cliente
              </label>
              <select
                {...register("estadoCliente")}
                value={estadoCliente}
                onChange={(e) => setEstadoCliente(e.target.value)}
                className="border border-ash-gray bg-white rounded-md h-10 px-3 font-body text-(--text-body-sm) text-graphite outline-none focus:border-composer-blue focus:shadow-(--shadow-subtle) cursor-pointer transition-all"
                
              >
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
