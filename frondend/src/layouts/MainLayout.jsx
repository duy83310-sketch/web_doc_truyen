import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar của User */}
      <Sidebar />
      {/* Nội dung đẩy sang phải 120px */}
      <div className="pl-sidebar min-h-screen">
        <div className="p-10 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}