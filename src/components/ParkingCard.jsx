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
      className="parking-card"
      style={{
        opacity: isFull ? 0.6 : 1,
        cursor: isFull ? "not-allowed" : "pointer"
      }}
    >

      {/* TOP */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 className="parking-title">{name}</h3>

        <span
          style={{
            background: isFull
              ? "rgba(239,68,68,0.1)"
              : "rgba(20,184,166,0.1)",
            color: isFull ? "#ef4444" : "var(--teal)",
            padding: "4px 10px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: "600"
          }}
        >
          {isFull ? "FULL" : `${available}/${total}`}
        </span>
      </div>

      {/* ADDRESS */}
      <div className="parking-sub">
        <MapPin size={14} style={{ marginRight: "6px" }} />
        {address}
      </div>

      {/* BOTTOM */}
      <div className="parking-meta">

        <div style={{ display: "flex", alignItems: "center", color: "var(--subtext)" }}>
          <Navigation size={14} style={{ marginRight: "6px" }} />
          {distance}
        </div>

        <div className="parking-price">
          ₹{price}/hr
        </div>

      </div>

    </div>
  );
};

export default ParkingCard;