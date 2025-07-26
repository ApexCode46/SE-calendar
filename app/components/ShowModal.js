import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";
import { useEffect, useState } from "react";

const ShowModal = ({ isOpen, onOpenChange, detailEvent }) => {
  const [fullName, setFullName] = useState("");
  const [userId, setUserId] = useState("");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "";
    const date = new Date(dateTimeStr);
    const pad = (num) => String(num).padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    if (detailEvent) {
      setFullName(`${detailEvent?.title || ''} ${detailEvent?.firstname || ''} ${detailEvent?.lastname || ''}`.trim());
      setUserId(detailEvent?.user_id || "ไม่มีข้อมูล");
      setTopic(detailEvent?.user_res_topic || "ไม่มีข้อมูล");
      setDescription(detailEvent?.user_res_description || "ไม่มีข้อมูล");
      setStartDateTime(formatDateTime(detailEvent?.user_res_datetime_start));
      setEndDateTime(formatDateTime(detailEvent?.user_res_datetime_end));
    }
  }, [detailEvent]);

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
        body: "max-h-[65vh] overflow-y-auto",
        footer: "border-t border-gray-200"
      }}
    >
      <ModalContent>
        <ModalHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg modal-header-mobile">
          <div className="flex items-center space-x-2">
            <span className="text-xl sm:text-2xl">👁️</span>
            <span className="text-lg sm:text-xl font-bold">รายละเอียดการจอง</span>
          </div>
        </ModalHeader>
        <ModalBody className="p-4 sm:p-6 modal-scroll-smooth">
          {detailEvent ? (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                  <span className="mr-2">📋</span>
                  ข้อมูลการจอง
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 modal-grid-responsive">
                {/* User Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center">
                        <span className="mr-2">👤</span>
                        ชื่อผู้จอง
                      </span>
                    </label>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                      <span className="text-gray-800 font-medium">{fullName}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center">
                        <span className="mr-2">🆔</span>
                        รหัสประจำตัว
                      </span>
                    </label>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                      <span className="text-gray-800 font-medium">{userId}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center">
                        <span className="mr-2">📝</span>
                        หัวข้อการจอง
                      </span>
                    </label>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                      <span className="text-gray-800 font-medium">{topic}</span>
                    </div>
                  </div>
                </div>

                {/* Time Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center">
                        <span className="mr-2">🕐</span>
                        วันที่และเวลาเริ่มต้น
                      </span>
                    </label>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                      <span className="text-green-800 font-medium">
                        {startDateTime ? new Date(startDateTime).toLocaleString('th-TH', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'ไม่มีข้อมูล'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center">
                        <span className="mr-2">🕐</span>
                        วันที่และเวลาสิ้นสุด
                      </span>
                    </label>
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                      <span className="text-red-800 font-medium">
                        {endDateTime ? new Date(endDateTime).toLocaleString('th-TH', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'ไม่มีข้อมูล'}
                      </span>
                    </div>
                  </div>

                  {/* Duration Calculation */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                    <div className="flex items-center space-x-2 text-purple-800">
                      <span className="text-lg">⏱️</span>
                      <span className="font-semibold">ระยะเวลาการจอง:</span>
                      <span className="font-bold text-purple-900">
                        {startDateTime && endDateTime ? 
                          `${Math.ceil((new Date(endDateTime) - new Date(startDateTime)) / (1000 * 60 * 60))} ชั่วโมง`
                          : 'ไม่สามารถคำนวณได้'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="flex items-center">
                    <span className="mr-2">📋</span>
                    รายละเอียด/หมายเหตุ
                  </span>
                </label>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 min-h-[80px]">
                  <span className="text-yellow-800 whitespace-pre-wrap">
                    {description || 'ไม่มีรายละเอียดเพิ่มเติม'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-600 font-medium text-lg">กำลังโหลดข้อมูล...</p>
              <p className="text-gray-400 mt-2">โปรดรอสักครู่</p>
            </div>
          )}
        </ModalBody>
        <div className="bg-gray-50 rounded-b-lg p-4 modal-footer-mobile">
          <div className="flex justify-center">
            <button
              onClick={() => onOpenChange(false)}
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <span className="flex items-center">
                <span className="mr-2">🚪</span>
                ปิดหน้าต่าง
              </span>
            </button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ShowModal;
