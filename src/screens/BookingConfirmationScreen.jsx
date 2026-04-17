import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import QRCodeDisplay from '../components/QRCodeDisplay';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getToken } from "../utils/auth";
import { toast } from "react-toastify"; // ✅

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

  const [loading, setLoading] = useState(false);

  const calculatePrice = (startTime, endTime, pricePerHour) => {
    if (!startTime || !endTime) return null;

    const durationMs = endTime - startTime;
    if (durationMs <= 0) return null;

    const hours = durationMs / (1000 * 60 * 60);
    const rounded = Math.round(hours * 100) / 100;
    const total = Math.round(rounded * pricePerHour * 100) / 100;

    return { duration: rounded, totalPrice: total };
  };

  const pricing = calculatePrice(startTime, endTime, parking.price);

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
    if (loading) return;

    if (!name || !vehicle || !startTime || !endTime) {
      toast.error("Fill all fields"); // ✅
      return;
    }

    if (endTime <= startTime) {
      toast.error("End must be after start"); // ✅
      return;
    }

    try {
      setLoading(true);

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
        toast.success("Booking successful 🎉"); // ✅

        const shortId = data.data._id.slice(-6);
        setBookingId("PRK-" + shortId);

        const formatted = endTime.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        });

        setEndTimeText("Valid till " + formatted);
        setIsBooked(true);
      } else {
        toast.error(data.message); // ✅
      }

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
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

          {pricing && (
            <div style={{ marginTop: "10px" }}>
              <div>Total Paid: ₹{pricing.totalPrice}</div>
            </div>
          )}

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

          {pricing && (
            <div style={{ marginBottom: "10px" }}>
              <div>Duration: {pricing.duration} hours</div>
              <div>Total Price: ₹{pricing.totalPrice}</div>
            </div>
          )}

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