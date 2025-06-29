import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useRouter } from 'next/router';

export default function Upload() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
  });
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('properties').insert([form]);
    if (error) {
      setError(error.message);
    } else {
      alert('房源上传成功！');
      router.push('/');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">上传房源</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="标题"
          className="w-full border px-3 py-2 rounded"
          value={form.title}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="描述"
          className="w-full border px-3 py-2 rounded"
          value={form.description}
          onChange={handleChange}
        />
        <input
          name="price"
          placeholder="价格 (RM)"
          type="number"
          className="w-full border px-3 py-2 rounded"
          value={form.price}
          onChange={handleChange}
        />
        <input
          name="image"
          placeholder="图片链接"
          className="w-full border px-3 py-2 rounded"
          value={form.image}
          onChange={handleChange}
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          上传
        </button>
      </form>
    </div>
  );
}
