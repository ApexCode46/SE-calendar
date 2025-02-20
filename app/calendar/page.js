"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import thLocale from "@fullcalendar/core/locales/th";
import { useDisclosure } from "@nextui-org/react";
import CreateModal from "../components/CreateModal";
import ShowModal from "../components/ShowModal";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Calendar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    isOpen: isOpenCreateModal,
    onOpen: onOpenCreateModal,
    onOpenChange: onChangeCreateModal,
  } = useDisclosure();
  const {
    isOpen: isOpenShowModal,
    onOpen: onOpenShowModal,
    onOpenChange: onChangeShowModal,
  } = useDisclosure();
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [events, setEvents] = useState([]);
  const [detailEvent, setDetailEvent] = useState([]);
  const [loading, setLoading] = useState(true);
  
  
  const handleSelect = (info) => {
    setSelectedInfo(info);
    onOpenCreateModal();
  };
   
  const handleShow = async (info) => {
    const id = info.event.id;
    try {
      const response = await fetch(`/api/item/${id}`);

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const results = await response.json();
      setDetailEvent(results);
      onOpenShowModal();
    } catch (e) {
      console.error("Error fetching event details:", e.message);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/event");
      if (!response.ok) {
        throw new Error("something wrong");
      }
      const results = await response.json();
      setEvents(results);
    } catch (e) {
      console.log("Error fetching events:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }

    if (status === 'authenticated') {
      fetchEvents();
    }
  }, [status, router, session]);

  if (loading || status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,today,next",
          center: "title",
          right:
            "dayGridMonth,timeGridWeek,timeGridDay,listWeek,myCustomButton",
        }}
        customButtons={{
          myCustomButton: {
            text: "การจองของฉัน",
            click: function () {
              router.push("/reserve");
            },
          },
        }}
        events={events.map((event) => ({
          id: event.user_reserve_id,
          title: event.user_res_topic,
          start: event.user_res_datetime_start,
          end: event.user_res_datetime_end,
          description: event.user_res_description,
        }))}
        eventTimeFormat={{
          hour: "numeric",
          minute: "2-digit",
          meridiem: false,
        }}
        slotLabelFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        selectable={true}
        select={handleSelect}
        eventClick={handleShow}
        locale={thLocale}
      />
      <CreateModal
        isOpen={isOpenCreateModal}
        onOpenChange={onChangeCreateModal}
        selectedInfo={selectedInfo}
        fetchEvents={fetchEvents}
      />
      
      <ShowModal
        isOpen={isOpenShowModal}
        onOpenChange={onChangeShowModal}
        detailEvent={detailEvent}
      />
    </>
  );
}