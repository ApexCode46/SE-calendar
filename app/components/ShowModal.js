import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

const ShowModal = ({ isOpen, onOpenChange, detailEvent }) => {
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
      setUserId(detailEvent?.user_id || "ไม่มีข้อมูล");
      setTopic(detailEvent?.user_res_topic || "ไม่มีข้อมูล");
      setDescription(detailEvent?.user_res_description || "ไม่มีข้อมูล");
      setStartDateTime(formatDateTime(detailEvent?.user_res_datetime_start));
      setEndDateTime(formatDateTime(detailEvent?.user_res_datetime_end));
    }
  }, [detailEvent]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>รายละเอียด</ModalHeader>
        <ModalBody>
          {detailEvent ? (
            <>
              <p>
                <strong>รหัสประจำตัว:</strong>
                <input
                  type="text"
                  value={userId}
                  disabled
                  className="w-full p-2 border rounded"
                />
              </p>
              <p>
                <strong>หัวข้อ:</strong>
                <input
                  type="text"
                  value={topic}
                  disabled
                  className="w-full p-2 border rounded"
                />
              </p>
              <p>
                <strong>วันที่เริ่ม:</strong>
                <input
                  type="datetime-local"
                  value={startDateTime}
                  disabled
                  className="w-full p-2 border rounded"
                />
              </p>
              <p>
                <strong>วันที่สิ้นสุด:</strong>
                <input
                  type="datetime-local"
                  value={endDateTime}
                  disabled
                  className="w-full p-2 border rounded"
                />
              </p>
              <p>
                <strong>หมายเหตุ:</strong>
                <textarea
                  
                  value={description}
                  disabled
                  className="w-full p-2 border rounded"
                ></textarea>
              </p>
            </>
          ) : (
            <p>กำลังโหลดข้อมูล...</p>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ShowModal;
