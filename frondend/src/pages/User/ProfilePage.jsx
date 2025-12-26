import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { FiCamera, FiEdit2, FiLock, FiSave, FiX } from "react-icons/fi";
import Loading from "../../components/Loading";

const ProfilePage = () => {
  // Lấy hàm refreshProfile từ context để cập nhật Header sau khi đổi ảnh
  const { user: authUser, refreshProfile } = useAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState(null);

  // Form Profile
  const { register, handleSubmit, setValue } = useForm();

  // Form Password
  const [showPassForm, setShowPassForm] = useState(false);
  const {
    register: registerPass,
    handleSubmit: handleSubmitPass,
    reset: resetPass,
  } = useForm();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axiosClient.get("/auth/me");
      setUser(res);
      // Fill dữ liệu vào form
      setValue("full_name", res.full_name);
      setValue("username", res.username);
      setValue("email", res.email);
      setValue("phone_number", res.phone_number);
      setPreview(res.avatar_url);
    } catch (err) {
      toast.error("Lỗi tải thông tin");
    } finally {
      setLoading(false);
    }
  };

  const onUpdateProfile = async (data) => {
    try {
      const formData = new FormData();
      formData.append("full_name", data.full_name);
      formData.append("username", data.username); // Cho phép gửi username mới
      formData.append("phone_number", data.phone_number);
      formData.append("email", data.email);

      if (data.avatar && data.avatar[0]) {
        formData.append("avatar", data.avatar[0]);
      }

      const res = await axiosClient.put("/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Cập nhật hồ sơ thành công!");
      setIsEditing(false);

      // --- LOGIC QUAN TRỌNG ĐỂ KHÔNG MẤT QUYỀN ADMIN ---
      // 1. Cập nhật state cục bộ: Merge data mới (res) nhưng giữ lại is_admin cũ
      //    để phòng trường hợp server trả thiếu hoặc delay.
      setUser((prev) => ({
        ...prev,
        ...res,
        is_admin: prev.is_admin, // Giữ nguyên quyền Admin hiện tại
      }));

      // 2. Cập nhật Global State (Header)
      await refreshProfile();
    } catch (err) {
      // Hiển thị lỗi từ backend (ví dụ: Username trùng)
      toast.error(err.response?.data?.error || "Cập nhật thất bại");
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const onChangePassword = async (data) => {
    if (data.new_password !== data.confirm_password) {
      return toast.warning("Mật khẩu xác nhận không khớp");
    }
    try {
      await axiosClient.put("/users/change-password", {
        current_password: data.current_password,
        new_password: data.new_password,
      });
      toast.success("Đổi mật khẩu thành công!");
      setShowPassForm(false);
      resetPass();
    } catch (err) {
      toast.error(err.response?.data?.error || "Đổi mật khẩu thất bại");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-dark">Hồ sơ cá nhân</h1>

      {/* --- INFO CARD --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-dark">Thông tin tài khoản</h2>
            <p className="text-gray-500 text-sm">
              Cập nhật ảnh đại diện và thông tin cá nhân
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-dark text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-800 transition shadow-md"
            >
              <FiEdit2 /> Chỉnh sửa
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit(onUpdateProfile)}>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden group bg-gray-100">
                <img
                  src={preview || "https://placehold.co/150"}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
                {isEditing && (
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    <FiCamera className="text-white text-3xl" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      {...register("avatar")}
                      onChange={handleAvatarChange}
                    />
                  </label>
                )}
              </div>
              {isEditing && (
                <span className="text-xs text-primary font-bold">
                  Chạm để đổi ảnh
                </span>
              )}
            </div>

            {/* Inputs Section */}
            <div className="flex-1 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Họ và tên
                  </label>
                  <input
                    {...register("full_name")}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20 ${
                      isEditing
                        ? "border-primary bg-white"
                        : "border-gray-200 bg-gray-50 text-gray-500"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Username (Định danh)
                  </label>
                  {/* Đã mở khóa input này để sửa username */}
                  <input
                    {...register("username")}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20 ${
                      isEditing
                        ? "border-primary bg-white"
                        : "border-gray-200 bg-gray-50 text-gray-500"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20 ${
                      isEditing
                        ? "border-primary bg-white"
                        : "border-gray-200 bg-gray-50 text-gray-500"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    {...register("phone_number")}
                    disabled={!isEditing}
                    placeholder={!user.phone_number ? "Chưa cập nhật" : ""}
                    className={`w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20 ${
                      isEditing
                        ? "border-primary bg-white"
                        : "border-gray-200 bg-gray-50 text-gray-500"
                    }`}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                  <button className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-600 flex items-center gap-2 shadow-lg shadow-blue-200 transition">
                    <FiSave /> Lưu Thay Đổi
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      fetchProfile();
                    }}
                    className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-200 flex items-center gap-2 transition"
                  >
                    <FiX /> Hủy bỏ
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* --- PASSWORD CARD --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex flex-col mb-6">
          <h2 className="text-xl font-bold text-dark">Bảo mật</h2>
          <p className="text-gray-500 text-sm">Đổi mật khẩu đăng nhập</p>
        </div>

        {!showPassForm ? (
          <button
            onClick={() => setShowPassForm(true)}
            className="border border-gray-300 text-dark px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-50 hover:border-dark transition"
          >
            <FiLock /> Đổi mật khẩu
          </button>
        ) : (
          <form
            onSubmit={handleSubmitPass(onChangePassword)}
            className="max-w-md space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200"
          >
            <div>
              <label className="block text-sm font-bold mb-1 text-gray-700">
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                {...registerPass("current_password", { required: true })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 text-gray-700">
                Mật khẩu mới
              </label>
              <input
                type="password"
                {...registerPass("new_password", {
                  required: true,
                  minLength: 6,
                })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 text-gray-700">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                {...registerPass("confirm_password", { required: true })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button className="bg-dark text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-black transition shadow-lg">
                Xác nhận đổi
              </button>
              <button
                type="button"
                onClick={() => setShowPassForm(false)}
                className="text-gray-500 px-4 py-2 font-bold text-sm hover:underline"
              >
                Hủy
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
