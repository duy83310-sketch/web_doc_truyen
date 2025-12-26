import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../context/AuthContext";
import {
  FiHeart,
  FiPlay,
  FiList,
  FiStar,
  FiUser,
  FiClock,
  FiCalendar,
  FiEye,
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa"; // Dùng icon FaHeart cho trái tim đặc (filled)
import { toast } from "react-toastify";
import Loading from "../../components/Loading";

const StoryDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();

  // Data State
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [avgScore, setAvgScore] = useState(0);

  // Interaction State
  const [isFavorited, setIsFavorited] = useState(false); // Trạng thái đã thích hay chưa
  const [userRating, setUserRating] = useState({ score: 5, comment: "" });
  const [hoverStar, setHoverStar] = useState(0); // State cho hiệu ứng hover sao
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
    if (user) checkFavoriteStatus();
  }, [id, user]);

  const fetchData = async () => {
    try {
      const [sRes, cRes, rRes] = await Promise.all([
        axiosClient.get(`/stories/${id}`),
        axiosClient.get(`/chapters/story/${id}`),
        axiosClient.get(`/ratings/story/${id}`),
      ]);

      setStory(sRes);
      setChapters(cRes.sort((a, b) => a.chapter_number - b.chapter_number));
      setRatings(rRes);

      // Tính điểm trung bình Real-time
      if (rRes.length > 0) {
        const total = rRes.reduce((sum, r) => sum + r.score, 0);
        setAvgScore((total / rRes.length).toFixed(1));
      } else {
        setAvgScore(sRes.rating_average || 0);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Kiểm tra xem user đã thích truyện này chưa để "Focus" nút tim
  const checkFavoriteStatus = async () => {
    try {
      const res = await axiosClient.get("/favorites/me");
      // Giả sử API trả về mảng favorites, ta kiểm tra story_id
      const found = res.find(
        (f) => f.story_id === parseInt(id) || f.Story?.story_id === parseInt(id)
      );
      setIsFavorited(!!found);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleFav = async () => {
    if (!user) return toast.warning("Bạn cần đăng nhập để lưu truyện!");

    // Optimistic Update (Cập nhật giao diện ngay lập tức cho mượt)
    const previousState = isFavorited;
    setIsFavorited(!previousState);

    try {
      if (!previousState) {
        await axiosClient.post("/favorites", { story_id: id });
        toast.success("Đã thêm vào tủ truyện ❤️");
      } else {
        await axiosClient.delete("/favorites", { data: { story_id: id } });
        toast.info("Đã xóa khỏi tủ truyện 💔");
      }
    } catch {
      // Nếu lỗi thì hoàn tác lại trạng thái
      setIsFavorited(previousState);
      toast.error("Lỗi kết nối!");
    }
  };

  const submitRating = async (e) => {
    e.preventDefault();
    if (!user) return toast.warning("Vui lòng đăng nhập để đánh giá");
    if (!userRating.comment.trim())
      return toast.warning("Hãy nhập nội dung bình luận");

    setIsSubmitting(true);
    try {
      await axiosClient.post("/ratings", {
        story_id: id,
        score: parseInt(userRating.score),
        comment: userRating.comment,
      });
      toast.success("Gửi đánh giá thành công!");
      setUserRating({ score: 5, comment: "" });
      fetchData(); // Load lại comment
    } catch (err) {
      toast.error("Có lỗi xảy ra khi gửi đánh giá");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!story) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      {/* --- PHẦN 1: HEADER INFO --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Cột Trái: Ảnh & Actions */}
          <div className="w-full md:w-[260px] shrink-0 flex flex-col gap-4">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-md border border-gray-100 group">
              <img
                src={
                  story.cover_image_url ||
                  "https://placehold.co/300x450?text=No+Image"
                }
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt={story.title}
              />
              {story.status === "Hoàn thành" && (
                <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow uppercase tracking-wide">
                  FULL
                </span>
              )}
            </div>

            <Link
              to={
                chapters.length ? `/read/${id}/${chapters[0].chapter_id}` : "#"
              }
              className={`w-full py-3 rounded-lg font-bold flex justify-center items-center gap-2 transition shadow-lg shadow-blue-100 ${
                chapters.length
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:to-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <FiPlay size={20} fill="currentColor" />{" "}
              {chapters.length ? "ĐỌC NGAY" : "CHƯA CÓ CHƯƠNG"}
            </Link>

            {/* Nút Yêu Thích với hiệu ứng Focus */}
            <button
              onClick={toggleFav}
              className={`w-full border-2 py-3 rounded-lg font-bold flex justify-center items-center gap-2 transition-all duration-300 ${
                isFavorited
                  ? "bg-red-50 border-red-500 text-red-500"
                  : "bg-white border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-400"
              }`}
            >
              {isFavorited ? (
                <FaHeart size={20} className="animate-pulse" />
              ) : (
                <FiHeart size={20} />
              )}
              {isFavorited ? "ĐÃ YÊU THÍCH" : "YÊU THÍCH"}
            </button>
          </div>

          {/* Cột Phải: Thông tin chi tiết */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-3 leading-tight tracking-tight">
              {story.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500 mb-6">
              <span className="flex items-center gap-1.5">
                <FiUser className="text-primary" />{" "}
                {story.author || "Đang cập nhật"}
              </span>
              <span className="h-1 w-1 rounded-full bg-gray-300"></span>
              <span
                className={`px-2.5 py-0.5 rounded text-xs uppercase font-bold tracking-wide ${
                  story.status === "Hoàn thành"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {story.status}
              </span>
              <span className="h-1 w-1 rounded-full bg-gray-300"></span>
              <span className="flex items-center gap-1.5">
                <FiEye /> {story.view_count || 0} lượt xem
              </span>
            </div>

            {/* Rating Info Box */}
            <div className="flex items-center gap-4 mb-8 bg-yellow-50/50 p-4 rounded-xl border border-yellow-100 w-fit">
              <div className="flex items-center gap-2">
                <span className="text-4xl font-black text-yellow-500">
                  {avgScore}
                </span>
                <div className="flex flex-col">
                  <div className="flex text-yellow-400 text-sm">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        fill={
                          i < Math.round(avgScore) ? "currentColor" : "none"
                        }
                        className={
                          i < Math.round(avgScore) ? "" : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-xs text-yellow-700 font-bold mt-0.5">
                    {ratings.length} đánh giá
                  </span>
                </div>
              </div>
            </div>

            {/* Genres */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {story.genres && story.genres.length > 0 ? (
                  story.genres.map((g) => (
                    <span
                      key={g.genre_id}
                      className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold uppercase rounded hover:bg-primary hover:text-white cursor-pointer transition"
                    >
                      {g.name}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 italic text-sm">
                    Chưa phân loại
                  </span>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="mb-2">
              <h3 className="text-sm font-bold text-gray-900 uppercase mb-3 flex items-center gap-2 border-l-4 border-primary pl-3">
                Nội dung chính
              </h3>
              <div className="text-gray-700 leading-relaxed text-justify text-[15px]">
                {story.summary || "Đang cập nhật..."}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- PHẦN 2: LIST CHƯƠNG --- */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[500px]">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
              <FiList className="text-primary" /> DANH SÁCH CHƯƠNG
            </h3>

            {chapters.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {chapters.map((c) => (
                  <Link
                    key={c.chapter_id}
                    to={`/read/${id}/${c.chapter_id}`}
                    className="flex justify-between items-center px-4 py-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:border-primary hover:bg-blue-50 transition group"
                  >
                    <span className="font-bold text-sm text-gray-700 group-hover:text-primary truncate mr-2">
                      Chương {c.chapter_number}: {c.title}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium shrink-0">
                      {new Date(
                        c.published_at || Date.now()
                      ).toLocaleDateString("vi-VN")}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-60 text-gray-300">
                <FiList size={40} className="mb-2 opacity-50" />
                <p className="italic">Chưa có chương nào.</p>
              </div>
            )}
          </div>
        </div>

        {/* --- PHẦN 3: BÌNH LUẬN & ĐÁNH GIÁ --- */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-20">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
              <FiStar className="text-yellow-500 fill-yellow-500" /> ĐÁNH GIÁ
            </h3>

            {/* Form Rating */}
            <div className="mb-8">
              {user ? (
                <form
                  onSubmit={submitRating}
                  className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                >
                  {/* Star Selector */}
                  <div className="flex justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverStar(star)}
                        onMouseLeave={() => setHoverStar(0)}
                        onClick={() =>
                          setUserRating({ ...userRating, score: star })
                        }
                        className="p-1 transition-transform hover:scale-110 focus:outline-none"
                      >
                        <FiStar
                          size={28}
                          className={`${
                            (hoverStar || userRating.score) >= star
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          } transition-colors duration-200`}
                        />
                      </button>
                    ))}
                  </div>

                  <textarea
                    className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none min-h-[100px] bg-white text-gray-800 placeholder-gray-400 resize-none"
                    placeholder="Bạn nghĩ gì về truyện này?"
                    value={userRating.comment}
                    onChange={(e) =>
                      setUserRating({ ...userRating, comment: e.target.value })
                    }
                    required
                  ></textarea>
                  <button
                    disabled={isSubmitting}
                    className="w-full mt-3 bg-dark text-white py-2.5 rounded-lg font-bold text-sm hover:bg-black transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Đang gửi..." : "Gửi Đánh Giá"}
                  </button>
                </form>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <p className="text-sm text-gray-500 mb-3">
                    Đăng nhập để bình luận
                  </p>
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-white border border-gray-300 rounded font-bold text-sm hover:border-primary hover:text-primary transition"
                  >
                    Đăng nhập ngay
                  </Link>
                </div>
              )}
            </div>

            {/* List Comments */}
            <div className="space-y-5 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
              {ratings.map((r) => (
                <div key={r.rating_id} className="flex gap-3 group">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0 overflow-hidden border border-gray-200">
                    {r.User?.avatar_url ? (
                      <img
                        src={r.User.avatar_url}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-gray-500 text-xs">
                        {(r.User?.username || "U").charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900">
                        {r.User?.username || `User #${r.user_id}`}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(r.rated_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex text-yellow-400 text-[10px] mb-1">
                      {[...Array(r.score)].map((_, i) => (
                        <FiStar key={i} fill="currentColor" />
                      ))}
                    </div>
                    {/* Comment Bubble */}
                    <div className="bg-gray-100 p-3 rounded-r-xl rounded-bl-xl text-sm text-gray-800 leading-relaxed font-medium relative group-hover:bg-blue-50 transition-colors">
                      {r.comment}
                    </div>
                  </div>
                </div>
              ))}

              {ratings.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2 opacity-20">💬</div>
                  <p className="text-xs text-gray-400">
                    Chưa có bình luận nào.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryDetail;
