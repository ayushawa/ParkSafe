import { MapPin, Navigation } from 'lucide-react';

const ParkingCard = ({ name, address, distance, available, total, price, onClick }) => {
  const isAvailable = available > 0;

  return (
    <div 
      onClick={onClick}
      style={{
        padding: '16px',
        borderRadius: '16px',
        cursor: isAvailable ? 'pointer' : 'not-allowed',
        transition: 'all 0.2s ease',
        backdropFilter: 'blur(12px)',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
        opacity: isAvailable ? 1 : 0.5,
        transform: 'scale(1)'
      }}
      onMouseDown={(e) => {
        if (isAvailable) e.currentTarget.style.transform = 'scale(0.97)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      
      {/* TOP ROW */}
      <div className="flex justify-between items-center">
        <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: '600' }}>
          {name}
        </h3>

        <span 
          style={{
            background: isAvailable
              ? 'rgba(34,197,94,0.15)'
              : 'rgba(239,68,68,0.15)',
            color: isAvailable ? '#22c55e' : '#ef4444',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600'
          }}
        >
          {isAvailable ? `${available}/${total}` : 'FULL'}
        </span>
      </div>
      
      {/* ADDRESS */}
      <div 
        className="flex items-center gap-2 mt-2"
        style={{ color: '#9ca3af', fontSize: '13px' }}
      >
        <MapPin size={14} />
        <span 
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {address}
        </span>
      </div>

      {/* BOTTOM ROW */}
      <div className="flex justify-between items-center mt-3">
        
        <div 
          className="flex items-center gap-2"
          style={{ color: '#3b82f6', fontWeight: '500' }}
        >
          <Navigation size={16} />
          {distance}
        </div>

        <div style={{ color: '#fff', fontWeight: '600' }}>
          ₹{price}
          <span style={{ color: '#9ca3af', fontSize: '12px' }}>/hr</span>
        </div>

      </div>

    </div>
  );
};

export default ParkingCard;