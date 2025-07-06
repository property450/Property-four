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

function getDistance(lat1, lng1, lat2, lng2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function FlyTo({ lat, lng }) {
  const map = useMap();
  map.flyTo([lat, lng], 13);
  return null;
}

export default function Map() {
  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [userId, setUserId] = useState(null);
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
      favorite: 'Favorite',
      unfavorite: 'Unfavorite',
      langSwitch: 'Switch to 中文'
    },
    zh: {
      searchPlaceholder: '请输入地点（如 吉隆坡）',
      locate: '定位',
      distance: '距离 (公里)',
      price: '价格',
      more: '查看更多',
      favorite: '收藏',
      unfavorite: '取消收藏',
      langSwitch: '切换 English'
    }
  };

  useEffect(() => {
    async function fetchData() {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData?.user?.id;
      setUserId(uid);

      const { data, error } = await supabase.from('properties').select('*');
      if (!error && data) {
        const valid = data.filter(h => h.lat && h.lng);
        setProperties(valid);
      }

      if (uid) {
        const { data: favData } = await supabase
          .from('favorites')
          .select('property_id')
          .eq('user_id', uid);
        setFavorites(favData?.map(f => f.property_id) || []);
      }
    }
    fetchData();
  }, []);

  const filtered = properties.filter((house) => {
    const distance = getDistance(center.lat, center.lng, house.lat, house.lng);
    return (
      (house.title?.toLowerCase().includes(search.toLowerCase()) || '') &&
      distance <= range &&
      house.price >= minPrice &&
      house.price <= maxPrice
    );
  });

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

  const toggleFavorite = async (propertyId) => {
    if (!userId) {
      alert('请先登录');
      return;
    }

    const isFavorited = favorites.includes(propertyId);

    if (isFavorited) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('property_id', propertyId);
      setFavorites((prev) => prev.filter((id) => id !== propertyId));
    } else {
      await supabase.from('favorites').insert([{ user_id: userId, property_id: propertyId }]);
      setFavorites((prev) => [...prev, propertyId]);
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
                <br />
                <button
                  onClick={() => toggleFavorite(house.id)}
                  style={{ marginTop: '8px', padding: '6px 12px', backgroundColor: favorites.includes(house.id) ? 'red' : 'green', color: '#fff', borderRadius: '5px' }}
                >
                  {favorites.includes(house.id) ? t[lang].unfavorite : t[lang].favorite}
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
