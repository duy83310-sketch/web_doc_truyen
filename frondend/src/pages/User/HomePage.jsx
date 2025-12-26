// // import { useEffect, useState } from "react";
// // import { Link } from "react-router-dom";
// // import axiosClient from "../../api/axiosClient";
// // import { useAuth } from "../../context/AuthContext";
// // import {
// //   FiSearch,
// //   FiChevronLeft,
// //   FiChevronRight,
// //   FiBell,
// //   FiUser,
// // } from "react-icons/fi";
// // import Loading from "../../components/Loading";

// // const HomePage = () => {
// //   const { user } = useAuth();
// //   const [stories, setStories] = useState([]);
// //   const [search, setSearch] = useState("");
// //   const [loading, setLoading] = useState(false);

// //   // Pagination State
// //   const [page, setPage] = useState(1);
// //   const [totalPages, setTotalPages] = useState(1);

// //   useEffect(() => {
// //     const fetchStories = async () => {
// //       setLoading(true);
// //       try {
// //         const res = await axiosClient.get(
// //           `/stories?q=${search}&page=${page}&limit=10`
// //         );
// //         if (res.data) {
// //           setStories(res.data);
// //           setTotalPages(res.pagination.totalPages);
// //         } else {
// //           setStories(Array.isArray(res) ? res : []);
// //         }
// //       } catch (e) {
// //         console.error(e);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     const t = setTimeout(fetchStories, 300);
// //     return () => clearTimeout(t);
// //   }, [search, page]);

// //   return (
// //     <div className="min-h-screen bg-gray-50/50">
// //       {/* --- TOP BAR (HEADER) --- */}
// //       <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
// //         {/* 1. Welcome Text (Mobile hidden) */}
// //         <div className="hidden md:block">
// //           <h1 className="text-xl font-bold text-dark">
// //             Hôm nay đọc gì? <span className="text-2xl">👋</span>
// //           </h1>
// //           <p className="text-sm text-gray-500 font-medium">
// //             Khám phá thế giới truyện tranh
// //           </p>
// //         </div>

// //         {/* 2. Search Bar (Centered & Pill shape) */}
// //         <div className="w-full md:w-[450px] relative group">
// //           <input
// //             type="text"
// //             placeholder="Tìm kiếm truyện, tác giả..."
// //             className="w-full pl-12 pr-4 py-3 bg-gray-100 border-transparent rounded-full outline-none font-semibold text-dark focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm group-hover:bg-white group-hover:shadow-md"
// //             value={search}
// //             onChange={(e) => {
// //               setSearch(e.target.value);
// //               setPage(1);
// //             }}
// //           />
// //           <FiSearch
// //             className="absolute left-4 top-3.5 text-gray-400 group-hover:text-primary transition-colors"
// //             size={20}
// //           />
// //         </div>

// //         {/* 3. User Profile Area (Right) */}
// //         <div className="flex items-center gap-4 shrink-0">
// //           <button className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-500 flex items-center justify-center hover:text-primary hover:border-primary transition shadow-sm relative">
// //             <FiBell size={20} />
// //             <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
// //           </button>

// //           <Link
// //             to={user ? "/profile" : "/login"}
// //             className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-white border border-gray-200 hover:shadow-md transition cursor-pointer"
// //           >
// //             <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-400 to-primary text-white flex items-center justify-center font-bold text-lg shadow-sm">
// //               {user ? (
// //                 user.avatar_url ? (
// //                   <img
// //                     src={user.avatar_url}
// //                     className="w-full h-full rounded-full object-cover"
// //                   />
// //                 ) : (
// //                   user.username.charAt(0).toUpperCase()
// //                 )
// //               ) : (
// //                 <FiUser />
// //               )}
// //             </div>
// //             <div className="text-left hidden sm:block">
// //               <p className="text-sm font-bold text-dark leading-tight">
// //                 {user ? user.username : "Đăng nhập"}
// //               </p>
// //               <p className="text-xs text-gray-400 font-medium">
// //                 {user ? "Thành viên" : "Khách"}
// //               </p>
// //             </div>
// //           </Link>
// //         </div>
// //       </div>

// //       {/* --- MAIN CONTENT --- */}
// //       <div className="px-4 md:px-8 pb-12">
// //         {/* Banner / Trending Section (Optional visual separator) */}
// //         <div className="mb-8 flex items-center gap-2">
// //           <div className="h-8 w-1.5 bg-primary rounded-full"></div>
// //           <h2 className="text-2xl font-bold text-dark tracking-tight">
// //             Truyện Mới Cập Nhật
// //           </h2>
// //         </div>

// //         {loading ? (
// //           <Loading />
// //         ) : (
// //           <>
// //             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
// //               {stories.map((s) => (
// //                 <Link
// //                   to={`/story/${s.story_id}`}
// //                   key={s.story_id}
// //                   className="group flex flex-col"
// //                 >
// //                   {/* CARD IMAGE */}
// //                   <div className="w-full aspect-[2/3] rounded-2xl overflow-hidden relative shadow-md group-hover:shadow-2xl group-hover:shadow-blue-200/50 transition-all duration-300 ease-out transform group-hover:-translate-y-2 bg-white">
// //                     <img
// //                       src={
// //                         s.cover_image_url ||
// //                         "https://placehold.co/300x450?text=No+Cover"
// //                       }
// //                       alt={s.title}
// //                       className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
// //                       onError={(e) => {
// //                         e.target.onerror = null;
// //                         e.target.src =
// //                           "https://placehold.co/300x450?text=Error";
// //                       }}
// //                     />

// //                     {/* Badge Rating */}
// //                     <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm text-yellow-600 flex items-center gap-1">
// //                       ⭐ {s.rating_average || 0}
// //                     </div>

// //                     {/* Badge Status (Nếu hoàn thành) */}
// //                     {s.status === "Hoàn thành" && (
// //                       <div className="absolute top-3 left-3 bg-green-500/90 text-white px-2 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wide shadow-sm">
// //                         Full
// //                       </div>
// //                     )}

// //                     {/* Overlay Gradient khi hover */}
// //                     <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
// //                   </div>

// //                   {/* CARD INFO */}
// //                   <div className="mt-4 px-1">
// //                     <h3
// //                       className="font-bold text-xl text-gray-800 leading-snug line-clamp-2 group-hover:text-primary transition-colors"
// //                       title={s.title}
// //                     >
// //                       {s.title}
// //                     </h3>
// //                     <div className="flex justify-between items-center mt-2">
// //                       <p className="text-sm text-gray-500 font-medium truncate max-w-[60%]">
// //                         {s.author}
// //                       </p>
// //                       <span className="text-xs text-primary bg-blue-50 px-2 py-1 rounded-md font-bold">
// //                         Truyện chữ
// //                       </span>
// //                     </div>
// //                   </div>
// //                 </Link>
// //               ))}
// //             </div>

// //             {/* Pagination Controls */}
// //             {totalPages > 1 && (
// //               <div className="flex justify-center mt-16 gap-3">
// //                 <button
// //                   disabled={page === 1}
// //                   onClick={() => setPage((p) => p - 1)}
// //                   className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-400 transition-all shadow-sm"
// //                 >
// //                   <FiChevronLeft size={20} />
// //                 </button>

// //                 <div className="px-6 h-10 flex items-center font-bold text-dark bg-white border border-gray-200 rounded-full shadow-sm">
// //                   Trang {page} / {totalPages}
// //                 </div>

// //                 <button
// //                   disabled={page === totalPages}
// //                   onClick={() => setPage((p) => p + 1)}
// //                   className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-400 transition-all shadow-sm"
// //                 >
// //                   <FiChevronRight size={20} />
// //                 </button>
// //               </div>
// //             )}

// //             {!loading && stories.length === 0 && (
// //               <div className="flex flex-col items-center justify-center py-20 text-gray-400">
// //                 <div className="text-6xl mb-4 opacity-50">🔍</div>
// //                 <p className="font-bold text-xl">Không tìm thấy truyện nào.</p>
// //               </div>
// //             )}
// //           </>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };
// // export default HomePage;
// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axiosClient from "../../api/axiosClient";
// import { useAuth } from "../../context/AuthContext"; // Khớp với thư mục context
// import {
//   FiSearch,
//   FiChevronLeft,
//   FiChevronRight,
//   FiBell,
//   FiUser,
// } from "react-icons/fi";
// import Loading from "../../components/Loading";

// const HomePage = () => {
//   const { user, loading: authLoading } = useAuth();
//   const navigate = useNavigate();
//   const [stories, setStories] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   useEffect(() => {
//     const fetchStories = async () => {
//       setLoading(true);
//       try {
//         const res = await axiosClient.get(
//           `/stories?q=${search}&page=${page}&limit=10`
//         );
//         if (res.data) {
//           setStories(res.data);
//           setTotalPages(res.pagination.totalPages);
//         } else {
//           setStories(Array.isArray(res) ? res : []);
//         }
//       } catch (e) {
//         console.error("Lỗi tải truyện:", e);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const t = setTimeout(fetchStories, 300);
//     return () => clearTimeout(t);
//   }, [search, page]);

//   // Logic điều hướng Profile/Login
//   const handleProfileClick = (e) => {
//     e.preventDefault();
//     if (user) {
//       navigate("/profile");
//     } else {
//       // Chuyển đến trang login nếu chưa có user
//       navigate("/login");
//     }
//   };

//   if (authLoading) return <Loading />;

//   return (
//     <div className="min-h-screen bg-gray-50/50">
//       <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
//         <div className="hidden md:block">
//           <h1 className="text-xl font-bold text-dark">Hôm nay đọc gì? 👋</h1>
//           <p className="text-sm text-gray-500 font-medium">Khám phá thế giới truyện tranh</p>
//         </div>

//         <div className="w-full md:w-[450px] relative group">
//           <input
//             type="text"
//             placeholder="Tìm kiếm truyện..."
//             className="w-full pl-12 pr-4 py-3 bg-gray-100 border-transparent rounded-full outline-none font-semibold text-dark focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
//             value={search}
//             onChange={(e) => { setSearch(e.target.value); setPage(1); }}
//           />
//           <FiSearch className="absolute left-4 top-3.5 text-gray-400" size={20} />
//         </div>

//         <div className="flex items-center gap-4 shrink-0">
//           <button className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-500 flex items-center justify-center hover:text-primary transition shadow-sm relative">
//             <FiBell size={20} />
//             <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
//           </button>

//           {/* Phần Profile đã sửa để điều hướng an toàn */}
//           <div
//             onClick={handleProfileClick}
//             className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-white border border-gray-200 hover:shadow-md transition cursor-pointer"
//           >
//             <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-400 to-primary text-white flex items-center justify-center font-bold text-lg shadow-sm">
//               {user ? (
//                 user.avatar_url ? (
//                   <img src={user.avatar_url} className="w-full h-full rounded-full object-cover" alt="avatar" />
//                 ) : (
//                   user.username.charAt(0).toUpperCase()
//                 )
//               ) : (
//                 <FiUser />
//               )}
//             </div>
//             <div className="text-left hidden sm:block">
//               <p className="text-sm font-bold text-dark leading-tight">
//                 {user ? user.username : "Đăng nhập"}
//               </p>
//               <p className="text-xs text-gray-400 font-medium">
//                 {user ? "Thành viên" : "Khách"}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="px-4 md:px-8 pb-12">
//         <div className="mb-8 flex items-center gap-2">
//           <div className="h-8 w-1.5 bg-primary rounded-full"></div>
//           <h2 className="text-2xl font-bold text-dark tracking-tight">Truyện Mới Cập Nhật</h2>
//         </div>

//         {loading ? (
//           <Loading />
//         ) : (
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
//             {stories.map((s) => (
//               <Link to={`/story/${s.story_id}`} key={s.story_id} className="group flex flex-col">
//                 <div className="w-full aspect-[2/3] rounded-2xl overflow-hidden relative shadow-md group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 bg-white border border-gray-100">
//                   <img
//                     src={s.cover_image_url || "https://placehold.co/300x450?text=No+Cover"}
//                     alt={s.title}
//                     className="w-full h-full object-cover"
//                   />
//                   <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold shadow-sm">
//                     ⭐ {s.rating_average || 0}
//                   </div>
//                 </div>
//                 <div className="mt-4 px-1">
//                   <h3 className="font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
//                     {s.title}
//                   </h3>
//                   <p className="text-xs text-gray-400 mt-1">{s.author}</p>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HomePage;
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../context/AuthContext";
import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiBell,
  FiUser,
} from "react-icons/fi";
import Loading from "../../components/Loading";

const HomePage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Trạng thái phân trang
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get(
          `/stories?q=${search}&page=${page}&limit=10`
        );
        if (res.data) {
          setStories(res.data);
          setTotalPages(res.pagination.totalPages);
        } else {
          setStories(Array.isArray(res) ? res : []);
        }
      } catch (e) {
        console.error("Lỗi khi tải danh sách truyện:", e);
      } finally {
        setLoading(false);
      }
    };

    const t = setTimeout(fetchStories, 300);
    return () => clearTimeout(t);
  }, [search, page]);

  /**
   * Xử lý khi nhấn vào khu vực Profile
   * Nếu đã đăng nhập -> Chuyển đến trang Profile
   * Nếu chưa đăng nhập -> Chuyển đến trang Login
   */
  const handleProfileClick = () => {
    if (user && user.user_id) {
      navigate("/profile");
    } else {
      // Chuyển hướng đến Route "/login" đã định nghĩa trong App.jsx
      navigate("/login");
    }
  };

  // Hiển thị màn hình chờ nếu AuthContext đang xác thực người dùng
  if (authLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* --- HEADER --- */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Lời chào */}
        <div className="hidden md:block">
          <h1 className="text-xl font-bold text-dark">
            Hôm nay đọc gì? <span className="text-2xl">👋</span>
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Khám phá thế giới truyện tranh
          </p>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="w-full md:w-[450px] relative group">
          <input
            type="text"
            placeholder="Tìm kiếm truyện, tác giả..."
            className="w-full pl-12 pr-4 py-3 bg-gray-100 border-transparent rounded-full outline-none font-semibold text-dark focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <FiSearch
            className="absolute left-4 top-3.5 text-gray-400 group-hover:text-primary transition-colors"
            size={20}
          />
        </div>

        {/* Khu vực người dùng */}
        <div className="flex items-center gap-4 shrink-0">
          <button className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-500 flex items-center justify-center hover:text-primary hover:border-primary transition shadow-sm relative">
            <FiBell size={20} />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* KHU VỰC THAY ĐỔI: Chuyển sang div + onClick để xử lý logic điều hướng */}
          <div
            onClick={handleProfileClick}
            className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-white border border-gray-200 hover:shadow-md transition cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-400 to-primary text-white flex items-center justify-center font-bold text-lg shadow-sm overflow-hidden">
              {user ? (
                user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    className="w-full h-full object-cover"
                    alt="avatar"
                  />
                ) : (
                  user.username?.charAt(0).toUpperCase()
                )
              ) : (
                <FiUser />
              )}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-bold text-dark leading-tight">
                {user ? user.username : "Đăng nhập"}
              </p>
              <p className="text-xs text-gray-400 font-medium">
                {user ? (user.is_admin ? "Quản trị viên" : "Thành viên") : "Khách"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- DANH SÁCH TRUYỆN --- */}
      <div className="px-4 md:px-8 pb-12">
        <div className="mb-8 flex items-center gap-2">
          <div className="h-8 w-1.5 bg-primary rounded-full"></div>
          <h2 className="text-2xl font-bold text-dark tracking-tight">
            Truyện Mới Cập Nhật
          </h2>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
              {stories.map((s) => (
                <Link
                  to={`/story/${s.story_id}`}
                  key={s.story_id}
                  className="group flex flex-col"
                >
                  <div className="w-full aspect-[2/3] rounded-2xl overflow-hidden relative shadow-md group-hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2 bg-white">
                    <img
                      src={s.cover_image_url || "https://placehold.co/300x450?text=No+Cover"}
                      alt={s.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm text-yellow-600 flex items-center gap-1">
                      ⭐ {s.rating_average || 0}
                    </div>
                  </div>

                  <div className="mt-4 px-1">
                    <h3 className="font-bold text-xl text-gray-800 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 truncate">
                      {s.author}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Điều khiển phân trang */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-16 gap-3">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-primary hover:text-white disabled:opacity-30 transition-all shadow-sm"
                >
                  <FiChevronLeft size={20} />
                </button>
                <div className="px-6 h-10 flex items-center font-bold text-dark bg-white border border-gray-200 rounded-full shadow-sm">
                  Trang {page} / {totalPages}
                </div>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-primary hover:text-white disabled:opacity-30 transition-all shadow-sm"
                >
                  <FiChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;