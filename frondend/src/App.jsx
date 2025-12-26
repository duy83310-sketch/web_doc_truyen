// // import { BrowserRouter, Routes, Route } from "react-router-dom";
// // import { AuthProvider } from "./context/AuthContext";
// // import { ToastContainer } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";

// // // Layouts
// // import MainLayout from "./layouts/MainLayout";
// // import AdminLayout from "./layouts/AdminLayout";

// // // User Pages
// // import HomePage from "./pages/User/HomePage";
// // import StoryDetail from "./pages/User/StoryDetail";
// // import ReadingPage from "./pages/User/ReadingPage";
// // import CollectionPage from "./pages/User/CollectionPage";
// // import AuthPage from "./pages/Auth/AuthPage";
// // import ProfilePage from "./pages/User/ProfilePage"; // <--- MỚI THÊM

// // // Admin Pages
// // import AdminRoute from "./routes/AdminRoute";
// // import Dashboard from "./pages/Admin/Dashboard";
// // import ManageStories from "./pages/Admin/ManageStories";
// // import StoryForm from "./pages/Admin/StoryForm";
// // import ManageChapters from "./pages/Admin/ManageChapters";
// // import ChapterForm from "./pages/Admin/ChapterForm";
// // import ManageGenres from "./pages/Admin/ManageGenres";
// // import ManageUsers from "./pages/Admin/ManageUsers";

// // function App() {
// //   return (
// //     <BrowserRouter>
// //       <AuthProvider>
// //         <Routes>
// //           {/* USER ROUTES */}
// //           <Route element={<MainLayout />}>
// //             <Route path="/" element={<HomePage />} />
// //             <Route path="/story/:id" element={<StoryDetail />} />
// //             <Route path="/read/:storyId/:chapterId" element={<ReadingPage />} />
// //             <Route
// //               path="/favorites"
// //               element={<CollectionPage type="favorites" />}
// //             />
// //             <Route
// //               path="/history"
// //               element={<CollectionPage type="history" />}
// //             />

// //             {/* ĐÃ CẬP NHẬT: Trỏ vào trang ProfilePage thật */}
// //             <Route path="/profile" element={<ProfilePage />} />
// //           </Route>

// //           {/* AUTH ROUTES */}
// //           <Route path="/login" element={<AuthPage type="login" />} />
// //           <Route path="/register" element={<AuthPage type="register" />} />

// //           {/* ADMIN ROUTES */}
// //           <Route element={<AdminRoute />}>
// //             <Route element={<AdminLayout />}>
// //               <Route path="/admin/dashboard" element={<Dashboard />} />
// //               <Route path="/admin/stories" element={<ManageStories />} />
// //               <Route path="/admin/stories/create" element={<StoryForm />} />
// //               <Route path="/admin/stories/edit/:id" element={<StoryForm />} />
// //               <Route
// //                 path="/admin/stories/:storyId/chapters"
// //                 element={<ManageChapters />}
// //               />
// //               <Route
// //                 path="/admin/stories/:storyId/chapters/create"
// //                 element={<ChapterForm />}
// //               />
// //               <Route path="/admin/genres" element={<ManageGenres />} />
// //               {/* Đã sửa lại đúng Component ManageUsers */}
// //               <Route path="/admin/users" element={<ManageUsers />} />
// //             </Route>
// //           </Route>
// //         </Routes>
// //         <ToastContainer position="bottom-right" />
// //       </AuthProvider>
// //     </BrowserRouter>
// //   );
// // }
// // export default App;
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // Layouts
// import MainLayout from "./layouts/MainLayout";
// import AdminLayout from "./layouts/AdminLayout";

// // User Pages
// import HomePage from "./pages/User/HomePage";
// import StoryDetail from "./pages/User/StoryDetail";
// import ReadingPage from "./pages/User/ReadingPage";
// import CollectionPage from "./pages/User/CollectionPage";
// import AuthPage from "./pages/Auth/AuthPage";
// import ProfilePage from "./pages/User/ProfilePage";

// // Admin Pages
// import AdminRoute from "./routes/AdminRoute";
// import Dashboard from "./pages/Admin/Dashboard";
// import ManageStories from "./pages/Admin/ManageStories";
// import StoryForm from "./pages/Admin/StoryForm";
// import ManageChapters from "./pages/Admin/ManageChapters";
// import ChapterForm from "./pages/Admin/ChapterForm";
// import ManageGenres from "./pages/Admin/ManageGenres";
// import ManageUsers from "./pages/Admin/ManageUsers";

// function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <Routes>
//           {/* USER ROUTES - Các route này nằm trong MainLayout (có Header/Footer chung) */}
//           <Route element={<MainLayout />}>
//             <Route path="/" element={<HomePage />} />
//             <Route path="/story/:id" element={<StoryDetail />} />
//             <Route path="/read/:storyId/:chapterId" element={<ReadingPage />} />
//             <Route
//               path="/favorites"
//               element={<CollectionPage type="favorites" />}
//             />
//             <Route
//               path="/history"
//               element={<CollectionPage type="history" />
//             }
//             />

//             {/* Route trang cá nhân */}
//             <Route path="/profile" element={<ProfilePage />} />
//           </Route>

//           {/* AUTH ROUTES - Các trang đăng nhập/đăng ký tách biệt layout */}
//           <Route path="/login" element={<AuthPage type="login" />} />
//           <Route path="/register" element={<AuthPage type="register" />} />

//           {/* ADMIN ROUTES - Được bảo vệ bởi AdminRoute */}
//           <Route element={<AdminRoute />}>
//             <Route element={<AdminLayout />}>
//               <Route path="/admin/dashboard" element={<Dashboard />} />
//               <Route path="/admin/stories" element={<ManageStories />} />
//               <Route path="/admin/stories/create" element={<StoryForm />} />
//               <Route path="/admin/stories/edit/:id" element={<StoryForm />} />
//               <Route
//                 path="/admin/stories/:storyId/chapters"
//                 element={<ManageChapters />}
//               />
//               <Route
//                 path="/admin/stories/:storyId/chapters/create"
//                 element={<ChapterForm />}
//               />
//               <Route path="/admin/genres" element={<ManageGenres />} />
//               <Route path="/admin/users" element={<ManageUsers />} />
//             </Route>
//           </Route>

//           {/* Fallback Route (Tùy chọn) - Nếu người dùng vào link lạ sẽ về Home */}
//           <Route path="*" element={<HomePage />} />
//         </Routes>
        
//         {/* Thông báo Toast toàn cục */}
//         <ToastContainer 
//           position="bottom-right" 
//           autoClose={3000}
//           hideProgressBar={false}
//           newestOnTop={false}
//           closeOnClick
//           rtl={false}
//           pauseOnFocusLoss
//           draggable
//           pauseOnHover
//         />
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

// User Pages
import HomePage from "./pages/User/HomePage";
import StoryDetail from "./pages/User/StoryDetail";
import ReadingPage from "./pages/User/ReadingPage";
import CollectionPage from "./pages/User/CollectionPage";
import ProfilePage from "./pages/User/ProfilePage";
import AuthPage from "./pages/Auth/AuthPage";

// Admin Pages
import AdminRoute from "./routes/AdminRoute";
import PrivateRoute from "./routes/PrivateRoute";
import Dashboard from "./pages/Admin/Dashboard";
import ManageStories from "./pages/Admin/ManageStories";
import StoryForm from "./pages/Admin/StoryForm";
import ManageChapters from "./pages/Admin/ManageChapters";
import ChapterForm from "./pages/Admin/ChapterForm";
import ManageGenres from "./pages/Admin/ManageGenres";
import ManageUsers from "./pages/Admin/ManageUsers";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* ===== USER ROUTES ===== */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/story/:id" element={<StoryDetail />} />
            <Route path="/read/:storyId/:chapterId" element={<ReadingPage />} />

            <Route path="/favorites" element={<CollectionPage type="favorites" />} />
            <Route path="/history" element={<CollectionPage type="history" />} />

            {/* 🔐 PROFILE (BẢO VỆ) */}
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* ===== AUTH ===== */}
          <Route path="/login" element={<AuthPage type="login" />} />
          <Route path="/register" element={<AuthPage type="register" />} />

          {/* ===== ADMIN ===== */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/stories" element={<ManageStories />} />
              <Route path="/admin/stories/create" element={<StoryForm />} />
              <Route path="/admin/stories/edit/:id" element={<StoryForm />} />
              <Route
                path="/admin/stories/:storyId/chapters"
                element={<ManageChapters />}
              />
              <Route
                path="/admin/stories/:storyId/chapters/create"
                element={<ChapterForm />}
              />
              <Route path="/admin/genres" element={<ManageGenres />} />
              <Route path="/admin/users" element={<ManageUsers />} />
            </Route>
          </Route>

          {/* FALLBACK */}
          <Route path="*" element={<HomePage />} />

        </Routes>

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
