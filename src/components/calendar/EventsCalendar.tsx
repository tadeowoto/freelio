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
    <div className="w-full h-full flex flex-col gap-8">
      <div className="w-full flex flex-col gap-6 md:flex-row md:items-end md:justify-between flex-shrink-0 pt-6">
        <h1 className="font-display font-extrabold text-[56px] md:text-[80px] text-midnight-ink leading-[0.9] tracking-tighter">
          {currentTitle}
        </h1>

        <div className="flex flex-row flex-wrap items-center gap-4 sm:gap-6 pb-2">
          <div className="flex flex-row items-center gap-2">
            <button
              onClick={handlePrev}
              className="w-10 h-10 flex items-center justify-center bg-white border border-ash-gray rounded-full text-midnight-ink font-body font-medium hover:bg-canvas-white transition-colors select-none outline-none focus:ring-2 focus:ring-composer-blue/50"
            >
              &lt;
            </button>
            <button
              onClick={handleToday}
              className="px-6 h-10 flex items-center justify-center bg-white border border-ash-gray rounded-full text-midnight-ink font-body font-medium text-body-sm hover:bg-canvas-white transition-colors select-none outline-none focus:ring-2 focus:ring-composer-blue/50"
            >
              Hoy
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 flex items-center justify-center bg-white border border-ash-gray rounded-full text-midnight-ink font-body font-medium hover:bg-canvas-white transition-colors select-none outline-none focus:ring-2 focus:ring-composer-blue/50"
            >
              &gt;
            </button>
          </div>

          <NewEventButton clients={clients} />
        </div>
      </div>

      <div className="flex flex-row flex-wrap items-center gap-x-6 gap-y-3 font-body text-body-sm text-midnight-ink font-medium flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="w-3.5 h-3.5 rounded-full bg-cadet-blue" />
          <span>Reunión</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-3.5 h-3.5 rounded-full bg-sunset-orange" />
          <span>Deadline</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-3.5 h-3.5 rounded-full bg-vivid-green" />
          <span>Entrega</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-3.5 h-3.5 rounded-full bg-sunny-yellow" />
          <span>Pago</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-3.5 h-3.5 rounded-full bg-bubblegum-pink" />
          <span>Seguimiento</span>
        </div>
      </div>

      <div className="w-full flex-1 min-h-0 overflow-x-auto bg-white border border-ash-gray rounded-md overflow-hidden">
        <div className="w-full h-full min-w-[768px] md:min-w-0 freelio-calendar-custom-grid">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={false}
            height="100%"
            locale="es"
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            selectable={true}
            eventContent={(eventInfo) => {
              const type = eventInfo.event.extendedProps.type || "otro";
              return (
                <div
                  className={`freelio-custom-event event-pill-${type} cursor-pointer hover:opacity-90 transition-opacity`}
                >
                  <span className="truncate">{eventInfo.event.title}</span>
                </div>
              );
            }}
            dayCellContent={(dayInfo) => {
              const isToday = dayInfo.isToday;
              return (
                <div className="w-full h-full flex flex-row items-start justify-start p-1.5 md:p-3">
                  <span
                    className={`font-body text-body-sm flex items-center justify-center ${
                      isToday
                        ? "w-7 h-7 bg-cadet-blue text-white font-bold rounded-full"
                        : "text-midnight-ink font-medium"
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
