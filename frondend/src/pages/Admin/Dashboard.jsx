import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { FiBook, FiUsers, FiLayers } from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState({ stories: 0, users: 0, genres: 0 });

  useEffect(() => {
    // Vì backend chưa có api /stats, ta gọi các list về đếm tạm
    Promise.all([
      axiosClient.get('/stories'),
      axiosClient.get('/users'),
      axiosClient.get('/genres')
    ]).then(([s, u, g]) => {
      setStats({ stories: s.length, users: u.length, genres: g.length });
    });
  }, []);

  const Card = ({ title, count, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-std border border-gray-200 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-gray-500 font-bold mb-1">{title}</p>
        <h3 className="text-4xl font-bold text-dark">{count}</h3>
      </div>
      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl ${color}`}>
        <Icon />
      </div>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8 text-dark">Tổng quan hệ thống</h2>
      <div className="grid grid-cols-3 gap-8">
        <Card title="Tổng số Truyện" count={stats.stories} icon={FiBook} color="bg-blue-500" />
        <Card title="Người dùng" count={stats.users} icon={FiUsers} color="bg-green-500" />
        <Card title="Thể loại" count={stats.genres} icon={FiLayers} color="bg-purple-500" />
      </div>
    </div>
  );
};
export default Dashboard;