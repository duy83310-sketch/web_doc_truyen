import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { FiEdit, FiTrash2, FiPlus, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";

const ManageGenres = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho Modal (Thêm/Sửa)
  const [showModal, setShowModal] = useState(false);
  const [editingGenre, setEditingGenre] = useState(null); // Nếu null -> Thêm mới, có object -> Sửa
  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const res = await axiosClient.get("/genres");
      setGenres(res);
    } catch (error) {
      toast.error("Lỗi tải danh sách thể loại");
    } finally {
      setLoading(false);
    }
  };

  // Mở modal thêm mới
  const handleAdd = () => {
    setEditingGenre(null);
    setFormData({ name: "", description: "" });
    setShowModal(true);
  };

  // Mở modal sửa
  const handleEdit = (g) => {
    setEditingGenre(g);
    setFormData({ name: g.name, description: g.description || "" });
    setShowModal(true);
  };

  // Xử lý Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGenre) {
        // Sửa
        await axiosClient.put(`/genres/${editingGenre.genre_id}`, formData);
        toast.success("Cập nhật thành công");
      } else {
        // Thêm
        await axiosClient.post("/genres", formData);
        toast.success("Thêm mới thành công");
      }
      setShowModal(false);
      fetchGenres(); // Load lại danh sách
    } catch (err) {
      toast.error(err.response?.data?.error || "Có lỗi xảy ra");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc muốn xóa thể loại này?")) {
      try {
        await axiosClient.delete(`/genres/${id}`);
        toast.success("Đã xóa");
        fetchGenres();
      } catch {
        toast.error(
          "Không thể xóa (có thể do đang có truyện thuộc thể loại này)"
        );
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-dark">Quản lý Thể loại</h2>
        <button
          onClick={handleAdd}
          className="bg-primary text-white px-4 py-2 rounded-std font-bold flex items-center gap-2 hover:bg-blue-600 shadow-md transition"
        >
          <FiPlus /> Thêm Thể Loại
        </button>
      </div>

      <div className="bg-white rounded-std shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-dark border-b border-gray-200">
              <th className="p-4 w-16 text-center">ID</th>
              <th className="p-4">Tên Thể Loại</th>
              <th className="p-4">Mô tả</th>
              <th className="p-4 text-center w-32">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {genres.map((g) => (
              <tr
                key={g.genre_id}
                className="border-b last:border-0 hover:bg-gray-50 transition"
              >
                <td className="p-4 text-center font-bold text-gray-500">
                  #{g.genre_id}
                </td>
                <td className="p-4 font-bold text-primary">{g.name}</td>
                <td className="p-4 text-gray-600 text-sm">{g.description}</td>
                <td className="p-4 flex justify-center gap-2">
                  <button
                    onClick={() => handleEdit(g)}
                    className="p-2 bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-500 hover:text-white transition"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(g.genre_id)}
                    className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-600 hover:text-white transition"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {genres.length === 0 && (
          <div className="p-8 text-center text-gray-400 italic">
            Chưa có thể loại nào.
          </div>
        )}
      </div>

      {/* --- MODAL POPUP --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="bg-gray-100 px-6 py-4 flex justify-between items-center border-b border-gray-200">
              <h3 className="font-bold text-lg">
                {editingGenre ? "Sửa Thể Loại" : "Thêm Thể Loại Mới"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-red-500"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Tên thể loại <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded border border-gray-300 focus:border-primary outline-none"
                  placeholder="VD: Tiên Hiệp, Ngôn Tình..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded border border-gray-300 focus:border-primary outline-none h-24 resize-none"
                  placeholder="Mô tả ngắn về thể loại này..."
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded font-bold hover:bg-gray-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded font-bold hover:bg-blue-600 shadow-lg"
                >
                  Lưu lại
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageGenres;
