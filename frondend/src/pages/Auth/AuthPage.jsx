// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { Link, useNavigate } from 'react-router-dom';
// import axiosClient from '../../api/axiosClient';
// import { useAuth } from '../../context/AuthContext';
// import { FiEye, FiEyeOff } from 'react-icons/fi';
// import { toast } from 'react-toastify';

// const AuthPage = ({ type = 'login' }) => {
//   const isLogin = type === 'login';
//   const { register, handleSubmit } = useForm();
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const [show, setShow] = useState(false);

//   const onSubmit = async (data) => {
//     if (isLogin) {
//       const success = await login(data.username, data.password);
//       const location = useLocation();
// const from = location.state?.from?.pathname || "/";
//     } else {
//       try {
//         await axiosClient.post('/auth/register', data);
//         toast.success('Đăng ký thành công!');
//         navigate('/login');
//       } catch (e) { toast.error(e.response?.data?.error); }
//     }
//   };

//   return (
//     <div className="flex min-h-screen">
//       <div className="hidden lg:flex w-1/2 bg-[#AAB5C3] items-center justify-center">
//         <h1 className="text-5xl font-bold text-white drop-shadow-md">WebTruyen App</h1>
//       </div>
//       <div className="w-full lg:w-1/2 flex items-center justify-center bg-white">
//         <div className="w-[400px]">
//           <h2 className="text-3xl font-bold text-dark mb-8 text-center">{isLogin ? 'Đăng Nhập' : 'Đăng Ký'}</h2>
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             {!isLogin && (
//               <>
//                 <Input label="Họ tên" name="full_name" reg={register} />
//                 <Input label="Email" name="email" type="email" reg={register} />
//               </>
//             )}
//             <Input label="Username" name="username" reg={register} />
//             <div className="relative">
//               <Input label="Mật khẩu" name="password" type={show ? 'text' : 'password'} reg={register} />
//               <button type="button" onClick={()=>setShow(!show)} className="absolute right-4 top-[38px] text-gray-500"><FiEye size={20}/></button>
//             </div>
//             <button className="w-full h-[50px] bg-primary text-white font-bold rounded-std hover:bg-blue-600 transition shadow-lg shadow-blue-200 mt-4">
//               {isLogin ? 'Vào đọc truyện' : 'Tạo tài khoản'}
//             </button>
//           </form>
//           <div className="text-center mt-6">
//             <Link to={isLogin ? '/register' : '/login'} className="font-bold text-primary hover:underline">
//               {isLogin ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// const Input = ({ label, name, type='text', reg }) => (
//   <div>
//     <label className="font-bold text-dark block mb-2">{label}</label>
//     <input {...reg(name)} type={type} className="w-full h-[50px] px-4 border-[3px] border-dark rounded-std focus:border-primary outline-none font-semibold transition" />
//   </div>
// );
// export default AuthPage;
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../context/AuthContext";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";

const AuthPage = ({ type = "login" }) => {
  const isLogin = type === "login";

  const { register, handleSubmit } = useForm();
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [show, setShow] = useState(false);

  // Xác định trang cần quay về sau login
  const from =
    location.state?.from?.pathname &&
    location.state.from.pathname !== "/login"
      ? location.state.from.pathname
      : "/";

  const onSubmit = async (data) => {
    if (isLogin) {
      const success = await login(data.username, data.password);

      if (success) {
        navigate(from, { replace: true });
      }
    } else {
      try {
        await axiosClient.post("/auth/register", data);
        toast.success("Đăng ký thành công!");
        navigate("/login");
      } catch (e) {
        toast.error(e.response?.data?.error || "Đăng ký thất bại");
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex w-1/2 bg-[#AAB5C3] items-center justify-center">
        <h1 className="text-5xl font-bold text-white drop-shadow-md">
          WebTruyen App
        </h1>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white">
        <div className="w-[400px]">
          <h2 className="text-3xl font-bold text-dark mb-8 text-center">
            {isLogin ? "Đăng Nhập" : "Đăng Ký"}
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {!isLogin && (
              <>
                <Input label="Họ tên" name="full_name" reg={register} />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  reg={register}
                />
              </>
            )}

            <Input label="Username" name="username" reg={register} />

            <div className="relative">
              <Input
                label="Mật khẩu"
                name="password"
                type={show ? "text" : "password"}
                reg={register}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-4 top-[38px] text-gray-500"
              >
                {show ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full h-[50px] bg-primary text-white font-bold rounded-std hover:bg-blue-600 transition shadow-lg shadow-blue-200 mt-4"
            >
              {isLogin ? "Vào đọc truyện" : "Tạo tài khoản"}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link
              to={isLogin ? "/register" : "/login"}
              className="font-bold text-primary hover:underline"
            >
              {isLogin
                ? "Chưa có tài khoản? Đăng ký"
                : "Đã có tài khoản? Đăng nhập"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, name, type = "text", reg }) => (
  <div>
    <label className="font-bold text-dark block mb-2">{label}</label>
    <input
      {...reg(name)}
      type={type}
      className="w-full h-[50px] px-4 border-[3px] border-dark rounded-std focus:border-primary outline-none font-semibold transition"
    />
  </div>
);

export default AuthPage;
