import type { Event } from "../../types/types";

interface EventRowProps {
  event: Event;
  isLast: boolean;
}

const eventColorMap: Record<string, string> = {
  reunion: "bg-composer-blue",
  deadline: "bg-sunset-orange",
  entrega: "bg-vivid-green",
  pago: "bg-sunny-yellow",
  seguimiento: "bg-bubblegum-pink",
  otro: "bg-steel-gray",
};

const eventLabelMap: Record<string, string> = {
  reunion: "Reunión",
  deadline: "Deadline",
  entrega: "Entrega",
  pago: "Pago",
  seguimiento: "Seguimiento",
  otro: "Otro",
};

export function EventRow({ event, isLast }: EventRowProps) {
  const borderClass = eventColorMap[event.type] || eventColorMap.otro;
  const labelText = eventLabelMap[event.type] || eventLabelMap.otro;

  const formatDateShort = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date
        .toLocaleDateString("es-AR", {
          day: "numeric",
          month: "short",
        })
        .replace(".", "");
    } catch {
      return "—";
    }
  };

  return (
    <div
      className={`w-full flex flex-row items-center justify-between py-4 group ${
        !isLast ? "border-b border-ash-gray/60" : ""
      }`}
    >
      <div className="flex flex-row items-center gap-4">
        <div className={`w-1 h-10 rounded-[var(--radius-sm)] ${borderClass}`} />
        <div className="flex flex-col">
          <span className="font-sans font-bold text-(--text-body) text-midnight-ink group-hover:text-composer-blue transition-colors duration-150">
            {event.title}
          </span>
          <span className="font-body text-(--text-body-sm) text-steel-gray mt-0.5">
            {labelText}
          </span>
        </div>
      </div>
    </div>
  );
}
