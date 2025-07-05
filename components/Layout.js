import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Layout({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 初始获取用户
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    getUser();

    // 实时监听用户状态变化（关键修复）
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    // 清理监听器
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    alert('你已登出');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-xl font-bold cursor-pointer">📍 房产地图平台</h1>
        </Link>

        <div className="space-x-4">
          {user ? (
            <>
              <span className="text-sm">👋 欢迎 {user.email}</span>
              <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
                登出
              </button>
            </>
          ) : (
            <>
              <Link href="/Login">
                <button className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600">登录</button>
              </Link>
              <Link href="/Register">
                <button className="bg-green-500 px-3 py-1 rounded hover:bg-green-600">注册</button>
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="bg-gray-100 text-center py-4 text-sm text-gray-600">
        © {new Date().getFullYear()} 房产平台. All rights reserved.
      </footer>
    </div>
  );
}
