import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';

const ChapterForm = () => {
  const { storyId } = useParams();
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await axiosClient.post('/chapters', { ...data, story_id: storyId });
      toast.success('Thêm chương thành công');
      navigate(`/admin/stories/${storyId}/chapters`);
    } catch { toast.error('Lỗi khi thêm chương'); }
  };

  return (
    <div>
       <h2 className="text-2xl font-bold mb-6">Thêm Chương Mới</h2>
       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Số chương (Ví dụ: 1)" name="chapter_number" type="number" reg={register} />
          <Input label="Tiêu đề chương" name="title" reg={register} />
          <div>
            <label className="font-bold block mb-2">Nội dung</label>
            <textarea {...register('content')} className="w-full p-4 border-[3px] border-dark rounded-std h-[400px] focus:border-primary outline-none font-medium"></textarea>
          </div>
          <button className="bg-primary text-white px-8 py-3 rounded-std font-bold shadow-lg">Lưu Chương</button>
       </form>
    </div>
  );
};
const Input = ({ label, name, type='text', reg }) => (
  <div>
    <label className="font-bold block mb-2">{label}</label>
    <input {...reg(name)} type={type} className="w-full h-[50px] px-4 border-[3px] border-dark rounded-std focus:border-primary outline-none" />
  </div>
);
export default ChapterForm;