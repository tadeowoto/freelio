import type { Event } from "../../types/types";
import { EventRow } from "./EventRow";

interface Props {
  events: Event[];
}

export default function TabEventos({ events }: Props) {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="bg-white border border-ash-gray rounded-md p-6 md:p-8 flex flex-col w-full">
        <h2 className="font-display font-bold text-[24px] text-midnight-ink leading-none tracking-tight mb-6">
          Eventos del cliente
        </h2>

        <div className="flex flex-col w-full">
          {events.length > 0 ? (
            events.map((event, index) => (
              <EventRow
                key={event.id}
                event={event}
                isLast={index === events.length - 1}
              />
            ))
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center bg-canvas-white border border-ash-gray rounded-md mt-2">
              <p className="font-body text-[14px] font-medium text-steel-gray">
                No hay eventos para este cliente.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
