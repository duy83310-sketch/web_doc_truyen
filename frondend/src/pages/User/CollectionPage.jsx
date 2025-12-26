import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { FiClock, FiHeart, FiTrash2, FiBookOpen } from "react-icons/fi";
import Loading from "../../components/Loading";
import { toast } from "react-toastify";

const CollectionPage = ({ type = "favorites" }) => {
  const isHistory = type === "history"; // Kiểm tra xem đang ở trang Lịch sử hay Yêu thích
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [type]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Gọi API tương ứng: /history/me hoặc /favorites/me
      const endpoint = isHistory ? "/history/me" : "/favorites/me";
      const res = await axiosClient.get(endpoint);
      setData(res);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (e, id) => {
    e.preventDefault(); // Chặn click vào thẻ Link
    if (!confirm("Bạn muốn xóa truyện này khỏi danh sách?")) return;

    try {
      const endpoint = isHistory ? `/history/${id}` : "/favorites";
      // Với favorites dùng method DELETE body, với history dùng DELETE param (tùy backend của bạn)
      if (isHistory) {
        await axiosClient.delete(endpoint);
      } else {
        // Favorites controller dùng body { story_id }
        await axiosClient.delete("/favorites", { data: { story_id: id } });
      }

      toast.success("Đã xóa thành công");
      fetchData(); // Load lại danh sách
    } catch (err) {
      toast.error("Lỗi khi xóa");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-2 py-4">
      {/* Header Trang */}
      <div className="flex items-center gap-3 mb-6 px-2 border-b border-gray-200 pb-4">
        <div
          className={`p-3 rounded-full text-white shadow-md ${
            isHistory ? "bg-orange-500" : "bg-red-500"
          }`}
        >
          {isHistory ? <FiClock size={24} /> : <FiHeart size={24} />}
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
            {isHistory ? "Lịch Sử Đọc Truyện" : "Tủ Truyện Yêu Thích"}
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            {data.length} truyện {isHistory ? "đã đọc gần đây" : "đã lưu"}
          </p>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <>
          {/* Grid Layout tương tự Home Page */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-2">
            {data.map((item) => {
              // Dữ liệu trả về thường là { story_id, Story: {...} } do dùng include
              const story = item.Story;
              if (!story) return null; // Bỏ qua nếu dữ liệu lỗi

              return (
                <Link
                  to={`/story/${story.story_id}`}
                  key={item.id || item.story_id} // History có id riêng, Favorites dùng story_id
                  className="group flex flex-col relative bg-white rounded shadow-sm border border-gray-200 overflow-hidden hover:border-primary transition-colors"
                >
                  {/* ẢNH BÌA */}
                  <div className="w-full aspect-[2/3] overflow-hidden relative bg-gray-200">
                    <img
                      src={
                        story.cover_image_url ||
                        "https://placehold.co/300x450?text=No+Cover"
                      }
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Badge Rating */}
                    <div className="absolute top-0 right-0 bg-black/60 backdrop-blur-[1px] px-1.5 py-0.5 text-[10px] font-bold text-white">
                      ⭐ {story.rating_average || 0}
                    </div>

                    {/* Nút Xóa Nhanh (Góc trái trên) */}
                    <button
                      onClick={(e) => handleRemove(e, story.story_id)}
                      className="absolute top-0 left-0 bg-red-600 text-white p-1.5 rounded-br hover:bg-red-700 transition z-10"
                      title="Xóa khỏi danh sách"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>

                  {/* INFO */}
                  <div className="p-2">
                    <h3
                      className="font-bold text-[13px] text-gray-800 leading-4 line-clamp-2 h-[32px] group-hover:text-primary transition-colors"
                      title={story.title}
                    >
                      {story.title}
                    </h3>

                    <div className="mt-2 pt-2 border-t border-gray-100 flex flex-col gap-1">
                      {isHistory ? (
                        <span className="text-[10px] text-orange-600 font-bold flex items-center gap-1">
                          <FiBookOpen /> Đọc đến chương{" "}
                          {item.Chapter?.chapter_number || "?"}
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400">
                          Đã thêm:{" "}
                          {new Date(item.added_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {data.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded border border-dashed border-gray-300">
              <div className="text-6xl mb-4 opacity-20">📭</div>
              <p className="font-bold text-gray-500">Danh sách trống.</p>
              <Link
                to="/"
                className="mt-4 px-6 py-2 bg-primary text-white rounded font-bold hover:bg-blue-600 transition"
              >
                Khám phá truyện ngay
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CollectionPage;
