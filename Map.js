import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 默认图标修复
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const houseList = [
  {
    id: 1,
    name: 'Eco Park',
    lat: 3.100,
    lng: 101.600,
    price: 'RM320,000'
  },
  {
    id: 2,
    name: 'Bukit Indah',
    lat: 3.150,
    lng: 101.650,
    price: 'RM500,000'
  },
  {
    id: 3,
    name: 'Taman Desa',
    lat: 3.120,
    lng: 101.620,
    price: 'RM750,000'
  }
];

export default function Map() {
  return (
    <MapContainer
      center={[3.12, 101.62]}
      zoom={12}
      scrollWheelZoom={true}
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {houseList.map((house) => (
        <Marker key={house.id} position={[house.lat, house.lng]}>
          <Popup>
            <strong>{house.name}</strong><br />
            {house.price}
          </Popup>
        </Marker>import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 默认图标修复
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const houseList = [
  {
    id: 1,
    name: 'Eco Park',
    lat: 3.100,
    lng: 101.600,
    price: 'RM320,000'
  },
  {
    id: 2,
    name: 'Bukit Indah',
    lat: 3.150,
    lng: 101.650,
    price: 'RM500,000'
  },
  {
    id: 3,
    name: 'Taman Desa',
    lat: 3.120,
    lng: 101.620,
    price: 'RM750,000'
  }
];

export default function Map() {
  return (
    <MapContainer
      center={[3.12, 101.62]}
      zoom={12}
      scrollWheelZoom={true}
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {houseList.map((house) => (
        <Marker key={house.id} position={[house.lat, house.lng]}>
          <Popup>
            <strong>{house.name}</strong><br />
            {house.price}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}


      ))}
    </MapContainer>
  );
}
