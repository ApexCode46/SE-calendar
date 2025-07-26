import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

const EditModal = ({ isOpen, onOpenChange, selectedItem, fetchMyReserve }) => {
  const [formData, setFormData] = useState({
    user_reserve_id: "",
    topic: "",
    description: "",
    startDateTime: "",
    endDateTime: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (selectedItem && Object.keys(selectedItem).length > 0) { 

      setFormData({
        user_reserve_id: selectedItem.user_reserve_id || "",
        topic: selectedItem.user_res_topic || "",
        description: selectedItem.user_res_description || "",
        startDateTime: formatDateTimeForInput(selectedItem.user_res_datetime_start) || "",
        endDateTime: formatDateTimeForInput(selectedItem.user_res_datetime_end) || "",
      });
    } else {
      setFormData({
        user_reserve_id: "",
        topic: "",
        description: "",
        startDateTime: "",
        endDateTime: "",
      });
    }
  }, [selectedItem]);

  const formatDateTimeForInput = (dateTimeString) => {
    if (!dateTimeString) return "";
    try {

      const date = new Date(dateTimeString);
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMessage("");
  };

  const handleSubmit = async () => {
    if (!formData.user_reserve_id || isLoading) return;

    if (!formData.topic) {
      setErrorMessage("กรุณากรอกหัวข้อ");
      return;
    }
    if (!formData.startDateTime) {
      setErrorMessage("กรุณาเลือกวันที่และเวลาเริ่มต้น");
      return;
    }
    if (!formData.endDateTime) {
      setErrorMessage("กรุณาเลือกวันที่และเวลาสิ้นสุด");
      return;
    }
    if (new Date(formData.startDateTime) >= new Date(formData.endDateTime)) {
      setErrorMessage("วันที่เริ่มต้นต้องน้อยกว่า วันที่สิ้นสุด");
      return;
    }

    const updateData = {
      topic: formData.topic,
      description: formData.description,
      startDateTime: formData.startDateTime,
      endDateTime: formData.endDateTime,
    };

    try {
      setIsLoading(true);
      const response = await fetch(`/api/myReserve/${formData.user_reserve_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "ไม่สามารถแก้ไขข้อมูลได้");
      }

      setErrorMessage("");
      await fetchMyReserve();
      onOpenChange(false);
    } catch (e) {
      console.log("Error:", e);
      setErrorMessage("เกิดข้อผิดพลาดในการแก้ไขกิจกรรม");
    } finally {
      setIsLoading(false);
    }
  };

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
        {(onClose) => (
          <>
            <ModalHeader className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-t-lg modal-header-mobile">
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl">✏️</span>
                <span className="text-lg sm:text-xl font-bold">แก้ไขการจอง</span>
              </div>
            </ModalHeader>
            <ModalBody className="p-4 sm:p-6 modal-scroll-smooth">
              <div className="space-y-6">
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="topic">
                      <span className="flex items-center">
                        <span className="mr-2">📝</span>
                        หัวข้อการจอง
                      </span>
                    </label>
                    <input
                      type="text"
                      id="topic"
                      name="topic"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 mobile-input"
                      value={formData.topic}
                      onChange={handleChange}
                      placeholder="กรุณากรอกหัวข้อการจอง"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="description">
                      <span className="flex items-center">
                        <span className="mr-2">📋</span>
                        รายละเอียด/หมายเหตุ
                      </span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 resize-none"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="กรุณากรอกรายละเอียดหรือหมายเหตุเพิ่มเติม"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 modal-grid-responsive">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="startDateTime">
                        <span className="flex items-center">
                          <span className="mr-2">🕐</span>
                          วันที่และเวลาเริ่มต้น
                        </span>
                      </label>
                      <input
                        id="startDateTime"
                        type="datetime-local"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                        name="startDateTime"
                        value={formData.startDateTime}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="endDateTime">
                        <span className="flex items-center">
                          <span className="mr-2">🕐</span>
                          วันที่และเวลาสิ้นสุด
                        </span>
                      </label>
                      <input
                        id="endDateTime"
                        type="datetime-local"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                        name="endDateTime"
                        value={formData.endDateTime}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-600 text-lg">💡</span>
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">เคล็ดลับ:</p>
                      <ul className="space-y-1 text-blue-700">
                        <li>• ตรวจสอบเวลาให้ถูกต้องก่อนบันทึก</li>
                        <li>• เวลาเริ่มต้นต้องน้อยกว่าเวลาสิ้นสุด</li>
                        <li>• ควรระบุรายละเอียดเพื่อความชัดเจน</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="bg-gray-50 rounded-b-lg p-4 sm:p-6 modal-footer-mobile">
              <div className="flex flex-col sm:flex-row gap-3 w-full mobile-button-stack">
                <Button 
                  variant="light" 
                  onPress={() => onOpenChange(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-xl transition-all duration-200"
                  disabled={isLoading}
                >
                  <span className="flex items-center justify-center">
                    <span className="mr-2">✖️</span>
                    ยกเลิก
                  </span>
                </Button>
                <Button 
                  onPress={handleSubmit} 
                  isLoading={isLoading}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  disabled={isLoading}
                >
                  <span className="flex items-center justify-center">
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        กำลังบันทึก...
                      </>
                    ) : (
                      <>
                        <span className="mr-2">💾</span>
                        บันทึกการแก้ไข
                      </>
                    )}
                  </span>
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditModal;
