import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import { FiHeart, FiPlay, FiList } from 'react-icons/fi';
import { toast } from 'react-toastify';

const StoryDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    axiosClient.get(`/stories/${id}`).then(setStory);
    axiosClient.get(`/chapters/story/${id}`).then(setChapters);
  }, [id]);

  const addFav = async () => {
    if(!user) return toast.warning('Cần đăng nhập!');
    try { await axiosClient.post('/favorites', { story_id: id }); toast.success('Đã thêm vào tủ!'); } 
    catch { toast.info('Truyện đã có trong tủ.'); }
  };

  if(!story) return <div>Loading...</div>;

  return (
    <div className="flex gap-10 p-8 max-w-6xl mx-auto">
      <div className="w-[300px] shrink-0">
        <img src={story.cover_image_url} className="w-full rounded-std shadow-lg mb-4" />
        <Link to={chapters.length?`/read/${id}/${chapters[0].chapter_id}`:'#'} className="w-full bg-primary text-white py-3 rounded-std font-bold flex justify-center items-center gap-2 mb-3 hover:bg-blue-600"><FiPlay/> Đọc Ngay</Link>
        <button onClick={addFav} className="w-full border-[3px] border-dark py-3 rounded-std font-bold flex justify-center items-center gap-2 hover:bg-gray-100"><FiHeart/> Yêu Thích</button>
      </div>
      <div className="flex-1">
        <h1 className="text-4xl font-bold mb-4 text-dark">{story.title}</h1>
        <div className="flex gap-4 text-gray-500 font-bold mb-6">
          <span>{story.author}</span> • <span>{story.status}</span> • <span>{story.view_count} views</span>
        </div>
        <div className="bg-gray-50 p-6 rounded-std mb-8 text-gray-700 leading-relaxed text-justify">{story.summary}</div>
        <h3 className="font-bold text-xl mb-4 flex items-center gap-2"><FiList/> Danh sách chương</h3>
        <div className="grid grid-cols-1 gap-2 max-h-[500px] overflow-y-auto">
          {chapters.map(c => (
            <Link key={c.chapter_id} to={`/read/${id}/${c.chapter_id}`} className="p-4 bg-white border border-gray-200 rounded-std hover:bg-blue-50 hover:border-blue-200 font-semibold text-gray-700 transition">
              Chương {c.chapter_number}: {c.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
export default StoryDetail;