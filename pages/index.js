import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

export default function Home() {
  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: '20px 0' }}>📍 房产地图搜索平台</h1>
      <Map />
    </div>
  );
}
