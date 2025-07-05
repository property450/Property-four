import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../supabaseClient';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

export default function Home() {
  const [user, setUser] = useState(null);

  // 获取当前登录的用户信息
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        console.log('✅ 已登录用户:', data.user);
      } else {
        console.log('❌ 未登录:', error?.message);
      }
    };

    fetchUser();
  }, []);

  // 登出函数
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    alert('你已登出');
    location.reload(); // 重新加载页面刷新状态
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: '20px 0' }}>📍 房产地图搜索平台</h1>

      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        {user ? (
          <div>
            👋 欢迎, {user.email}
            <button
              onClick={handleLogout}
              className="ml-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              登出
            </button>
          </div>
        ) : (
          <div className="space-x-4">
            <Link href="/Login">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                登录
              </button>
            </Link>
            <Link href="/Register">
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                注册
              </button>
            </Link>
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Link href="/upload">
          <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
            上传房源
          </button>
        </Link>
      </div>

      <Map />
    </div>
  );
}
