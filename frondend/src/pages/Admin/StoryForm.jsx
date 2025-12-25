import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';

const StoryForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const { register, handleSubmit, setValue } = useForm();
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    axiosClient.get('/genres').then(setGenres);
    if (isEdit) {
      axiosClient.get(`/stories/${id}`).then(data => {
        setValue('title', data.title);
        setValue('author', data.author);
        setValue('summary', data.summary);
        setValue('cover_image_url', data.cover_image_url);
        setValue('status', data.status);
        // Note: Xử lý genres checkbox cần phức tạp hơn, ở đây làm simple
      });
    }
  }, [id]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await axiosClient.put(`/stories/${id}`, data);
        toast.success('Cập nhật thành công');
      } else {
        await axiosClient.post('/stories', data);
        toast.success('Thêm mới thành công');
      }
      navigate('/admin/stories');
    } catch (e) { toast.error('Có lỗi xảy ra'); }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{isEdit ? 'Cập nhật Truyện' : 'Thêm Truyện Mới'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
        <Input label="Tên truyện" name="title" reg={register} />
        <Input label="Tác giả" name="author" reg={register} />
        <Input label="Ảnh bìa (URL)" name="cover_image_url" reg={register} />
        <div>
          <label className="font-bold block mb-2">Trạng thái</label>
          <select {...register('status')} className="w-full h-[50px] px-4 border-[3px] border-dark rounded-std">
            <option value="Đang tiến hành">Đang tiến hành</option>
            <option value="Hoàn thành">Hoàn thành</option>
            <option value="Tạm ngưng">Tạm ngưng</option>
          </select>
        </div>
        <div>
           <label className="font-bold block mb-2">Tóm tắt</label>
           <textarea {...register('summary')} className="w-full p-4 border-[3px] border-dark rounded-std h-32 focus:border-primary outline-none"></textarea>
        </div>
        
        {/* Genre Select Simple */}
        <div>
           <label className="font-bold block mb-2">Thể loại (Giữ Ctrl để chọn nhiều)</label>
           <select multiple {...register('genre_ids')} className="w-full border-[3px] border-dark rounded-std p-2 h-32">
              {genres.map(g => <option key={g.genre_id} value={g.genre_id}>{g.name}</option>)}
           </select>
        </div>

        <button className="bg-primary text-white px-8 py-3 rounded-std font-bold hover:bg-blue-600 shadow-lg mt-4">Lưu Dữ Liệu</button>
      </form>
    </div>
  );
};

const Input = ({ label, name, reg }) => (
  <div>
    <label className="font-bold block mb-2">{label}</label>
    <input {...reg(name)} className="w-full h-[50px] px-4 border-[3px] border-dark rounded-std focus:border-primary outline-none" />
  </div>
);

export default StoryForm;