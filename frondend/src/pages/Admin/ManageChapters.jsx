import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { FiTrash2, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ManageChapters = () => {
  const { storyId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [story, setStory] = useState(null);

  const fetch = () => axiosClient.get(`/chapters/story/${storyId}`).then(setChapters);

  useEffect(() => {
    axiosClient.get(`/stories/${storyId}`).then(setStory);
    fetch();
  }, [storyId]);

  const handleDelete = async (id) => {
    if(confirm('Xóa chương này?')) {
      try {
        await axiosClient.delete(`/chapters/${id}`);
        toast.success('Đã xóa');
        fetch();
      } catch (err) {
        toast.error('Lỗi khi xóa chương');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Quản lý Chương</h2>
          <p className="text-gray-500">Truyện: {story?.title}</p>
        </div>
        {/* ĐÃ SỬA DÒNG DƯỚI ĐÂY */}
        <Link 
          to={`/admin/stories/${storyId}/chapters/create`} 
          className="bg-primary text-white px-4 py-2 rounded-std font-bold flex items-center gap-2"
        >
          <FiPlus/> Thêm Chương
        </Link>
      </div>

      <div className="space-y-2">
        {chapters.map(c => (
           <div key={c.chapter_id} className="flex justify-between items-center p-4 bg-gray-50 rounded-std border border-gray-200">
              <span className="font-bold">Chương {c.chapter_number}: {c.title}</span>
              <button onClick={() => handleDelete(c.chapter_id)} className="text-red-500 hover:bg-red-100 p-2 rounded">
                <FiTrash2/>
              </button>
           </div>
        ))}
        {chapters.length === 0 && <p>Chưa có chương nào.</p>}
      </div>
    </div>
  );
};

export default ManageChapters;