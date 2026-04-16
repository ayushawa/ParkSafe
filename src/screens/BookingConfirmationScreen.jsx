import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import QRCodeDisplay from '../components/QRCodeDisplay';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getToken } from "../utils/auth";

const BookingConfirmationScreen = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const parking = state?.parking || { name: 'Metro Parking', price: 20 };

  const [startTime, setStartTime] = useState(state?.startTime || null);
  const [endTime, setEndTime] = useState(state?.endTime || null);

  const [name, setName] = useState("");
  const [vehicle, setVehicle] = useState("");

  const [availableSlots, setAvailableSlots] = useState(null);

  const [isBooked, setIsBooked] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [endTimeText, setEndTimeText] = useState("");

  const [loading, setLoading] = useState(false); // 🔥 IMPORTANT

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

  useEffect(() => {
    if (startTime && endTime) {
      checkAvailability(startTime, endTime);
    }
  }, []);

  const handleBook = async () => {
    if (loading) return; // 🔥 prevent multi-click

    if (!name || !vehicle || !startTime || !endTime) {
      alert("Fill all fields");
      return;
    }

    if (endTime <= startTime) {
      alert("End must be after start");
      return;
    }

    try {
      setLoading(true); // 🔥 lock

      const token = getToken();

      const res = await fetch("http://localhost:5000/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: token
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

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false); // 🔥 unlock safety
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

          <button
            className="btn-primary"
            disabled={availableSlots === 0 || loading}
            onClick={handleBook}
          >
            {loading ? "Booking..." : (availableSlots === 0 ? "Parking Full" : "Book Parking")}
          </button>

        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationScreen;