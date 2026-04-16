import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import QRCodeDisplay from '../components/QRCodeDisplay';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BookingConfirmationScreen = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const parking = state?.parking || { name: 'Metro Parking', price: 20 };

  const [name, setName] = useState("");
  const [vehicle, setVehicle] = useState("");

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [availableSlots, setAvailableSlots] = useState(null);

  const [isBooked, setIsBooked] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [endTimeText, setEndTimeText] = useState("");

  const checkAvailability = async (start, end) => {
    if (!start || !end) return;

    const res = await fetch("http://localhost:5000/check-availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        location: parking.name,
        startTime: start.toISOString(),
        endTime: end.toISOString()
      })
    });

    const data = await res.json();

    if (data.success) {
      setAvailableSlots(data.availableSlots);
    }
  };

  const handleBook = async () => {
    if (!name || !vehicle || !startTime || !endTime) {
      alert("Fill all fields");
      return;
    }

    if (endTime <= startTime) {
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
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      })
    });

    const data = await res.json();

    if (data.success) {
      const shortId = data.data._id.slice(-6);
      setBookingId("PRK-" + shortId);

      const formatted = endTime.toLocaleTimeString([], {
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
          <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} />

          <div className="input-label">Vehicle</div>
          <input className="input-field" value={vehicle} onChange={(e) => setVehicle(e.target.value)} />

          <div className="input-label">Start Time</div>
          <DatePicker
            selected={startTime}
            onChange={(date) => {
              setStartTime(date);
              checkAvailability(date, endTime);
            }}
            showTimeSelect
            minDate={new Date()}
            dateFormat="Pp"
            placeholderText="Select start time"
            className="datepicker-input"
          />

          <div className="input-label">End Time</div>
          <DatePicker
            selected={endTime}
            onChange={(date) => {
              setEndTime(date);
              checkAvailability(startTime, date);
            }}
            showTimeSelect
            minDate={new Date()}
            dateFormat="Pp"
            placeholderText="Select end time"
            className="datepicker-input"
          />

          {availableSlots !== null && (
            <div style={{ marginTop: "10px", fontWeight: "bold" }}>
              Available Slots: {availableSlots}
            </div>
          )}

          {availableSlots === 0 && (
            <div style={{ color: "red", marginTop: "8px" }}>
              No slots available
            </div>
          )}

          <button
            className="btn-primary"
            disabled={availableSlots === 0}
            onClick={handleBook}
          >
            {availableSlots === 0 ? "Parking Full" : "Book Parking"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationScreen;