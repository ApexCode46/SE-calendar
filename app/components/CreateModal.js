import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const CreateModal = ({ isOpen, onOpenChange, selectedInfo, fetchEvents }) => {
  const { data: session, status } = useSession();
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");



  const handleAddEvent = async () => {
    if (!topic.trim()) {
      setErrorMessage("กรุณากรอกหัวข้อ");
      return;
    }
    if (!startDateTime) {
      setErrorMessage("กรุณาเลือกวันที่และเวลาเริ่มต้น");
      return;
    }
    if (!endDateTime) {
      setErrorMessage("กรุณาเลือกวันที่และเวลาสิ้นสุด");
      return;
    }
    if (new Date(startDateTime) >= new Date(endDateTime)) {
      setErrorMessage("วันที่เริ่มต้นต้องน้อยกว่า วันที่สิ้นสุด");
      return;
    }

    const newEvent = {
      topic: topic,
      start: startDateTime,
      end: endDateTime,
      description: description,
    };

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      });
      
      console.log(response);
      
      if (response.ok) {
        fetchEvents();

        setTopic("");
        setDescription("");
        setStartDateTime("");
        setEndDateTime("");
        onOpenChange(false);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "เกิดข้อผิดพลาดในการเพิ่มกิจกรรม!");
        console.log("Error adding event", response.statusText);
      }
    } catch (e) {
      setErrorMessage("เกิดข้อผิดพลาดในการเพิ่มกิจกรรม");
      console.log("Error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  
  const formatDateTime = (dateTimeStr) => {
    console.log(dateTimeStr);
    
    if (!dateTimeStr) return "";
    
    const pad = (num) => String(num).padStart(2, "0");
  
    if (dateTimeStr.includes('T') && dateTimeStr.includes(':')) {
        const match = dateTimeStr.match(/(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/);
        if (match) {
            return `${match[1]}T${match[2]}`;
        }
    }
    const cleanStr = dateTimeStr.trim();
    let year, month, day, hours = "00", minutes = "00";
    
    if (cleanStr.includes(' ')) {
        const [datePart, timePart] = cleanStr.split(' ');
        [year, month, day] = datePart.split('-');
        
        if (timePart) {
            const timeParts = timePart.split(':');
            hours = pad(timeParts[0] || "00");
            minutes = pad(timeParts[1] || "00");
        }
    } else {
        [year, month, day] = cleanStr.split('-');
    }
    
    return `${year}-${pad(month)}-${pad(day)}T${hours}:${minutes}`;
};

  useEffect(() => {
    if (selectedInfo) {
      setTopic(selectedInfo?.title || "");
      setDescription(selectedInfo?.description || "");

      setStartDateTime(formatDateTime(selectedInfo?.startStr));
      setEndDateTime(formatDateTime(selectedInfo?.endStr));
    } else {
      setTopic("");
      setDescription("");
      setStartDateTime("");
      setEndDateTime("");
      setErrorMessage("");
    }
  }, [selectedInfo]);

  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={onOpenChange} 
      size="2xl" 
      className="mx-4"
      scrollBehavior="inside"
      placement="center"
      backdrop="blur"
      classNames={{
        base: "max-h-[95vh] my-2",
        wrapper: "p-4",
        body: "max-h-[60vh] overflow-y-auto",
        footer: "border-t border-gray-200"
      }}
    >
      <ModalContent>
        <ModalHeader className="bg-gradient-to-r from-red-600 to-red-800 text-yellow-300 rounded-t-lg modal-header-mobile">
          <div className="flex items-center space-x-2">
            <span className="text-xl sm:text-2xl">📅</span>
            <span className="text-lg sm:text-xl font-bold">สร้างการจองใหม่</span>
          </div>
        </ModalHeader>
        <ModalBody className="p-4 sm:p-6 modal-scroll-smooth">
          {selectedInfo ? (
            <div className="space-y-6">
              {/* User Info Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                  <span className="mr-2">👤</span>
                  ข้อมูลผู้จอง
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 modal-grid-responsive">
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">ชื่อผู้จอง</label>
                    <div className="bg-white p-3 rounded-lg border border-blue-200">
                      <span className="text-blue-900 font-medium text-sm sm:text-base">
                        {session?.user?.title} {session?.user?.firstname} {session?.user?.lastname}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">รหัสประจำตัว</label>
                    <div className="bg-white p-3 rounded-lg border border-blue-200">
                      <span className="text-blue-900 font-medium text-sm sm:text-base">{session?.user?.id}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 p-4 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-red-500 mr-2 text-lg">⚠️</span>
                    <span className="text-red-700 font-medium">{errorMessage}</span>
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-5">
                <div>
                  <label htmlFor="topic" className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center">
                      <span className="mr-2">📝</span>
                      หัวข้อการจอง
                    </span>
                  </label>
                  <input
                    type="text"
                    id="topic"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 mobile-input"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="กรุณากรอกหัวข้อการจอง"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center">
                      <span className="mr-2">📋</span>
                      รายละเอียด/หมายเหตุ
                    </span>
                  </label>
                  <textarea
                    id="description"
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="กรุณากรอกรายละเอียดหรือหมายเหตุเพิ่มเติม"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 modal-grid-responsive">
                  <div>
                    <label htmlFor="startDateTime" className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center">
                        <span className="mr-2">🕐</span>
                        วันที่และเวลาเริ่มต้น
                      </span>
                    </label>
                    <input
                      type="datetime-local"
                      id="startDateTime"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                      value={startDateTime}
                      onChange={(e) => setStartDateTime(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="endDateTime" className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center">
                        <span className="mr-2">🕐</span>
                        วันที่และเวลาสิ้นสุด
                      </span>
                    </label>
                    <input
                      type="datetime-local"
                      id="endDateTime"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                      value={endDateTime}
                      onChange={(e) => setEndDateTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-3xl">📅</span>
              </div>
              <p className="text-red-600 font-medium text-lg">กรุณาเลือกวันและเวลาที่ต้องการจอง</p>
              <p className="text-gray-500 mt-2">คลิกที่ปฏิทินเพื่อเลือกช่วงเวลา</p>
            </div>
          )}
        </ModalBody>
        <ModalFooter className="bg-gray-50 rounded-b-lg p-4 sm:p-6 modal-footer-mobile">
          <div className="flex flex-col sm:flex-row gap-3 w-full mobile-button-stack">
            <Button
              variant="flat"
              color="danger"
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-xl transition-all duration-200"
              onPress={() => onOpenChange(false)}
              disabled={isLoading}
            >
              <span className="flex items-center justify-center">
                <span className="mr-2">✖️</span>
                ยกเลิก
              </span>
            </Button>
            <Button
              variant="flat"
              color="success"
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              onPress={handleAddEvent}
              disabled={isLoading || !selectedInfo}
              isLoading={isLoading}
            >
              <span className="flex items-center justify-center">
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    กำลังจอง...
                  </>
                ) : (
                  <>
                    <span className="mr-2">✅</span>
                    ยืนยันการจอง
                  </>
                )}
              </span>
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateModal;
