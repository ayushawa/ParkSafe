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
        headers: {
          authorization: token
        }
      });

      const data = await res.json();

      if (!Array.isArray(data)) {
        console.log("Error:", data);
        return;
      }

      const now = new Date();

      const formatted = data.map((b) => {
        const start = new Date(b.startTime);
        const end = new Date(b.endTime);

        return {
          id: b._id,
          location: b.location,
          name: b.name,
          vehicle: b.vehicle,
          price: b.totalPrice || 0, // ✅ PRICE ADDED
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
      headers: {
        authorization: token
      }
    });

    fetchBookings();
  };

  const activeNow = bookings.find(b => b.isActive);
  const upcoming = bookings.filter(b => b.isFuture);
  const past = bookings.filter(b => b.isPast);

  return (
    <div className="page-container">
      <Header title="My Bookings" />

      <div style={{ padding: "16px" }}>

        {activeNow && (
          <>
            <h3>Active Now</h3>
            <div className="booking-card">
              <div>{activeNow.location}</div>
              <div>{activeNow.name} | {activeNow.vehicle}</div>
              <div>{activeNow.date} • {activeNow.time}</div>
              <div>₹{activeNow.price}</div> {/* ✅ PRICE */}
              <button className="btn-cancel" onClick={() => handleCancel(activeNow.id)}>
                Cancel
              </button>
            </div>
          </>
        )}

        {upcoming.length > 0 && (
          <>
            <h3>Upcoming</h3>
            {upcoming.map(b => (
              <div key={b.id} className="booking-card">
                <div>{b.location}</div>
                <div>{b.name} | {b.vehicle}</div>
                <div>{b.date} • {b.time}</div>
                <div>₹{b.price}</div> {/* ✅ PRICE */}
                <button className="btn-cancel" onClick={() => handleCancel(b.id)}>
                  Cancel
                </button>
              </div>
            ))}
          </>
        )}

        {past.length > 0 && (
          <>
            <h3>Past</h3>
            {past.map(b => (
              <div key={b.id} className="booking-card">
                <div>{b.location}</div>
                <div>{b.name} | {b.vehicle}</div>
                <div>{b.date} • {b.time}</div>
                <div>₹{b.price}</div> {/* ✅ PRICE */}
              </div>
            ))}
          </>
        )}

      </div>
    </div>
  );
};

export default MyBookingsScreen;