import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useRouter } from 'next/router';

export default function PostProperty() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push('/Login'); // 如果没登录，跳转登录
      } else {
        setSession(data.session);
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('properties').insert([
      {
        title,
        description,
        price: parseFloat(price),
        address,
        user_id: session.user.id,
      },
    ]);
    if (error) {
      setMessage('❌ 上传失败：' + error.message);
    } else {
      setMessage('✅ 房源上传成功！');
      setTitle('');
      setDescription('');
      setPrice('');
      setAddress('');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">🏠 上传房源</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="房源标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <textarea
          placeholder="房源描述"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="价格 (RM)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="地址"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          上传
        </button>
        {message && <p className="text-green-600">{message}</p>}
      </form>
    </div>
  );
}
