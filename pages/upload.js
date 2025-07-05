import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useRouter } from 'next/router';

export default function Upload() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [link, setLink] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const router = useRouter();

  const handleUpload = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    if (!userId) {
      alert('请先登录');
      return;
    }

    const { error } = await supabase.from('properties').insert([
      {
        title,
        description,
        price: Number(price),
        address,
        image,
        lat: Number(lat),
        lng: Number(lng),
        link,
        user_id: userId,
      }
    ]);

    if (error) {
      console.error('上传失败:', error);
      setErrorMsg(error.message);
      alert('上传失败，请查看控制台');
    } else {
      alert('上传成功');
      router.push('/');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">上传房源</h1>
      <input
        className="w-full border p-2 mb-2"
        placeholder="房源标题"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full border p-2 mb-2"
        placeholder="房源描述"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        className="w-full border p-2 mb-2"
        placeholder="价格（RM）"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        className="w-full border p-2 mb-2"
        placeholder="地址"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <input
        className="w-full border p-2 mb-2"
        placeholder="图片链接"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <input
        className="w-full border p-2 mb-2"
        placeholder="纬度（latitude）"
        type="number"
        value={lat}
        onChange={(e) => setLat(e.target.value)}
      />
      <input
        className="w-full border p-2 mb-2"
        placeholder="经度（longitude）"
        type="number"
        value={lng}
        onChange={(e) => setLng(e.target.value)}
      />
      <input
        className="w-full border p-2 mb-2"
        placeholder="详情链接（如视频或网页）"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />
      {errorMsg && <p className="text-red-500">{errorMsg}</p>}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2"
        onClick={handleUpload}
      >
        上传房源
      </button>
    </div>
  );
}
