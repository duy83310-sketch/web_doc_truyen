import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { FiSearch } from 'react-icons/fi';

const HomePage = () => {
  const [stories, setStories] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try { const res = await axiosClient.get(`/stories?q=${search}`); setStories(res); } 
      catch (e) { console.error(e); }
    };
    const t = setTimeout(fetch, 300);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-dark">Khám phá truyện hay</h1>
        <div className="relative">
          <input type="text" placeholder="Tìm kiếm..." className="pl-10 pr-4 py-3 bg-sidebar rounded-std outline-none w-[300px] font-semibold focus:ring-2 focus:ring-primary border-none" value={search} onChange={e=>setSearch(e.target.value)} />
          <FiSearch className="absolute left-3 top-3.5 text-gray-500" size={20} />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {stories.map(s => (
          <Link to={`/story/${s.story_id}`} key={s.story_id} className="group">
            <div className="w-full aspect-[2/3] bg-card rounded-std overflow-hidden relative shadow-sm group-hover:shadow-xl transition-all">
              <img src={s.cover_image_url || 'https://placehold.co/219x350'} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-bold shadow">⭐ {s.rating_average}</div>
            </div>
            <h3 className="mt-3 font-bold text-lg text-dark truncate group-hover:text-primary">{s.title}</h3>
            <p className="text-sm text-gray-500 truncate">{s.author}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default HomePage;