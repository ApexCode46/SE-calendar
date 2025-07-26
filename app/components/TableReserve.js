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
      <div className="space-y-6">
        {/* Search and Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="ค้นหาการจอง..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
          </div>
          <button 
            className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-yellow-300 font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2" 
            onClick={() => router.push('/calendar')}
          >
            <span>📅</span>
            <span>สร้างการจองใหม่</span>
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">วันที่สร้าง</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">หัวข้อ</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">วัน/เวลาเริ่ม</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">วัน/เวลาสิ้นสุด</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
                      <span>กำลังโหลดข้อมูล...</span>
                    </div>
                  </td>
                </tr>
              ) : currentData.length > 0 ? (
                currentData.map((item, index) => (
                  <tr key={item.user_reserve_id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(item.user_res_timestamp)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{item.user_res_topic}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(item.user_res_datetime_start)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(item.user_res_datetime_end)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-red-800 font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                          onClick={() => handleEdit(item)}
                        >
                          แก้ไข
                        </button>
                        <button
                          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                          onClick={() => deleteData(item.user_reserve_id)}
                        >
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-4xl">📋</span>
                      <span>ไม่มีข้อมูลการจอง</span>
                      <button 
                        onClick={() => router.push('/calendar')}
                        className="mt-2 text-red-600 hover:text-red-800 font-medium"
                      >
                        สร้างการจองแรกของคุณ
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
                <span className="text-gray-500">กำลังโหลดข้อมูล...</span>
              </div>
            </div>
          ) : currentData.length > 0 ? (
            currentData.map((item) => (
              <div key={item.user_reserve_id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg text-gray-900">{item.user_res_topic}</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {formatDate(item.user_res_timestamp)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 font-medium">เริ่ม:</p>
                      <p className="text-gray-800">{formatDate(item.user_res_datetime_start)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">สิ้นสุด:</p>
                      <p className="text-gray-800">{formatDate(item.user_res_datetime_end)}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <button
                      className="flex-1 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-red-800 font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                      onClick={() => handleEdit(item)}
                    >
                      แก้ไข
                    </button>
                    <button
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                      onClick={() => deleteData(item.user_reserve_id)}
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl p-8 text-center shadow-lg">
              <div className="flex flex-col items-center space-y-4">
                <span className="text-6xl">📋</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">ไม่มีข้อมูลการจอง</h3>
                  <p className="text-gray-500 mt-1">เริ่มต้นสร้างการจองแรกของคุณ</p>
                </div>
                <button 
                  onClick={() => router.push('/calendar')}
                  className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-yellow-300 font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  สร้างการจอง
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredData.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
            <div className="text-sm text-gray-600">
              แสดง {startIndex + 1}-{Math.min(endIndex, filteredData.length)} จาก {filteredData.length} รายการ
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                ย้อนกลับ
              </button>

              <div className="flex space-x-1">
                {[...Array(totalPages)].slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2)).map((_, index) => {
                  const pageNum = Math.max(1, currentPage - 2) + index;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                        currentPage === pageNum
                          ? "bg-gradient-to-r from-red-600 to-red-800 text-yellow-300 shadow-md"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                ถัดไป
              </button>
            </div>
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
