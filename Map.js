import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { createClient } from '@supabase/supabase-js';

// 设置地图图标
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Supabase 配置
const supabase = createClient(
  'https://rkvhsodjddywomrjwywd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrdmhzb2RqZGR5d29tcmp3eXdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NDM2ODIsImV4cCI6MjA2NjQxOTY4Mn0.3I6C8aE8wJqBV-_mKbaQzw1G-MPzkergOv-0KxSkT44'
);

// 地图自动飞行组件
function FlyToFirstMarker({ properties }) {
  const map = useMap();

  useEffect(() => {
    if (properties.length > 0) {
      const { lat, lng } = properties[0];
      map.flyTo([lat, lng], 14);
    }
  }, [properties, map]);

  return null;
}

export default function Map() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    async function fetchProperties() {
      const { data, error } = await supabase.from('properties').select('*');
      if (data) setProperties(data.filter(h => h.lat && h.lng));
    }
    fetchProperties();
  }, []);

  return (
    <MapContainer
      center={[3.12, 101.62]} // 初始中心
      zoom={12}
      scrollWheelZoom={true}
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToFirstMarker properties={properties} />
      {properties.map((house) => (
        <Marker key={house.id} position={[house.lat, house.lng]}>
          <Popup>
            <div>
              <strong>{house.title}</strong><br />
              RM{house.price}<br />
              <a href={house.link} target="_blank" rel="noopener noreferrer">🔗 查看详情</a><br />
              <img src={house.image} alt={house.title} style={{ width: '100%', marginTop: '5px' }} />
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
