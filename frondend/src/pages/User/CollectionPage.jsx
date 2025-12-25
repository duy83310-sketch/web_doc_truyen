import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { FiClock, FiHeart, FiBookOpen } from 'react-icons/fi';
import Loading from '../../components/Loading';

const CollectionPage = ({ type = 'favorites' }) => {
  const isHistory = type === 'history';
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Gọi API tương ứng
        const endpoint = isHistory ? '/history/me' : '/favorites/me';
        const res = await axiosClient.get(endpoint);
        setData(res);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type]); // Chạy lại khi prop 'type' thay đổi

  if (loading) return <Loading />;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8 pb-4 border-b border-gray-200">
        <div className={`p-3 rounded-full text-white ${isHistory ? 'bg-orange-500' : 'bg-red-500'}`}>
          {isHistory ? <FiClock size={32} /> : <FiHeart size={32} />}
        </div>
        <h1 className="text-3xl font-bold text-dark uppercase">
          {isHistory ? 'Lịch sử đọc truyện' : 'Tủ truyện yêu thích'}
        </h1>
      </div>

      <div className="flex flex-col gap-4">
        {data.length === 0 ? (
          <p className="text-gray-500 italic text-center py-10">Danh sách trống.</p>
        ) : (
          data.map((item) => {
            // Chuẩn hóa dữ liệu vì Backend trả về cấu trúc khác nhau
            // History: item.Story, item.last_chapter_read_id
            // Favorites: item.Story
            const story = item.Story || item.story;
            if (!story) return null;

            // Link logic: History -> đọc tiếp chương cũ. Fav -> xem chi tiết.
            const linkTo = isHistory && item.last_chapter_read_id 
              ? `/read/${story.story_id}/${item.last_chapter_read_id}`
              : `/story/${story.story_id}`;

            return (
              <div key={item.id || item.history_id || item.favorite_id} className="flex bg-white border border-gray-200 rounded-std p-4 hover:shadow-md transition gap-6 group">
                {/* Ảnh bìa */}
                <Link to={`/story/${story.story_id}`} className="shrink-0 w-[100px] h-[140px] overflow-hidden rounded-md bg-gray-200">
                  <img 
                    src={story.cover_image_url || 'https://via.placeholder.com/150'} 
                    alt={story.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </Link>

                {/* Thông tin */}
                <div className="flex-1 flex flex-col justify-center">
                  <Link to={`/story/${story.story_id}`}>
                    <h3 className="text-xl font-bold text-dark mb-1 group-hover:text-primary transition">{story.title}</h3>
                  </Link>
                  <p className="text-sm text-gray-500 font-semibold mb-3">Tác giả: {story.author}</p>
                  
                  {isHistory ? (
                    <div className="text-sm text-gray-600 flex flex-col gap-1">
                      <span className="flex items-center gap-2">
                        <FiBookOpen className="text-primary"/> 
                        Đọc đến: <b>Chương {item.Chapter?.chapter_number || '?'}</b>
                      </span>
                      <span className="text-xs text-gray-400">
                        Cập nhật: {new Date(item.last_read_at).toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">
                      Đã thêm: {new Date(item.added_at).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Nút hành động */}
                <div className="flex items-center">
                  <Link 
                    to={linkTo}
                    className="bg-sidebar text-dark font-bold px-6 py-3 rounded-std hover:bg-primary hover:text-white transition whitespace-nowrap"
                  >
                    {isHistory ? 'Đọc tiếp' : 'Xem chi tiết'}
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CollectionPage;