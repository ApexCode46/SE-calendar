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
    if (selectedItem) {
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
      return date.toISOString().slice(0, 16);
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
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>แก้ไขการจองห้อง</ModalHeader>
            <ModalBody>
              <hr />
              {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}
              <p className="mb-4">
                <label className="block mb-2 font-semibold" htmlFor="topic">
                  <strong>หัวข้อ : </strong>
                </label>
                <input
                  type="text"
                  id="topic"
                  name="topic"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={formData.topic}
                  onChange={handleChange}
                  placeholder="กรุณากรอกหัวข้อ"
                />
              </p>

              <p className="mb-4">
                <label className="block mb-2 font-semibold" htmlFor="description">
                  <strong>หมายเหตุ : </strong>
                </label>
                <textarea
                  id="description"
                  className="w-full px-4 py-2 border rounded-lg"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="กรุณากรอกหมายเหตุ"
                ></textarea>
              </p>

              <p className="mb-4">
                <label className="block mb-2 font-semibold" htmlFor="startDateTime">
                  <strong>วันที่เริ่ม :</strong>
                </label>
                <input
                  id="startDateTime"
                  type="datetime-local"
                  className="w-full px-4 py-2 border rounded-lg"
                  name="startDateTime"
                  value={formData.startDateTime}
                  onChange={handleChange}
                />
              </p>
              <p className="mb-4">
                <label className="block mb-2 font-semibold" htmlFor="endDateTime">
                  <strong>วันที่สิ้นสุด :</strong>
                </label>
                <input
                  id="endDateTime"
                  type="datetime-local"
                  className="w-full px-4 py-2 border rounded-lg"
                  name="endDateTime"
                  value={formData.endDateTime}
                  onChange={handleChange}
                />
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={() => onOpenChange(false)}>
                ยกเลิก
              </Button>
              <Button onPress={handleSubmit} isLoading={isLoading}>
                บันทึก
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditModal;
