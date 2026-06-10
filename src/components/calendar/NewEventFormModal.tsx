import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { EventFormValues, Client } from "../../types/types";

type NewEventFormModalProps = {
  isOpenModal: boolean;
  onClose: () => void;
  defaultDate?: string;
  IsEdit?: boolean;
  eventData?: any;
  clients?: Client[];
};

const EVENT_TYPES = [
  { value: "reunion", label: "Reunión" },
  { value: "deadline", label: "Deadline" },
  { value: "entrega", label: "Entrega" },
  { value: "pago", label: "Pago" },
  { value: "seguimiento", label: "Seguimiento" },
];

export default function NewEventFormModal({
  isOpenModal,
  onClose,
  defaultDate,
  IsEdit,
  eventData,
  clients = [],
}: NewEventFormModalProps) {
  if (!isOpenModal) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<EventFormValues>({
    defaultValues: {
      title: "",
      description: "",
      start_at: defaultDate ?? "",
      end_at: "",
      client_id: "",
    },
  });

  const [eventType, setEventType] = useState("reunion");

  const [reminderEnabled, setReminderEnabled] = useState(false);


  const startAt = watch("start_at");


  const getReminderTimestamp = (startAtValue: string): string | null => {
    if (!startAtValue) return null;
    const start = new Date(startAtValue);
    if (isNaN(start.getTime())) return null;
    start.setDate(start.getDate() - 1);
    return start.toISOString();
  };


  const formatReminderDate = (startAtValue: string): string => {
    const ts = getReminderTimestamp(startAtValue);
    if (!ts) return "1 día antes del inicio";
    return new Date(ts).toLocaleString("es-ES", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    if (IsEdit && eventData) {
      reset({
        title: eventData.title || "",
        description: eventData.description || "",
        start_at: eventData.start_at || "",
        end_at: eventData.end_at || "",
        client_id: eventData.client_id ? String(eventData.client_id) : "",
      });
      setEventType(eventData.type || "reunion");

      setReminderEnabled(!!eventData.reminder);
    } else {
      reset({
        title: "",
        description: "",
        start_at: defaultDate || "",
        end_at: "",
        client_id: "",
      });
      setEventType("reunion");
      setReminderEnabled(false);
    }
  }, [IsEdit, eventData, defaultDate, reset, isOpenModal]);

  const onSubmit = handleSubmit(async (data) => {

    const reminderTimestamp = reminderEnabled
      ? getReminderTimestamp(data.start_at)
      : null;


    const startAtChanged =
      IsEdit && eventData?.start_at && data.start_at !== eventData.start_at;

    const formData: any = {
      client_id: data.client_id || null,
      title: data.title,
      description: data.description,
      type: eventType,
      start_at: data.start_at,
      end_at: data.end_at || null,
      status: data.status || "pendiente",
      reminder: reminderTimestamp, 

      ...(IsEdit && { reminder_sent: startAtChanged ? false : eventData?.reminder_sent ?? false }),
    };

    if (IsEdit && eventData?.id) {
      formData.id = eventData.id;
    }

    try {
      const endpoint = IsEdit ? "/api/edit/events" : "/api/events";
      const method = IsEdit ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error:", errorData);
        throw new Error(errorData.error || "Error al guardar");
      }

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

        <form
          onSubmit={onSubmit}
          className="p-8 pt-16 flex flex-col gap-6 text-graphite"
        >
          <h1 className="font-sans text-4xl font-bold text-(--text-heading) tracking-heading text-midnight-ink mb-2">
            {IsEdit ? "Editar evento" : "Nuevo evento"}
          </h1>


          <div className="bg-white border border-ash-gray rounded-xl p-6 shadow-(--shadow-card) flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-[11px] font-bold text-steel-gray uppercase tracking-wider">
                Título del evento
              </label>
              <input
                type="text"
                placeholder="Kickoff branding"
                className="border border-ash-gray rounded-md h-10 px-3 font-body text-(--text-body-sm) outline-none focus:border-composer-blue focus:shadow-(--shadow-subtle) transition-all"
                {...register("title", {
                  required: "El título es obligatorio",
                })}
              />
              {errors.title && (
                <span className="font-body text-[11px] text-action-red">
                  {errors.title.message as string}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-body text-[11px] font-bold text-steel-gray uppercase tracking-wider">
                Tipo de evento
              </label>
              <div className="flex flex-wrap gap-2">
                {EVENT_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setEventType(type.value)}
                    className={`h-9 px-4 rounded-full font-body text-(--text-body-sm) font-medium border transition-all cursor-pointer ${
                      eventType === type.value
                        ? "bg-composer-blue text-white border-composer-blue"
                        : "bg-white text-graphite border-ash-gray hover:border-composer-blue"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-body text-[11px] font-bold text-steel-gray uppercase tracking-wider">
                Cliente vinculado (opcional)
              </label>
              <select
                {...register("client_id")}
                className="border border-ash-gray bg-white rounded-md h-10 px-3 font-body text-(--text-body-sm) text-graphite outline-none focus:border-composer-blue focus:shadow-(--shadow-subtle) cursor-pointer transition-all"
              >
                <option value="">— Sin cliente —</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} {client.company ? `(${client.company})` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>


          <div className="bg-white border border-ash-gray rounded-xl p-6 shadow-(--shadow-card) flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-[11px] font-bold text-steel-gray uppercase tracking-wider">
                  Fecha inicio
                </label>
                <input
                  type="datetime-local"
                  className="border border-ash-gray rounded-md h-10 px-3 font-body text-(--text-body-sm) outline-none focus:border-composer-blue focus:shadow-(--shadow-subtle) transition-all"
                  {...register("start_at", {
                    required: "La fecha de inicio es obligatoria",
                  })}
                />
                {errors.start_at && (
                  <span className="font-body text-[11px] text-action-red">
                    {errors.start_at.message as string}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-body text-[11px] font-bold text-steel-gray uppercase tracking-wider">
                  Fecha fin
                </label>
                <input
                  type="datetime-local"
                  className="border border-ash-gray rounded-md h-10 px-3 font-body text-(--text-body-sm) outline-none focus:border-composer-blue focus:shadow-(--shadow-subtle) transition-all"
                  {...register("end_at")}
                />
              </div>
            </div>


            <div className="flex flex-col gap-2">
              <label className="font-body text-[11px] font-bold text-steel-gray uppercase tracking-wider">
                Recordatorio
              </label>

              <label
                className={`flex items-center gap-3 h-10 px-3 rounded-md border cursor-pointer transition-all select-none ${
                  reminderEnabled
                    ? "border-composer-blue bg-composer-blue/5"
                    : "border-ash-gray bg-white hover:border-composer-blue/50"
                }`}
              >

                <input
                  type="checkbox"
                  checked={reminderEnabled}
                  onChange={(e) => setReminderEnabled(e.target.checked)}
                  className="sr-only"
                />


                <span
                  className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    reminderEnabled
                      ? "bg-composer-blue border-composer-blue"
                      : "bg-white border-ash-gray"
                  }`}
                >
                  {reminderEnabled && (
                    <svg
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 3.5L3.8 6.5L9 1"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>

                <span className="font-body text-(--text-body-sm) text-graphite flex-1">
                  Recordatorio 1 día antes
                </span>


                {reminderEnabled && startAt && (
                  <span className="font-body text-[11px] text-composer-blue font-medium">
                    {formatReminderDate(startAt)}
                  </span>
                )}
              </label>

              {reminderEnabled && !startAt && (
                <span className="font-body text-[11px] text-steel-gray">
                  Definí la fecha de inicio para calcular el recordatorio.
                </span>
              )}
            </div>
          </div>


          <div className="bg-white border border-ash-gray rounded-xl p-6 shadow-(--shadow-card) flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-[11px] font-bold text-steel-gray uppercase tracking-wider">
                Descripción
              </label>
              <textarea
                rows={4}
                className="border border-ash-gray rounded-md px-3 py-2 font-body text-(--text-body-sm) outline-none focus:border-composer-blue focus:shadow-(--shadow-subtle) transition-all resize-y"
                {...register("description")}
              />
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
              {IsEdit ? "Guardar cambios" : "Crear evento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
