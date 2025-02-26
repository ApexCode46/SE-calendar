import { useState, useEffect } from "react";
import { useDisclosure } from "@nextui-org/react";
import EditModal from "./EditModal";
import { useRouter } from "next/navigation";


const TableComponent = () => {
  const {
    isOpen: isOpenEditModal,
    onOpen: onOpenEditModal,
    onOpenChange: onChangeEditModal,
  } = useDisclosure();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectItem, setSelectItem] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  const router = useRouter();

  const handleEdit = (item) => {
    setSelectItem(item);
    onOpenEditModal();
  };

  const fetchMyReserve = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/myReserve");
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const results = await response.json();
      setData(results);
    } catch (e) {
      console.log("Error fetching data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReserve();
  }, []);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const filteredData = data.filter(
    (item) =>
      formatDate(item.user_res_timestamp)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.user_res_topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatDate(item.user_res_datetime_start)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      formatDate(item.user_res_datetime_end)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const deleteData = async (id) => {
    try {
      const response = await fetch(`/api/myReserve/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "ไม่สามารถลบข้อมูลได้");
      }
      await fetchMyReserve();
    } catch (e) {
      console.error("Error deleting data:", e);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex w-full max-w-sm">
          <input
            type="text"
            placeholder="ค้นหา"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="p-3 mx-7 bg-slate-700 text-white hover:bg-slate-800 rounded" onClick={() => router.push('/calendar')}>จอง</button>
        </div>
        

        <div className="shadow-md rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-gray-600">วันที่</th>
                <th className="px-6 py-3 text-left text-gray-600">หัวข้อ</th>
                <th className="px-6 py-3 text-left text-gray-600">
                  วัน/เวลาเริ่ม
                </th>
                <th className="px-6 py-3 text-left text-gray-600">
                  วัน/เวลาสิ้นสุด
                </th>
                <th className="px-6 py-3 text-left text-gray-600">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              ) : currentData.length > 0 ? (
                currentData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {formatDate(item.user_res_timestamp)}
                    </td>
                    <td className="px-6 py-4">{item.user_res_topic}</td>
                    <td className="px-6 py-4">
                      {formatDate(item.user_res_datetime_start)}
                    </td>
                    <td className="px-6 py-4">
                      {formatDate(item.user_res_datetime_end)}
                    </td>
                    <td className="py-4">
                      <button
                        className="bg-yellow-300 text-red-800 p-2 mx-1 rounded-[5px] shadow-md hover:bg-yellow-200"
                        onClick={() => handleEdit(item)}
                      >
                        แก้ไข
                      </button>
                      <button
                        className="bg-orange-600 text-yellow-300 p-2 px-4 rounded-[5px] shadow-md hover:bg-orange-500"
                        onClick={() => deleteData(item.user_reserve_id)}
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    ไม่มีข้อมูล
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredData.length > 0 && (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ย้อนกลับ
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? "bg-red-800 text-yellow-300"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ถัดไป
            </button>
          </div>
        )}
      </div>

      <EditModal
        isOpen={isOpenEditModal}
        onOpenChange={onChangeEditModal}
        selectedItem={selectItem}
        fetchMyReserve={fetchMyReserve}
      />
    </>
  );
};

export default TableComponent;
