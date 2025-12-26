import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { FiBook, FiUsers, FiLayers } from "react-icons/fi";
import Loading from "../../components/Loading";

const Dashboard = () => {
  const [stats, setStats] = useState({ stories: 0, users: 0, genres: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi API song song
        const [sRes, uRes, gRes] = await Promise.all([
          axiosClient.get("/stories?limit=1"), // Chỉ cần lấy 1 bản ghi để lấy metadata pagination
          axiosClient.get("/users"),
          axiosClient.get("/genres"),
        ]);

        // LOGIC MỚI:
        // 1. Stories: Lấy từ pagination.totalItems (chính xác hơn) hoặc fallback length
        const totalStories = sRes.pagination
          ? sRes.pagination.totalItems
          : Array.isArray(sRes)
          ? sRes.length
          : 0;

        // 2. Users & Genres: Vẫn là mảng như cũ
        const totalUsers = Array.isArray(uRes) ? uRes.length : 0;
        const totalGenres = Array.isArray(gRes) ? gRes.length : 0;

        setStats({
          stories: totalStories,
          users: totalUsers,
          genres: totalGenres,
        });
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const Card = ({ title, count, icon: Icon, color, bg }) => (
    <div className="bg-white p-6 rounded-std border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-gray-500 font-bold mb-1 text-sm uppercase tracking-wide">
          {title}
        </p>
        <h3 className="text-4xl font-bold text-dark">{count}</h3>
      </div>
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl shadow-lg ${bg}`}
      >
        <Icon />
      </div>
    </div>
  );

  if (loading) return <Loading />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8 text-dark">Tổng quan hệ thống</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          title="Tổng số Truyện"
          count={stats.stories}
          icon={FiBook}
          bg="bg-blue-500 shadow-blue-200"
        />
        <Card
          title="Thành viên"
          count={stats.users}
          icon={FiUsers}
          bg="bg-green-500 shadow-green-200"
        />
        <Card
          title="Thể loại"
          count={stats.genres}
          icon={FiLayers}
          bg="bg-orange-500 shadow-orange-200"
        />
      </div>
    </div>
  );
};

export default Dashboard;
