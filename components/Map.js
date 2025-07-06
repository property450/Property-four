import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { supabase } from '../supabaseClient';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function FlyTo({ lat, lng }) {
  const map = useMap();
  map.flyTo([lat, lng], 13);
  return null;
}

export default function Map() {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState('');
  const [range, setRange] = useState(10);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [center, setCenter] = useState({ lat: 3.12, lng: 101.62 });
  const [lang, setLang] = useState('en');

  const t = {
    en: {
      searchPlaceholder: 'Enter location (e.g. Kuala Lumpur)',
      locate: 'Locate',
      distance: 'Distance (km)',
      price: 'Price',
      more: 'View more',
      langSwitch: 'Switch to 中文'
    },
    zh: {
      searchPlaceholder: '请输入地点（如 吉隆坡）',
      locate: '定位',
      distance: '距离 (公里)',
      price: '价格',
      more: '查看更多',
      langSwitch: '切换 English'
    }
  };

  useEffect(() => {
    async function fetchProperties() {
      const { data, error } = await supabase.from('properties').select('*');
      console.log('✅ fetched properties:', data);
      console.log('✅ filtered by lat/lng:', data.filter(h => h.lat && h.lng));
      if (!error && data) {
        const valid = data.filter(h => h.lat && h.lng);
        setProperties(valid);
      }
    }
    fetchProperties();
  }, []);

  // 暂时关闭筛选，确保能看到全部 marker
  const filtered = properties;

  const handleLocationSearch = async () => {
    if (!search) return;
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${search}`);
    const data = await res.json();
    if (data[0]) {
      setCenter({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
    } else {
      alert(lang === 'zh' ? '找不到这个地点' : 'Location not found');
    }
  };

  return (
    <div>
      {/* 切换语言 */}
      <div style={{ textAlign: 'right', padding: '10px 20px' }}>
        <button onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}>
          🌐 {t[lang].langSwitch}
        </button>
      </div>

      {/* 搜索栏 & 筛选条件 */}
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <input
          type="text"
          placeholder={`🔍 ${t[lang].searchPlaceholder}`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '10px', width: '60%', fontSize: '16px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '10px' }}
        />
        <button onClick={handleLocationSearch} style={{ padding: '10px 15px', marginLeft: '10px' }}>
          {t[lang].locate}
        </button>
        <div style={{ marginTop: '10px' }}>
          📍 {t[lang].distance}:
          <input type="number" value={range} onChange={(e) => setRange(Number(e.target.value))} style={{ width: '60px', margin: '0 10px' }} />
          💰 {t[lang].price}:
          RM <input type="number" value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} style={{ width: '80px', margin: '0 5px' }} />
          - RM <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} style={{ width: '80px', margin: '0 5px' }} />
        </div>
      </div>

      {/* 地图 */}
      <MapContainer center={[center.lat, center.lng]} zoom={12} scrollWheelZoom={true} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FlyTo lat={center.lat} lng={center.lng} />
        {filtered.map((house) => (
          <Marker key={house.id} position={[house.lat, house.lng]}>
            <Popup maxWidth={300}>
              <div style={{ textAlign: 'center' }}>
                <img src={house.image} alt={house.title} style={{ width: '100%', borderRadius: '6px', marginBottom: '5px' }} />
                <strong>{house.title}</strong><br />
                RM{house.price?.toLocaleString()}<br />
                <a href={house.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '5px', color: 'blue' }}>
                  🔗 {t[lang].more}
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
