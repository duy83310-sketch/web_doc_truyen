import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import MainLayout from "./layouts/MainLayout";
import AdminLayout from './layouts/AdminLayout';

// User Pages
import HomePage from './pages/User/HomePage';
import StoryDetail from './pages/User/StoryDetail';
import ReadingPage from './pages/User/ReadingPage';
import CollectionPage from './pages/User/CollectionPage';
import AuthPage from './pages/Auth/AuthPage';

// Admin Pages
import AdminRoute from './routes/AdminRoute';
import Dashboard from './pages/Admin/Dashboard';
import ManageStories from './pages/Admin/ManageStories';
import StoryForm from './pages/Admin/StoryForm';
import ManageChapters from './pages/Admin/ManageChapters';
import ChapterForm from './pages/Admin/ChapterForm';
import ManageGenres from './pages/Admin/ManageGenres';
import ManageUsers from './pages/Admin/ManageUsers'; // Bạn có thể tạo file này tương tự ManageStories

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* USER ROUTES */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/story/:id" element={<StoryDetail />} />
            <Route path="/read/:storyId/:chapterId" element={<ReadingPage />} />
            <Route path="/favorites" element={<CollectionPage type="favorites" />} />
            <Route path="/history" element={<CollectionPage type="history" />} />
            <Route path="/profile" element={<div className="p-8 font-bold text-2xl">Trang cá nhân</div>} />
          </Route>

          {/* AUTH ROUTES */}
          <Route path="/login" element={<AuthPage type="login" />} />
          <Route path="/register" element={<AuthPage type="register" />} />

          {/* ADMIN ROUTES */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/stories" element={<ManageStories />} />
              <Route path="/admin/stories/create" element={<StoryForm />} />
              <Route path="/admin/stories/edit/:id" element={<StoryForm />} />
              <Route path="/admin/stories/:storyId/chapters" element={<ManageChapters />} />
              <Route path="/admin/stories/:storyId/chapters/create" element={<ChapterForm />} />
              <Route path="/admin/genres" element={<ManageGenres />} />
              <Route path="/admin/users" element={<ManageGenres />} /> {/* Placeholder, thay bằng ManageUsers */}
            </Route>
          </Route>
        </Routes>
        <ToastContainer position="bottom-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;