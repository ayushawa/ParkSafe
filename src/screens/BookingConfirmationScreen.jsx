import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import QRCodeDisplay from '../components/QRCodeDisplay';

const BookingConfirmationScreen = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const parking = state?.parking || { name: 'Metro Parking', price: 20 };

  const [name, setName] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [isBooked, setIsBooked] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [endTimeText, setEndTimeText] = useState("");

  const handleBook = async () => {
    if (!name || !vehicle || !startTime || !endTime) {
      alert("Fill all fields");
      return;
    }

    if (new Date(endTime) <= new Date(startTime)) {
      alert("End must be after start");
      return;
    }

    const res = await fetch("http://localhost:5000/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        location: parking.name,
        name,
        vehicle,
        startTime,
        endTime
      })
    });

    const data = await res.json();

    if (data.success) {
      const shortId = data.data._id.slice(-6);
      setBookingId("PRK-" + shortId);

      const formatted = new Date(endTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });

      setEndTimeText("Valid till " + formatted);
      setIsBooked(true);
    } else {
      alert(data.message);
    }
  };

  if (isBooked) {
    return (
      <div className="page-container">
        <Header title="Ticket" />

        <div style={{ padding: "20px", textAlign: "center" }}>
          <h2>Booking Confirmed</h2>

          <QRCodeDisplay
            id={bookingId}
            validUntil={endTimeText}
            isActive={true}
          />

          <button className="btn-primary" onClick={() => navigate('/')}>
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header title="Book Slot" showBack />

      <div style={{ padding: "16px" }}>
        <h2>{parking.name}</h2>

        <div className="form-card">

          <div className="input-label">Name</div>
          <input
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="input-label">Vehicle</div>
          <input
            className="input-field"
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
          />

          <div className="input-label">Start Time</div>
          <input
            type="datetime-local"
            className="input-field"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />

          <div className="input-label">End Time</div>
          <input
            type="datetime-local"
            className="input-field"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />

          <button className="btn-primary" onClick={handleBook}>
            Book Parking
          </button>

        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationScreen;