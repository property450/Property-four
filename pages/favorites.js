import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Link from 'next/link';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      if (!userId) {
        alert('请先登录');
        return;
      }

      const { data, error } = await supabase
        .from('favorites')
        .select('id, property_id, properties (*)')
        .eq('user_id', userId);

      if (error) {
        console.error('获取收藏失败:', error);
      } else {
        setFavorites(data.map((item) => item.properties));
      }

      setLoading(false);
    };

    fetchFavorites();
  }, []);

  if (loading) return <p className="text-center mt-10">加载中...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">❤️ 我的收藏</h1>
      {favorites.length === 0 ? (
        <p>还没有收藏的房源。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map((house) => (
            <div key={house.id} className="border p-4 rounded shadow">
              <img src={house.image} alt={house.title} className="w-full h-48 object-cover rounded mb-2" />
              <h2 className="text-lg font-bold">{house.title}</h2>
              <p className="text-sm text-gray-600">RM {house.price?.toLocaleString()}</p>
              <Link href={house.link}>
                <span className="text-blue-500 hover:underline inline-block mt-2">查看详情</span>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
