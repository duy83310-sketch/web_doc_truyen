import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { FiEdit, FiTrash2, FiPlus, FiList } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ManageStories = () => {
  const [stories, setStories] = useState([]);

  const fetch = () => axiosClient.get('/stories').then(setStories);
  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id) => {
    if (confirm('Bạn có chắc muốn xóa truyện này?')) {
      try { await axiosClient.delete(`/stories/${id}`); toast.success('Đã xóa'); fetch(); } 
      catch { toast.error('Lỗi khi xóa'); }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản lý Truyện</h2>
        <Link to="/admin/stories/create" className="bg-primary text-white px-4 py-2 rounded-std font-bold flex items-center gap-2 hover:bg-blue-600"><FiPlus/> Thêm Truyện</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-dark">
              <th className="p-4 rounded-tl-std">ID</th>
              <th className="p-4">Ảnh</th>
              <th className="p-4">Tên truyện</th>
              <th className="p-4">Tác giả</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4 rounded-tr-std">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {stories.map(s => (
              <tr key={s.story_id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-bold">#{s.story_id}</td>
                <td className="p-4"><img src={s.cover_image_url} className="w-10 h-14 object-cover rounded" /></td>
                <td className="p-4 font-semibold text-dark max-w-[200px] truncate">{s.title}</td>
                <td className="p-4 text-gray-600">{s.author}</td>
                <td className="p-4"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">{s.status}</span></td>
                <td className="p-4 flex gap-2">
                   <Link to={`/admin/stories/${s.story_id}/chapters`} className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200" title="Quản lý chương"><FiList/></Link>
                   <Link to={`/admin/stories/edit/${s.story_id}`} className="p-2 bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200"><FiEdit/></Link>
                   <button onClick={() => handleDelete(s.story_id)} className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"><FiTrash2/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ManageStories;