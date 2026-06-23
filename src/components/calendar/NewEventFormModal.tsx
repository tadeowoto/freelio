import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import { modalBackdrop, modalContent } from "../../lib/animations";
import type { EventFormValues, Client } from "../../types/types";
import { toast } from "sonner";

type NewEventFormModalProps = {
  isOpenModal: boolean;
  onClose: () => void;
  defaultDate?: string;
  IsEdit?: boolean;
  eventData?: any;
  clients?: Client[];
  onSuccess?: (data: any) => void;
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
  onSuccess,
}: NewEventFormModalProps) {
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

    const reminder_sent = !reminderEnabled;

    const formData: any = {
      client_id: data.client_id || null,
      title: data.title,
      description: data.description,
      type: eventType,
      start_at: data.start_at,
      end_at: data.end_at || null,
      status: data.status || "pendiente",
      reminder: reminderTimestamp,
      reminder_sent:
        IsEdit && reminderEnabled && !startAtChanged
          ? (eventData?.reminder_sent ?? false)
          : reminder_sent,
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

      const savedEvent = await response.json();
      toast.success("Evento guardado correctamente");

      onSuccess?.(savedEvent);
      onClose();
    } catch (err) {
      toast.error("Error al guardar el evento");
      console.error(err);
    }
  });

  return (
    <motion.div
      variants={modalBackdrop}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 sm:p-6"
      onClick={handleBackdropClick}
    >
      <motion.div
        variants={modalContent}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-canvas-white w-full max-w-160 max-h-[90vh] rounded-2xl shadow-dark overflow-y-auto relative flex flex-col hide-scrollbar"
      >
        <div className="absolute top-0 left-0 w-full h-40 pointer-events-none overflow-hidden select-none rounded-t-2xl z-0">
          <div className="absolute top-0 left-0 w-32 h-24 bg-cadet-blue"></div>
          <div className="absolute top-0 left-32 w-16 h-12 bg-sunny-yellow"></div>

          <div className="absolute top-4 right-32 w-20 h-10 bg-cadet-blue mix-blend-multiply opacity-50">
            <div
              className="w-full h-full opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, black 1px, transparent 0)",
                backgroundSize: "8px 8px",
              }}
            ></div>
          </div>
          <div className="absolute top-4 right-12 w-24 h-10 bg-bubblegum-pink mix-blend-multiply"></div>
          <div className="absolute top-12 right-0 w-16 h-20 bg-vivid-green"></div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-white border border-ash-gray text-midnight-ink font-body font-medium text-lg cursor-pointer hover:bg-canvas-white transition-colors z-20 shadow-sm"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L13 13M1 13L13 1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <form
          onSubmit={onSubmit}
          className="p-6 md:p-8 pt-16 flex flex-col gap-6 relative z-10 w-full"
        >
          <h1 className="font-display font-bold text-[48px] md:text-heading-lg tracking-tighter text-midnight-ink leading-none mb-2 mix-blend-multiply">
            {IsEdit ? "Editar evento" : "Nuevo evento"}
          </h1>

          <div className="bg-white border border-ash-gray rounded-xl p-6 md:p-8 flex flex-col gap-6 w-full">
            <h2 className="font-display font-bold text-[20px] text-midnight-ink leading-none tracking-tight">
              Detalles
            </h2>

            <div className="flex flex-col gap-2">
              <label className="font-body text-[11px] font-bold text-steel-gray uppercase tracking-wider">
                Título del evento
              </label>
              <input
                type="text"
                placeholder="Kickoff branding"
                className="w-full border-b border-ash-gray pb-2 pt-1 font-display font-bold text-[32px] md:text-[40px] text-midnight-ink placeholder:text-steel-gray/60 outline-none focus:border-cadet-blue bg-transparent transition-colors tracking-tight"
                {...register("title", {
                  required: "El título es obligatorio",
                })}
              />
              {errors.title && (
                <span className="font-body text-[11px] text-action-red mt-1">
                  {errors.title.message as string}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <label className="font-body text-[11px] font-bold text-steel-gray uppercase tracking-wider">
                Tipo de evento
              </label>
              <div className="flex flex-wrap gap-3">
                {EVENT_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setEventType(type.value)}
                    className={`h-10 px-5 rounded-full font-body text-body-sm font-medium border transition-all cursor-pointer outline-none focus:ring-2 focus:ring-cadet-blue/50 ${
                      eventType === type.value
                        ? "bg-cadet-blue text-white border-cadet-blue"
                        : "bg-white text-midnight-ink border-ash-gray hover:border-midnight-ink"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-body text-[11px] font-bold text-steel-gray uppercase tracking-wider">
                Cliente vinculado (opcional)
              </label>
              <select
                {...register("client_id")}
                className="border border-ash-gray bg-white rounded-md h-12 px-4 font-body text-body-sm font-medium text-midnight-ink outline-none focus:border-cadet-blue transition-colors cursor-pointer appearance-none"
                style={{
                  backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%23000000%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                  backgroundSize: "16px",
                }}
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

          <div className="bg-white border border-ash-gray rounded-xl p-6 md:p-8 flex flex-col gap-6 w-full">
            <h2 className="font-display font-bold text-[20px] text-midnight-ink leading-none tracking-tight">
              Fecha y hora
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-body text-[11px] font-bold text-steel-gray uppercase tracking-wider">
                  Fecha inicio
                </label>
                <input
                  type="datetime-local"
                  className="border border-ash-gray rounded-md h-12 px-4 font-body text-body-sm font-medium text-midnight-ink outline-none focus:border-cadet-blue transition-colors"
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

              <div className="flex flex-col gap-2">
                <label className="font-body text-[11px] font-bold text-steel-gray uppercase tracking-wider">
                  Fecha fin
                </label>
                <input
                  type="datetime-local"
                  className="border border-ash-gray rounded-md h-12 px-4 font-body text-body-sm font-medium text-midnight-ink outline-none focus:border-cadet-blue transition-colors"
                  {...register("end_at")}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 mt-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={reminderEnabled}
                  onChange={() => setReminderEnabled(!reminderEnabled)}
                />
                <div className="w-11 h-6 bg-ash-gray peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vivid-green"></div>
                <span className="ml-3 font-body font-medium text-body text-midnight-ink">
                  Enviar recordatorio
                </span>
              </label>
            </div>
            {reminderEnabled && startAt && (
              <span className="font-body text-[12px] text-steel-gray mt-1">
                Recordatorio: {formatReminderDate(startAt)}
              </span>
            )}
          </div>

          <div className="bg-white border border-ash-gray rounded-xl p-6 md:p-8 flex flex-col gap-6 w-full">
            <h2 className="font-display font-bold text-[20px] text-midnight-ink leading-none tracking-tight">
              Descripción
            </h2>
            <div className="flex flex-col gap-2">
              <label className="font-body text-[11px] font-bold text-steel-gray uppercase tracking-wider">
                Notas
              </label>
              <textarea
                rows={4}
                className="border border-ash-gray rounded-md px-4 py-3 font-body text-body-sm font-medium text-midnight-ink outline-none focus:border-cadet-blue transition-colors resize-y"
                {...register("description")}
              />
            </div>
          </div>

          <div className="w-full flex flex-row items-center justify-end gap-6 pt-4 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="font-body font-bold text-body-sm text-midnight-ink bg-transparent border-none cursor-pointer hover:underline outline-none"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="h-12 px-8 bg-cadet-blue text-white border-none rounded-full font-body font-bold text-body-sm cursor-pointer hover:opacity-90 transition-opacity outline-none focus:ring-2 focus:ring-cadet-blue/50 focus:ring-offset-2"
            >
              {IsEdit ? "Guardar cambios" : "Crear evento"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
