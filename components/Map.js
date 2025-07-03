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
  const center = { lat: 3.12, lng: 101.62 };

  useEffect(() => {
    async function fetchProperties() {
      const { data, error } = await supabase.from('properties').select('*');
      console.log('✅ fetched properties:', data);
      console.log('❌ error:', error);
      if (data) {
        setProperties(data);
      }
    }
    fetchProperties();
  }, []);

  return (
    <MapContainer center={[center.lat, center.lng]} zoom={12} scrollWheelZoom={true} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyTo lat={center.lat} lng={center.lng} />
{properties.map((house) => {
  if (typeof house.lat !== 'number' || typeof house.lng !== 'number') return null;
  return (
    <Marker key={house.id} position={[house.lat, house.lng]}>
      <Popup maxWidth={300}>
        <div style={{ textAlign: 'center' }}>
          <img src={house.image} alt={house.title} style={{ width: '100%', borderRadius: '6px', marginBottom: '5px' }} />
          <strong>{house.title}</strong><br />
          RM{house.price?.toLocaleString()}<br />
          <a href={house.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '5px', color: 'blue' }}>
            🔗 查看详情
          </a>
        </div>
      </Popup>
    </Marker>
  );
})}
