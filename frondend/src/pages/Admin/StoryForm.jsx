import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";
import { FiUpload, FiX } from "react-icons/fi";

const StoryForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const { register, handleSubmit, setValue } = useForm();
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const [preview, setPreview] = useState(null); // URL ảnh để xem trước

  useEffect(() => {
    // Lấy danh sách thể loại
    axiosClient.get("/genres").then(setGenres);

    // Nếu là chế độ sửa, lấy thông tin truyện cũ
    if (isEdit) {
      axiosClient.get(`/stories/${id}`).then((data) => {
        setValue("title", data.title);
        setValue("author", data.author);
        setValue("summary", data.summary);
        setValue("status", data.status);
        setPreview(data.cover_image_url); // Hiển thị ảnh cũ
      });
    }
  }, [id, setValue]);

  // Xử lý khi người dùng chọn file ảnh
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Tạo URL tạm thời để hiển thị ngay lập tức
      setPreview(URL.createObjectURL(file));
      // Lưu file vào form (key là 'image')
      setValue("image", file);
    }
  };

  const onSubmit = async (data) => {
    try {
      // Dùng FormData để gửi file lên server
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("author", data.author);
      formData.append("summary", data.summary);
      formData.append("status", data.status);

      // Nếu có chọn ảnh mới thì gửi kèm
      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      // Gửi thể loại (nếu có chọn)
      if (data.genre_ids) {
        Array.from(data.genre_ids).forEach((id) =>
          formData.append("genre_ids", id)
        );
      }

      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (isEdit) {
        await axiosClient.put(`/stories/${id}`, formData, config);
        toast.success("Cập nhật truyện thành công!");
      } else {
        await axiosClient.post("/stories", formData, config);
        toast.success("Thêm truyện mới thành công!");
      }
      navigate("/admin/stories");
    } catch (e) {
      console.error(e);
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        {isEdit ? "Cập nhật Truyện" : "Thêm Truyện Mới"}
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 max-w-2xl bg-white p-6 rounded-std shadow-sm border border-gray-100"
      >
        {/* Tên truyện */}
        <div className="form-group">
          <label className="font-bold block mb-2">Tên truyện</label>
          <input
            {...register("title")}
            required
            className="w-full h-[50px] px-4 border-[2px] border-gray-300 rounded-std focus:border-primary outline-none transition"
          />
        </div>

        {/* Tác giả */}
        <div className="form-group">
          <label className="font-bold block mb-2">Tác giả</label>
          <input
            {...register("author")}
            required
            className="w-full h-[50px] px-4 border-[2px] border-gray-300 rounded-std focus:border-primary outline-none transition"
          />
        </div>

        {/* Upload Ảnh */}
        <div>
          <label className="font-bold block mb-2">Ảnh bìa</label>
          <div className="flex items-start gap-6">
            {/* Khung xem trước ảnh */}
            <div className="w-[120px] h-[160px] bg-gray-100 border-2 border-dashed border-gray-300 rounded flex items-center justify-center overflow-hidden relative group">
              {preview ? (
                <img
                  src={preview}
                  className="w-full h-full object-cover"
                  alt="Preview"
                />
              ) : (
                <span className="text-gray-400 text-xs text-center px-2">
                  Chưa có ảnh
                </span>
              )}
            </div>

            {/* Nút chọn ảnh */}
            <div>
              <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-dark px-4 py-2 rounded-std font-bold flex items-center gap-2 transition shadow-sm">
                <FiUpload /> Tải ảnh lên
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Định dạng: .jpg, .png, .jpeg (Max 5MB)
              </p>
            </div>
          </div>
        </div>

        {/* Trạng thái */}
        <div>
          <label className="font-bold block mb-2">Trạng thái</label>
          <select
            {...register("status")}
            className="w-full h-[50px] px-4 border-[2px] border-gray-300 rounded-std outline-none focus:border-primary bg-white"
          >
            <option value="Đang tiến hành">Đang tiến hành</option>
            <option value="Hoàn thành">Hoàn thành</option>
            <option value="Tạm ngưng">Tạm ngưng</option>
          </select>
        </div>

        {/* Tóm tắt */}
        <div>
          <label className="font-bold block mb-2">Tóm tắt nội dung</label>
          <textarea
            {...register("summary")}
            className="w-full p-4 border-[2px] border-gray-300 rounded-std h-32 focus:border-primary outline-none resize-none"
          ></textarea>
        </div>

        {/* Thể loại */}
        <div>
          <label className="font-bold block mb-2">
            Thể loại (Giữ Ctrl để chọn nhiều)
          </label>
          <select
            multiple
            {...register("genre_ids")}
            className="w-full border-[2px] border-gray-300 rounded-std p-2 h-40 focus:border-primary outline-none custom-scrollbar"
          >
            {genres.map((g) => (
              <option
                key={g.genre_id}
                value={g.genre_id}
                className="p-2 hover:bg-blue-50 cursor-pointer rounded"
              >
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {/* Nút Submit */}
        <button className="bg-primary text-white px-8 py-3 rounded-std font-bold hover:bg-blue-600 shadow-lg shadow-blue-200 w-full transition-all mt-4 text-lg">
          {isEdit ? "Lưu Thay Đổi" : "Tạo Truyện Mới"}
        </button>
      </form>
    </div>
  );
};

export default StoryForm;
