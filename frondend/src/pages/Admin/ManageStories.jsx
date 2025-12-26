import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiList,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";

const ManageStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Thêm state phân trang cho Admin
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchStories = async () => {
    setLoading(true);
    try {
      // Gọi API có phân trang
      const res = await axiosClient.get(`/stories?page=${page}&limit=10`);

      // LOGIC MỚI: Xử lý dữ liệu trả về kiểu { data, pagination }
      if (res.data) {
        setStories(res.data);
        setTotalPages(res.pagination.totalPages);
      } else {
        // Fallback cho trường hợp API cũ
        setStories(Array.isArray(res) ? res : []);
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách truyện");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [page]); // Chạy lại khi chuyển trang

  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc muốn xóa truyện này?")) {
      try {
        await axiosClient.delete(`/stories/${id}`);
        toast.success("Đã xóa");
        fetchStories();
      } catch {
        toast.error("Lỗi khi xóa");
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-dark">Quản lý Truyện</h2>
        <Link
          to="/admin/stories/create"
          className="bg-primary text-white px-4 py-2 rounded-std font-bold flex items-center gap-2 hover:bg-blue-600 shadow-md"
        >
          <FiPlus /> Thêm Truyện
        </Link>
      </div>

      <div className="bg-white rounded-std shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-dark border-b border-gray-200">
                <th className="p-4 w-16 text-center">ID</th>
                <th className="p-4 w-24">Ảnh</th>
                <th className="p-4">Tên truyện</th>
                <th className="p-4">Tác giả</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {stories.map((s) => (
                <tr
                  key={s.story_id}
                  className="border-b last:border-0 hover:bg-gray-50 transition"
                >
                  <td className="p-4 text-center font-bold text-gray-500">
                    #{s.story_id}
                  </td>
                  <td className="p-4">
                    <img
                      src={
                        s.cover_image_url ||
                        "https://placehold.co/100x150?text=No+Img"
                      }
                      className="w-10 h-14 object-cover rounded shadow-sm border border-gray-200"
                      alt="cover"
                    />
                  </td>
                  <td
                    className="p-4 font-bold text-dark max-w-[250px] truncate"
                    title={s.title}
                  >
                    {s.title}
                  </td>
                  <td className="p-4 text-gray-600">{s.author}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        s.status === "Hoàn thành"
                          ? "bg-green-100 text-green-700"
                          : s.status === "Tạm ngưng"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    <Link
                      to={`/admin/stories/${s.story_id}/chapters`}
                      className="p-2 bg-green-100 text-green-600 rounded-std hover:bg-green-600 hover:text-white transition"
                      title="Quản lý chương"
                    >
                      <FiList />
                    </Link>
                    <Link
                      to={`/admin/stories/edit/${s.story_id}`}
                      className="p-2 bg-yellow-100 text-yellow-600 rounded-std hover:bg-yellow-500 hover:text-white transition"
                      title="Sửa"
                    >
                      <FiEdit />
                    </Link>
                    <button
                      onClick={() => handleDelete(s.story_id)}
                      className="p-2 bg-red-100 text-red-600 rounded-std hover:bg-red-600 hover:text-white transition"
                      title="Xóa"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {stories.length === 0 && (
            <div className="p-8 text-center text-gray-400 italic">
              Chưa có truyện nào.
            </div>
          )}
        </div>
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            <FiChevronLeft />
          </button>
          <span className="px-4 py-2 font-bold text-gray-600">
            Trang {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            <FiChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageStories;
