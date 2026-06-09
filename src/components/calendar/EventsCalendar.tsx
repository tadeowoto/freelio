import { useRef, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { FullCalendarEvent, Client } from "../../types/types";
import NewEventButton from "./NewEventButton";
import NewEventFormModal from "./NewEventFormModal";

interface EventsCalendarProps {
  clients?: Client[];
  events: FullCalendarEvent[];
}

export default function EventsCalendar({
  events,
  clients,
}: EventsCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null);
  const [currentTitle, setCurrentTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const [isEdit, setIsEdit] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const handleDateClick = (info: { dateStr: string }) => {
    setIsEdit(false);
    setSelectedEvent(null);
    setSelectedDate(`${info.dateStr}T09:00`);
    setIsModalOpen(true);
  };

  const handleEventClick = (clickInfo: any) => {
    setIsEdit(true);

    const eventNode = clickInfo.event;
    setSelectedEvent({
      id: eventNode.id,
      title: eventNode.title,
      start_at: eventNode.startStr ? eventNode.startStr.substring(0, 16) : "",
      end_at: eventNode.endStr ? eventNode.endStr.substring(0, 16) : "",
      type: eventNode.extendedProps.type,
      status: eventNode.extendedProps.status,
      description: eventNode.extendedProps.description,
      client_id: eventNode.extendedProps.client_id,
    });

    setIsModalOpen(true);
  };

  const updateTitle = () => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      const FirstLetterUpper =
        api.view.title.charAt(0).toUpperCase() + api.view.title.slice(1);
      setCurrentTitle(FirstLetterUpper);
    }
  };

  useEffect(() => {
    updateTitle();
  }, []);

  const handlePrev = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().prev();
      updateTitle();
    }
  };

  const handleNext = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().next();
      updateTitle();
    }
  };

  const handleToday = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().today();
      updateTitle();
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <div className="w-full flex flex-col gap-4 md:flex-row md:items-center md:justify-between flex-shrink-0 mt-2">
        <h1 className="text-6xl font-bold font-display text-midnight-ink leading-none max-w-64">
          {currentTitle}
        </h1>

        <div className="flex flex-row flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex flex-row items-center gap-2">
            <button
              onClick={handlePrev}
              className="w-10 h-10 flex items-center justify-center bg-white border border-ash-gray rounded-full text-midnight-ink cursor-pointer hover:bg-canvas-white transition-colors select-none font-medium"
            >
              &lt;
            </button>
            <button
              onClick={handleToday}
              className="px-4 h-10 flex items-center justify-center bg-white border border-ash-gray rounded-full text-midnight-ink font-body font-medium text-(--text-body-sm) cursor-pointer hover:bg-canvas-white transition-colors select-none"
            >
              Hoy
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 flex items-center justify-center bg-white border border-ash-gray rounded-full text-midnight-ink cursor-pointer hover:bg-canvas-white transition-colors select-none font-medium"
            >
              &gt;
            </button>
          </div>

          <NewEventButton />
        </div>
      </div>

      <div className="flex flex-row flex-wrap items-center gap-x-4 gap-y-2 font-body text-(--text-body-sm) text-graphite font-medium flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-composer-blue" />
          <span>Reunión</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-sunset-orange" />
          <span>Deadline</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-vivid-green" />
          <span>Entrega</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-sunny-yellow" />
          <span>Pago</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-bubblegum-pink" />
          <span>Seguimiento</span>
        </div>
      </div>

      <div className="w-full flex-1 min-h-0 overflow-x-auto bg-white border border-ash-gray rounded-xl shadow-(--shadow-card) p-3 md:p-5">
        <div className="w-full h-full min-w-[640px] md:min-w-0 freelio-calendar-custom-grid">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={false}
            height="100%"
            locale="es"
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick} // Capturador nativo de clics en celdas ocupadas
            selectable={true}
            eventContent={(eventInfo) => {
              const type = eventInfo.event.extendedProps.type || "otro";
              return (
                <div
                  className={`freelio-custom-event event-pill-${type} cursor-pointer`}
                >
                  <span className="truncate">{eventInfo.event.title}</span>
                </div>
              );
            }}
            dayCellContent={(dayInfo) => {
              const isToday = dayInfo.isToday;
              return (
                <div className="w-full h-full flex flex-row items-start justify-start p-1 md:p-2">
                  <span
                    className={`font-body text-(--text-body-sm) flex items-center justify-center ${
                      isToday
                        ? "w-6 h-6 bg-composer-blue text-white font-bold rounded-full"
                        : "text-graphite"
                    }`}
                  >
                    {dayInfo.dayNumberText.replace("°", "")}
                  </span>
                </div>
              );
            }}
          />
        </div>
      </div>

      <NewEventFormModal
        isOpenModal={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultDate={selectedDate}
        IsEdit={isEdit}
        eventData={selectedEvent}
        clients={clients}
      />
    </div>
  );
}
