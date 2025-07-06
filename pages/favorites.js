import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Link from 'next/link';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) {
        alert('请先登录');
        setLoading(false);
        return;
      }

      setUser(userData.user);

      const { data, error } = await supabase
        .from('favorites')
        .select('properties (*)')
        .eq('user_id', userId);

      if (error) {
        console.error('获取收藏失败:', error.message);
      } else {
        const propertyList = data.map((item) => item.properties);
        setFavorites(propertyList);
      }

      setLoading(false);
    };

    fetchFavorites();
  }, []);

  if (loading) return <p className="text-center mt-10">加载中...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">❤️ 我的收藏房源</h1>
      {favorites.length === 0 ? (
        <p className="text-center">你还没有收藏任何房源。</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {favorites.map((house) => (
            <div key={house.id} className="border p-3 rounded shadow hover:shadow-lg transition duration-200">
              <img src={house.image} alt={house.title} className="w-full h-40 object-cover rounded mb-2" />
              <h2 className="font-bold text-lg">{house.title}</h2>
              <p>💰 RM{house.price?.toLocaleString()}</p>
              <Link href={house.link} target="_blank" className="text-blue-500 mt-2 inline-block">🔗 查看详情</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
