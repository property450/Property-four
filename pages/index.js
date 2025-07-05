import dynamic from 'next/dynamic';
import Link from 'next/link';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

export default function Home() {
  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: '20px 0' }}>📍 房产地图搜索平台</h1>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Link href="/upload">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2">
            上传房源
          </button>
        </Link>
        <Link href="/Login">
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2">
            登录
          </button>
        </Link>
        <Link href="/Register">
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            注册
          </button>
        </Link>
      </div>

      <Map />
    </div>
  );
}
