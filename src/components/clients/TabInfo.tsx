import { useState } from "react";
import { toast } from "sonner";
import type { Client } from "../../types/types";

export default function TabInfo({ client }: { client: Client }) {
  const [status, setStatus] = useState(client.status);
  const [loading, setLoading] = useState(false);

  const handleToggleStatus = async () => {
    const isActive = status === "activo";
    const newStatus = isActive ? "inactivo" : "activo";

    const confirmed = window.confirm(
      isActive
        ? "¿Seguro que querés dar de baja a este cliente?"
        : "¿Seguro que querés dar de alta a este cliente?",
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/edit/clients`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: client.id, status: newStatus }),
      });

      if (!response.ok)
        throw new Error("Error al actualizar el estado del cliente");

      toast.success(
        `Cliente ${isActive ? "dado de baja" : "dado de alta"} exitosamente`,
      );
      setStatus(newStatus);
    } catch (err) {
      toast.error("Error al actualizar el estado del cliente");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
      <div className="bg-white border border-ash-gray rounded-md p-6 md:p-8 lg:col-span-2 flex flex-col">
        <h2 className="font-display font-bold text-subheading text-midnight-ink leading-none tracking-tight mb-8">
          Información
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
          {[
            { label: "Empresa", value: client.company },
            { label: "Industria / Disciplina", value: client.company },
            { label: "Email", value: client.email },
            { label: "Teléfono", value: client.phone },
            { label: "Tarifa", value: client.fee },
            {
              label: "Estado de cobro",
              value:
                client.payment_status === "cobrado" ? "Al día" : "Pendiente",
            },
            {
              label: "Último contacto",
              value: client.last_contact_at
                ? new Date(client.last_contact_at).toLocaleDateString("es-AR")
                : "—",
            },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col">
              <span className="font-body text-[11px] font-bold text-steel-gray uppercase tracking-wider mb-2 leading-none">
                {label}
              </span>
              <span className="font-body font-medium text-body-sm text-midnight-ink leading-none">
                {value || "—"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-ash-gray rounded-md p-6 md:p-8 lg:col-span-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 max-w-md">
        <div className="flex items-center gap-3">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              status === "activo" ? "bg-vivid-green" : "bg-steel-gray"
            }`}
          />
          <div className="flex flex-col">
            <span className="font-body text-[11px] font-bold text-steel-gray uppercase tracking-wider leading-none mb-1">
              Estado del cliente
            </span>
            <span className="font-display font-bold text-[18px] text-midnight-ink leading-none tracking-tight">
              {status === "activo" ? "Activo" : "Inactivo"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleStatus}
          disabled={loading}
          className="px-5 py-2.5 rounded-full text-xs font-bold bg-canvas-white border border-sunset-orange text-sunset-orange hover:bg-sunset-orange hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Procesando..."
            : status === "activo"
              ? "Dar de baja"
              : "Dar de alta"}
        </button>
      </div>
    </div>
  );
}
