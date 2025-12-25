import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { FiTrash2, FiUser, FiShield } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axiosClient.get('/users');
      setUsers(res);
    } catch (error) {
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác!')) {
      try {
        await axiosClient.delete(`/users/${id}`);
        toast.success('Đã xóa người dùng');
        fetchUsers(); // Load lại danh sách
      } catch (error) {
        toast.error('Lỗi khi xóa người dùng');
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-dark">Quản lý Người dùng ({users.length})</h2>
      <div className="overflow-x-auto bg-white rounded-std shadow-sm border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-dark font-bold">
            <tr>
              <th className="p-4 border-b">ID</th>
              <th className="p-4 border-b">Username</th>
              <th className="p-4 border-b">Email</th>
              <th className="p-4 border-b">Họ tên</th>
              <th className="p-4 border-b">Vai trò</th>
              <th className="p-4 border-b text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.user_id} className="hover:bg-gray-50 border-b last:border-0 transition">
                <td className="p-4">#{u.user_id}</td>
                <td className="p-4 font-semibold text-primary">{u.username}</td>
                <td className="p-4 text-gray-600">{u.email}</td>
                <td className="p-4">{u.full_name || '---'}</td>
                <td className="p-4">
                  {u.is_admin ? (
                    <span className="inline-flex items-center gap-1 bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold">
                      <FiShield /> Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                      <FiUser /> User
                    </span>
                  )}
                </td>
                <td className="p-4 text-center">
                  {!u.is_admin && (
                    <button
                      onClick={() => handleDelete(u.user_id)}
                      className="p-2 bg-gray-100 text-red-500 rounded-std hover:bg-red-500 hover:text-white transition"
                      title="Xóa người dùng"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;