import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiBook, FiClock, FiLogOut, FiUser, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isActive = (p) => location.pathname === p;

  // Icon Button Component
  const IconBtn = ({ to, icon: Icon, active }) => (
    <Link 
      to={to} 
      className={`w-[50px] h-[50px] flex items-center justify-center rounded-std transition-all mb-8 
      ${active ? 'bg-primary text-white shadow-lg shadow-blue-200' : 'text-dark hover:bg-white'}`}
    >
      <Icon size={24} strokeWidth={2.5} />
    </Link> 
  );

  return (
    // w-sidebar = 120px (cấu hình ở bước 1)
    <div className="fixed left-0 top-0 h-screen w-sidebar bg-sidebar flex flex-col items-center py-12 z-50">
      
      {/* LOGO: Tròn, viền đậm */}
      <div className="w-[60px] h-[60px] border-3 border-dark mb-16 rounded-full flex items-center justify-center bg-white font-bold text-lg tracking-tighter cursor-default">
        BTL
      </div>

      {/* MENU LIST */}
      <div className="flex-1 flex flex-col items-center">
        <IconBtn to="/" icon={FiHome} active={isActive('/')} />
        <IconBtn to="/favorites" icon={FiBook} active={isActive('/favorites')} />
        <IconBtn to="/history" icon={FiClock} active={isActive('/history')} />
        <IconBtn to="/profile" icon={FiUser} active={isActive('/profile')} />
      </div>

      {/* BOTTOM ACTION */}
      <div className="mb-4">
        {user ? (
          <button onClick={logout} className="w-[50px] h-[50px] flex items-center justify-center text-red-500 hover:bg-red-100 rounded-std transition-all">
            <FiLogOut size={24} strokeWidth={2.5} />
          </button>
        ) : (
          <IconBtn to="/login" icon={FiLogIn} />
        )}
      </div>
    </div>
  );
};

export default Sidebar;