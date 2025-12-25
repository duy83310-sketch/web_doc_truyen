import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import { FiArrowLeft, FiList, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Loading from '../../components/Loading';
import { toast } from 'react-toastify';

const ReadingPage = () => {
  const { storyId, chapterId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [chapter, setChapter] = useState(null);
  const [chaptersList, setChaptersList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Dùng để cuộn lên đầu trang khi chuyển chương
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Lấy nội dung chương hiện tại
        const chapData = await axiosClient.get(`/chapters/${chapterId}`);
        setChapter(chapData);

        // 2. Lấy danh sách chương để tính toán Next/Prev
        const listData = await axiosClient.get(`/chapters/story/${storyId}`);
        // Đảm bảo sort đúng thứ tự chương
        setChaptersList(listData.sort((a, b) => a.chapter_number - b.chapter_number));

        // 3. Lưu lịch sử đọc (nếu đã login)
        if (user) {
          // Không cần await để không chặn UI
          axiosClient.post('/history', {
            story_id: storyId,
            last_chapter_read_id: chapterId
          }).catch(console.error);
        }
      } catch (error) {
        toast.error('Lỗi tải nội dung chương');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [chapterId, storyId, user]);

  if (loading) return <Loading />;
  if (!chapter) return <div className="text-center mt-20">Không tìm thấy nội dung.</div>;

  // Logic tìm chương trước và sau
  const currentIndex = chaptersList.findIndex(c => c.chapter_id === parseInt(chapterId));
  const prevChap = currentIndex > 0 ? chaptersList[currentIndex - 1] : null;
  const nextChap = currentIndex < chaptersList.length - 1 ? chaptersList[currentIndex + 1] : null;

  return (
    <div className="bg-[#FAF9F2] min-h-screen"> 
      {/* --- Header cố định khi đọc --- */}
      <div className="fixed top-0 left-0 md:left-[120px] right-0 h-16 bg-white border-b border-gray-200 shadow-sm flex justify-between items-center px-4 md:px-8 z-40 transition-all">
        <div className="flex items-center gap-4">
          <Link to={`/story/${storyId}`} className="text-gray-600 hover:text-primary transition p-2">
            <FiArrowLeft size={24} />
          </Link>
          <div>
            <h2 className="text-sm text-gray-500 font-bold uppercase truncate max-w-[200px]">
              Truyện đang đọc
            </h2>
            <p className="text-dark font-bold truncate max-w-[300px]">
              Chương {chapter.chapter_number}: {chapter.title}
            </p>
          </div>
        </div>

        {/* Quick Nav Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <button 
            disabled={!prevChap}
            onClick={() => navigate(`/read/${storyId}/${prevChap.chapter_id}`)}
            className="p-2 border rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Chương trước"
          >
            <FiChevronLeft size={20}/>
          </button>
          
          <select 
            className="border rounded p-2 outline-none cursor-pointer max-w-[150px]"
            value={chapterId}
            onChange={(e) => navigate(`/read/${storyId}/${e.target.value}`)}
          >
            {chaptersList.map(c => (
              <option key={c.chapter_id} value={c.chapter_id}>
                Chương {c.chapter_number}
              </option>
            ))}
          </select>

          <button 
            disabled={!nextChap}
            onClick={() => navigate(`/read/${storyId}/${nextChap.chapter_id}`)}
            className="p-2 border rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Chương sau"
          >
            <FiChevronRight size={20}/>
          </button>
        </div>
      </div>

      {/* --- Nội dung chính --- */}
      <div className="max-w-4xl mx-auto pt-24 pb-20 px-6 md:px-12" ref={contentRef}>
        <div className="text-center mb-12">
          <span className="text-gray-400 font-bold tracking-widest uppercase text-sm">
            Chương {chapter.chapter_number}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-dark mt-2 font-serif">
            {chapter.title}
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Đăng ngày: {new Date(chapter.published_at).toLocaleDateString()}
          </p>
        </div>

        <div className="prose prose-lg md:prose-xl max-w-none text-gray-800 leading-loose font-serif whitespace-pre-wrap text-justify">
          {chapter.content}
        </div>
      </div>

      {/* --- Footer Nav --- */}
      <div className="max-w-4xl mx-auto px-6 pb-12 flex justify-between items-center border-t border-gray-300 pt-8">
        <button 
          disabled={!prevChap}
          onClick={() => navigate(`/read/${storyId}/${prevChap.chapter_id}`)}
          className={`flex items-center gap-2 px-6 py-3 rounded-std font-bold transition ${!prevChap ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border-2 border-dark text-dark hover:bg-gray-100'}`}
        >
          <FiArrowLeft /> Chương trước
        </button>

        <button 
          disabled={!nextChap}
          onClick={() => navigate(`/read/${storyId}/${nextChap.chapter_id}`)}
          className={`flex items-center gap-2 px-6 py-3 rounded-std font-bold transition ${!nextChap ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-primary text-white shadow-lg shadow-blue-200 hover:bg-blue-600'}`}
        >
          Chương sau <FiArrowLeft className="rotate-180" />
        </button>
      </div>
    </div>
  );
};

export default ReadingPage;