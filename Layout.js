import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Layout({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.reload();
  };

  return (
    <div>
      <nav className="flex justify-between items-center bg-gray-800 text-white px-6 py-4">
        <Link href="/">
          <span className="font-bold text-xl cursor-pointer">🏠 PropertyMap</span>
        </Link>
        <div className="space-x-4">
          {user ? (
            <>
              <Link href="/Upload">
                <span className="hover:underline cursor-pointer">上传房源</span>
              </Link>
              <Link href="/Favorites">
                <span className="hover:underline cursor-pointer">我的收藏</span>
              </Link>
              <button onClick={handleLogout} className="hover:underline">登出</button>
            </>
          ) : (
            <>
              <Link href="/Login">
                <span className="hover:underline cursor-pointer">登录</span>
              </Link>
              <Link href="/Register">
                <span className="hover:underline cursor-pointer">注册</span>
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="p-4">{children}</main>
    </div>
  );
}
