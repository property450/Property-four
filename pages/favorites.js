// pages/favorites.js
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Link from 'next/link';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const loadFavorites = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert('请先登录');
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from('favorites')
        .select('property_id, properties(*)')
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ 读取收藏失败:', error);
      } else {
        setFavorites(data);
      }

      setLoading(false);
    };

    loadFavorites();
  }, []);

  const handleUnfavorite = async (propertyId) => {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('property_id', propertyId);

    if (error) {
      console.error('❌ 取消收藏失败:', error);
      alert('取消收藏失败');
    } else {
      setFavorites((prev) =>
        prev.filter((f) => f.property_id !== propertyId)
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">💖 我的收藏房源</h1>

      {loading ? (
        <p>加载中...</p>
      ) : favorites.length === 0 ? (
        <p>你还没有收藏任何房源。</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((fav) => {
            const house = fav.properties;
            return (
              <div
                key={fav.property_id}
                className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
              >
                <img src={house.image} alt={house.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">{house.title}</h2>
                  <p className="text-gray-600 mb-2">RM {house.price?.toLocaleString()}</p>
                  <a
                    href={house.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    🔗 查看详情
                  </a>
                  <button
                    className="block mt-4 text-red-500 hover:underline"
                    onClick={() => handleUnfavorite(fav.property_id)}
                  >
                    ❌ 取消收藏
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="mt-6">
        <Link href="/" className="text-blue-500 hover:underline">
          ← 返回首页
        </Link>
      </div>
    </div>
  );
}
