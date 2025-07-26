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
    // console.log(info);
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
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 flex justify-center items-center pt-16">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">กำลังโหลดข้อมูล...</p>
          <p className="text-sm text-gray-400 mt-2">โปรดรอสักครู่</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 pt-16">
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center">
                <span className="text-yellow-300 text-xl">📅</span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">ปฏิทินการจอง</h1>
                <p className="text-gray-600 text-sm">จัดการการจองห้องสาขาของคุณ</p>
              </div>
            </div>
            <button
              onClick={() => router.push("/reserve")}
              className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-red-800 font-semibold py-2 px-6 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              การจองของฉัน
            </button>
          </div>
        </div>

        {/* Calendar Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="calendar-container">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: "prev,today,next",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                }}
                events={events.map((event) => ({
                  id: event.user_reserve_id,
                  title: event.user_res_topic,
                  start: event.user_res_datetime_start, 
                  end: event.user_res_datetime_end,
                  description: event.user_res_description,
                  backgroundColor: "#dc2626",  
                  borderColor: "#b91c1c",   
                  textColor: "#fef3c7",
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
                height="auto"
                aspectRatio={1.35}
                dayMaxEvents={3}
                moreLinkClick="popover"
                eventDisplay="block"
                displayEventTime={true}
                allDaySlot={false}
                slotMinTime="06:00:00"
                slotMaxTime="22:00:00"
                businessHours={{
                  daysOfWeek: [1, 2, 3, 4, 5, 6],
                  startTime: '08:00',
                  endTime: '20:00',
                }}
              />
            </div>
          </div>
        </div>

        {/* Instructions Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 mt-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <span className="mr-2">💡</span>
            คำแนะนำการใช้งาน
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div className="flex items-start space-x-2">
              <span className="text-blue-600">•</span>
              <span>คลิกที่วันที่เพื่อสร้างการจองใหม่</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-600">•</span>
              <span>คลิกที่กิจกรรมเพื่อดูรายละเอียด</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-600">•</span>
              <span>ใช้ปุ่มมุมมองเพื่อเปลี่ยนการแสดงผล</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-600">•</span>
              <span>เข้าไปที่ "การจองของฉัน" เพื่อจัดการ</span>
            </div>
          </div>
        </div>
      </div>

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

      <style jsx global>{`
        .fc-theme-standard .fc-scrollgrid {
          border-radius: 0.75rem;
          overflow: hidden;
        }
        .fc-theme-standard td, .fc-theme-standard th {
          border-color: #e5e7eb;
        }
        .fc-col-header-cell {
          background: linear-gradient(to right, #fef3c7, #fde68a);
          font-weight: 600;
          color: #92400e;
        }
        .fc-daygrid-day-number {
          color: #374151;
          font-weight: 500;
        }
        .fc-day-today {
          background-color: #fef3c7 !important;
        }
        .fc-event {
          border-radius: 0.5rem;
          padding: 2px 4px;
          font-size: 0.875rem;
          font-weight: 500;
        }
        .fc-button-primary {
          background: linear-gradient(to right, #dc2626, #b91c1c);
          border-color: #b91c1c;
          border-radius: 0.5rem;
          font-weight: 600;
        }
        .fc-button-primary:hover {
          background: linear-gradient(to right, #b91c1c, #991b1b);
          border-color: #991b1b;
        }
        .fc-toolbar-title {
          color: #374151;
          font-weight: 700;
        }
        @media (max-width: 768px) {
          .fc-toolbar {
            flex-direction: column;
            gap: 0.5rem;
          }
          .fc-toolbar-chunk {
            display: flex;
            justify-content: center;
          }
          .fc-button-group {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
}