import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Link from 'next/link';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavorites() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!user) {
        alert('请先登录');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('favorites')
        .select('property_id, properties(*)')
        .eq('user_id', user.id);

      if (error) {
        console.error('获取收藏失败', error);
      } else {
        setFavorites(data.map((f) => f.properties));
      }
      setLoading(false);
    }

    fetchFavorites();
  }, []);

  if (loading) return <p className="text-center p-4">加载中...</p>;
  if (favorites.length === 0)
    return (
      <div className="text-center p-6">
        <p>你还没有收藏任何房源。</p>
        <Link href="/">
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">回到首页</button>
        </Link>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">❤️ 我的收藏房源</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {favorites.map((house) => (
          <div key={house.id} className="border rounded p-4 shadow">
            <img src={house.image} alt={house.title} className="w-full h-48 object-cover rounded mb-2" />
            <h3 className="text-xl font-semibold">{house.title}</h3>
            <p>RM{house.price?.toLocaleString()}</p>
            <a href={house.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 mt-2 inline-block">
              🔗 查看详情
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
