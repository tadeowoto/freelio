import type { Event } from "../../types/types";
import { EventRow } from "./EventRow";

interface Props {
  events: Event[];
}

export default function TabEventos({ events }: Props) {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="bg-white border border-ash-gray rounded-xl p-8 shadow-(--shadow-card) flex flex-col gap-6">
        <h2 className="font-sans font-bold text-(--text-subheading) tracking-subheading text-midnight-ink">
          Eventos del cliente
        </h2>

        <div className="flex flex-col">
          {events.length > 0 ? (
            events.map((event, index) => (
              <EventRow
                key={event.id}
                event={event}
                isLast={index === events.length - 1}
              />
            ))
          ) : (
            <div className="text-center py-16 text-steel-gray font-body text-(--text-body-sm)">
              No hay eventos para este cliente.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
