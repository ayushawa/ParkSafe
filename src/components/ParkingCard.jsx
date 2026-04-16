import { MapPin, Navigation } from 'lucide-react';

const ParkingCard = ({
  name,
  address,
  distance,
  available,
  total,
  price,
  isFull,
  onClick
}) => {

  return (
    <div
      onClick={onClick}
      style={{
        padding: '16px',
        borderRadius: '16px',
        cursor: isFull ? 'not-allowed' : 'pointer',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.08)',
        opacity: isFull ? 0.5 : 1
      }}
    >

      <div className="flex justify-between items-center">
        <h3 style={{ color: '#fff' }}>{name}</h3>

        <span style={{
          color: isFull ? '#ef4444' : '#22c55e'
        }}>
          {isFull ? "FULL" : `${available}/${total}`}
        </span>
      </div>

      <div style={{ color: '#9ca3af', fontSize: '13px', marginTop: '4px' }}>
        <MapPin size={14} /> {address}
      </div>

      <div className="flex justify-between items-center mt-3">
        <div style={{ color: '#3b82f6' }}>
          <Navigation size={16} /> {distance}
        </div>

        <div style={{ color: '#fff' }}>
          ₹{price}/hr
        </div>
      </div>

    </div>
  );
};

export default ParkingCard;