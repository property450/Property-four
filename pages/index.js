import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 检查当前用户是否登录
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    alert('已登出');
    window.location.reload();
  };

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold text-center mb-6">📍 房产地图搜索平台</h1>

      {/* 顶部按钮区域 */}
      <div className="flex justify-center flex-wrap gap-4 mb-6">
        <Link href="/upload">
          <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
            上传房源
          </button>
        </Link>
        <Link href="/favorites">
          <button className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600">
            ❤️ 我的收藏
          </button>
        </Link>

        {user ? (
          <>
            <span className="text-gray-700 font-medium px-2">欢迎：{user.email}</span>
            <button
              onClick={handleLogout}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              登出
            </button>
          </>
        ) : (
          <>
            <Link href="/Register">
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                注册
              </button>
            </Link>
            <Link href="/Login">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                登录
              </button>
            </Link>
          </>
        )}
      </div>

      {/* 地图组件 */}
      <Map />
    </div>
  );
}
