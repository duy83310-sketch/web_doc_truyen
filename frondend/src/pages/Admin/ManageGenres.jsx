import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { FiTrash2, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ManageGenres = () => {
  const [genres, setGenres] = useState([]);
  const [newGenre, setNewGenre] = useState('');

  const fetch = () => axiosClient.get('/genres').then(setGenres);
  useEffect(() => { fetch(); }, []);

  const handleAdd = async () => {
    if(!newGenre) return;
    try { await axiosClient.post('/genres', { name: newGenre }); setNewGenre(''); fetch(); toast.success('Đã thêm'); } 
    catch { toast.error('Lỗi'); }
  };

  const handleDelete = async (id) => {
    if(confirm('Xóa thể loại này?')) {
       await axiosClient.delete(`/genres/${id}`); fetch(); toast.success('Đã xóa');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Quản lý Thể loại</h2>
      <div className="flex gap-4 mb-8">
        <input value={newGenre} onChange={e=>setNewGenre(e.target.value)} placeholder="Tên thể loại mới..." className="border-[3px] border-dark rounded-std px-4 py-2 w-[300px]" />
        <button onClick={handleAdd} className="bg-primary text-white px-6 rounded-std font-bold hover:bg-blue-600">Thêm</button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {genres.map(g => (
          <div key={g.genre_id} className="bg-gray-100 p-4 rounded-std flex justify-between items-center font-bold">
            {g.name}
            <button onClick={() => handleDelete(g.genre_id)} className="text-red-500"><FiTrash2/></button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ManageGenres;