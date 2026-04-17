import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { getToken } from "../utils/auth";

const MyBookingsScreen = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = getToken();

      const res = await fetch("http://localhost:5000/bookings", {
        headers: { authorization: token }
      });

      const data = await res.json();

      if (!Array.isArray(data)) return;

      const now = new Date();

      const formatted = data.map((b) => {
        const start = new Date(b.startTime);
        const end = new Date(b.endTime);

        return {
          id: b._id,
          location: b.location,
          name: b.name,
          vehicle: b.vehicle,
          price: b.totalPrice || 0,
          date: start.toDateString(),
          time: `${start.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} - ${end.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`,
          isActive: start <= now && end >= now,
          isFuture: start > now,
          isPast: end < now
        };
      });

      setBookings(formatted);

    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = async (id) => {
    const token = getToken();

    await fetch(`http://localhost:5000/cancel/${id}`, {
      method: "DELETE",
      headers: { authorization: token }
    });

    fetchBookings();
  };

  const activeNow = bookings.find(b => b.isActive);
  const upcoming = bookings.filter(b => b.isFuture);
  const past = bookings.filter(b => b.isPast);

  return (
    <div className="page-container">
      <Header title="My Bookings" />

      <div style={{ maxWidth: "700px", margin: "20px auto", padding: "0 16px" }}>

        {/* ACTIVE */}
        {activeNow && (
          <>
            <h3 className="text-h3">Active Now</h3>

            <div className="card" style={{ marginTop: "10px" }}>
              
              {/* TOP */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: "600" }}>{activeNow.location}</div>
                <div style={{
                  background: "rgba(20,184,166,0.15)",
                  color: "var(--teal)",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  fontSize: "12px"
                }}>
                  ACTIVE
                </div>
              </div>

              {/* MIDDLE */}
              <div style={{ marginTop: "8px", color: "var(--subtext)" }}>
                {activeNow.name} | {activeNow.vehicle}
              </div>

              <div style={{ marginTop: "4px" }}>
                {activeNow.date} • {activeNow.time}
              </div>

              {/* PRICE */}
              <div style={{ marginTop: "8px", fontWeight: "600" }}>
                ₹{activeNow.price}
              </div>

              {/* BUTTON */}
              <button
                className="btn-cancel"
                onClick={() => handleCancel(activeNow.id)}
              >
                Cancel Booking
              </button>
            </div>
          </>
        )}

        {/* UPCOMING */}
        {upcoming.length > 0 && (
          <>
            <h3 className="text-h3" style={{ marginTop: "24px" }}>Upcoming</h3>

            {upcoming.map(b => (
              <div key={b.id} className="card" style={{ marginTop: "10px" }}>

                {/* TOP */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontWeight: "600" }}>{b.location}</div>
                  <div style={{
                    background: "rgba(20,184,166,0.15)",
                    color: "var(--teal)",
                    padding: "4px 10px",
                    borderRadius: "8px",
                    fontSize: "12px"
                  }}>
                    UPCOMING
                  </div>
                </div>

                {/* MIDDLE */}
                <div style={{ marginTop: "8px", color: "var(--subtext)" }}>
                  {b.name} | {b.vehicle}
                </div>

                <div style={{ marginTop: "4px" }}>
                  {b.date} • {b.time}
                </div>

                {/* PRICE */}
                <div style={{ marginTop: "8px", fontWeight: "600" }}>
                  ₹{b.price}
                </div>

                {/* BUTTON */}
                <button
                  className="btn-cancel"
                  onClick={() => handleCancel(b.id)}
                >
                  Cancel Booking
                </button>

              </div>
            ))}
          </>
        )}

        {/* PAST */}
        {past.length > 0 && (
          <>
            <h3 className="text-h3" style={{ marginTop: "24px" }}>Past</h3>

            {past.map(b => (
              <div key={b.id} className="card" style={{ marginTop: "10px", opacity: 0.8 }}>

                {/* TOP */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontWeight: "600" }}>{b.location}</div>
                  <div style={{
                    background: "#e5e7eb",
                    color: "#6b7280",
                    padding: "4px 10px",
                    borderRadius: "8px",
                    fontSize: "12px"
                  }}>
                    COMPLETED
                  </div>
                </div>

                {/* MIDDLE */}
                <div style={{ marginTop: "8px", color: "var(--subtext)" }}>
                  {b.name} | {b.vehicle}
                </div>

                <div style={{ marginTop: "4px" }}>
                  {b.date} • {b.time}
                </div>

                {/* PRICE */}
                <div style={{ marginTop: "8px", fontWeight: "600" }}>
                  ₹{b.price}
                </div>

              </div>
            ))}
          </>
        )}

      </div>
    </div>
  );
};

export default MyBookingsScreen;