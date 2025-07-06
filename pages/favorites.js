import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Link from 'next/link';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        alert('请先登录');
        return;
      }

      setUser(user);

      const { data, error } = await supabase
        .from('favorites')
        .select('id, property_id, properties(*)')
        .eq('user_id', user.id);

      if (error) {
        console.error('获取收藏失败', error);
      } else {
        setFavorites(data);
      }

      setLoading(false);
    };

    fetchFavorites();
  }, []);

  const handleUnfavorite = async (favoriteId) => {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', favoriteId);

    if (error) {
      console.error('取消收藏失败', error);
      alert('取消失败');
    } else {
      setFavorites((prev) => prev.filter((f) => f.id !== favoriteId));
    }
  };

  if (loading) return <p className="text-center mt-10">加载中...</p>;
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">❤️ 我的收藏房源</h1>
      {favorites.length === 0 ? (
        <p>你还没有收藏任何房源。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map(({ id, properties: house }) => (
            <div
              key={house.id}
              className="border p-4 rounded shadow hover:shadow-lg transition"
            >
              <img
                src={house.image}
                alt={house.title}
                className="w-full h-48 object-cover rounded mb-2"
              />
              <h2 className="text-lg font-semibold">{house.title}</h2>
              <p className="text-gray-600">RM{house.price?.toLocaleString()}</p>
              <Link
                href={house.link}
                className="text-blue-600 underline"
                target="_blank"
              >
                查看详情
              </Link>
              <br />
              <button
                onClick={() => handleUnfavorite(id)}
                className="mt-2 text-sm text-red-600 hover:underline"
              >
                ❌ 取消收藏
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
