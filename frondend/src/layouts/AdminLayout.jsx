import AdminSidebar from '../components/AdminSidebar';
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Sidebar của Admin */}
      <AdminSidebar />
      
      {/* Nội dung đẩy sang phải 240px */}
      <div className="pl-[240px] min-h-screen p-8">
        <div className="max-w-7xl mx-auto bg-white rounded-std shadow-sm min-h-[85vh] p-8 border border-gray-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
}