import { Link, useLocation } from 'react-router-dom';
import { FiGrid, FiBookOpen, FiUsers, FiTag, FiLogOut, FiCornerDownLeft } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const isActive = (p) => location.pathname.startsWith(p);

  const AdminLink = ({ to, icon: Icon, label }) => (
    <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-std mb-2 transition-all font-bold ${isActive(to) ? 'bg-primary text-white shadow-md' : 'text-dark hover:bg-white'}`}>
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );

  return (
    <div className="fixed left-0 top-0 h-screen w-[240px] bg-sidebar flex flex-col py-8 px-4 z-50 border-r border-gray-200">
      <div className="text-2xl font-bold text-center mb-10 text-dark">ADMIN <span className="text-primary">PANEL</span></div>
      
      <div className="flex-1">
        <AdminLink to="/admin/dashboard" icon={FiGrid} label="Tổng quan" />
        <AdminLink to="/admin/stories" icon={FiBookOpen} label="Quản lý Truyện" />
        <AdminLink to="/admin/genres" icon={FiTag} label="Thể loại" />
        <AdminLink to="/admin/users" icon={FiUsers} label="Người dùng" />
      </div>

      <div className="border-t border-gray-300 pt-4">
        <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-primary font-bold">
          <FiCornerDownLeft size={20}/> Về trang chủ
        </Link>
        <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-std font-bold mt-2">
          <FiLogOut size={20} /> Đăng xuất
        </button>
      </div>
    </div>
  );
};
export default AdminSidebar;