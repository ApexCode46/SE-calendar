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
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>จองห้อง</ModalHeader>
        <ModalBody>
          <hr />
          {selectedInfo ? (
            <>
              <p className="mb-4">
                <strong>ข้อมูลผู้จอง :</strong>{session?.user?.title}{session?.user?.firstname}{session?.user?.lastname}
              </p>

              <p className="mb-4">
                <strong>รหัส :</strong> {session?.user?.id}
              </p>

              {errorMessage && (
                <p className="mb-4 text-red-600">{errorMessage}</p>
              )}

              <p className="mb-4">
                <label htmlFor="topic" className="block mb-2 font-semibold">
                  หัวข้อ :
                </label>
                <input
                  type="text"
                  id="topic"
                  className=" px-4 py-2 border rounded-lg"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="กรุณากรอกหัวข้อ"
                  required
                />
              </p>

              <p className="mb-4">
                <label htmlFor="description" className="block mb-2 font-semibold">
                  หมายเหตุ :
                </label>
                <textarea
                  id="description"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="กรุณากรอกหมายเหตุ"
                  required
                ></textarea>
              </p>

              <p className="mb-4">
                <label htmlFor="startDateTime" className="block mb-2 font-semibold">
                  วันที่และเวลาเริ่ม :
                </label>
                <input
                  type="datetime-local"
                  id="startDateTime"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={startDateTime}
                  onChange={(e) => setStartDateTime(e.target.value)}
                />
              </p>

              <p className="mb-4">
                <label htmlFor="endDateTime" className="block mb-2 font-semibold">
                  วันที่และเวลาสิ้นสุด :
                </label>
                <input
                  type="datetime-local"
                  id="endDateTime"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={endDateTime}
                  onChange={(e) => setEndDateTime(e.target.value)}
                />
              </p>
            </>
          ) : (
            <p className="text-red-600">กรุณาเลือกวันและเวลาที่ต้องการจอง</p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            variant="flat"
            color="success"
            className="bg-yellow-300 p-3 mr-5"
            onPress={handleAddEvent}
            disabled={isLoading || !selectedInfo}
            isLoading={isLoading}
          >
            จองห้อง
          </Button>
          <Button
            variant="flat"
            color="error"
            className="bg-red-800 text-yellow-300 px-5"
            onPress={() => onOpenChange(false)}
            disabled={isLoading}
          >
            ปิด
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateModal;
