import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import QRCodeDisplay from '../components/QRCodeDisplay';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BookingConfirmationScreen = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const parking = state?.parking || { name: 'Metro Parking', price: 20 };

  // 🔥 USE PASSED TIME FROM LIST SCREEN
  const [startTime, setStartTime] = useState(state?.startTime || null);
  const [endTime, setEndTime] = useState(state?.endTime || null);

  const [name, setName] = useState("");
  const [vehicle, setVehicle] = useState("");

  const [availableSlots, setAvailableSlots] = useState(null);

  const [isBooked, setIsBooked] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [endTimeText, setEndTimeText] = useState("");

  // 🔥 CHECK AVAILABILITY (using /parking route)
  const checkAvailability = async (start, end) => {
    if (!start || !end || start >= end) return;

    try {
      const url = `http://localhost:5000/parking?startTime=${start.toISOString()}&endTime=${end.toISOString()}`;

      const res = await fetch(url);
      const data = await res.json();

      const currentParking = data.find(p => p.name === parking.name);

      if (currentParking) {
        setAvailableSlots(currentParking.availableSlots);
      }

    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 AUTO CHECK ON LOAD (IMPORTANT)
  useEffect(() => {
    if (startTime && endTime) {
      checkAvailability(startTime, endTime);
    }
  }, []);

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

  // ---------------- BOOKED SCREEN ----------------
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

  // ---------------- FORM SCREEN ----------------
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

          {/* 🔥 SHOW SELECTED TIME */}
          {startTime && endTime && (
            <div style={{ marginBottom: "10px", color: "#aaa" }}>
              Selected: {startTime.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
              {" → "}
              {endTime.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
            </div>
          )}

          {/* OPTIONAL: USER CAN STILL EDIT TIME */}
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
            className="datepicker-input"
          />

          {/* AVAILABLE */}
          {availableSlots !== null && (
            <div style={{ marginTop: "10px", fontWeight: "bold" }}>
              Available Slots: {availableSlots}
            </div>
          )}

          {/* FULL */}
          {availableSlots === 0 && (
            <div style={{ color: "red", marginTop: "8px" }}>
              No slots available
            </div>
          )}

          {/* BUTTON */}
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