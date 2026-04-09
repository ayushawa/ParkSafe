import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import QRCodeDisplay from '../components/QRCodeDisplay';
import { CheckCircle } from 'lucide-react';

const BookingConfirmationScreen = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const parking = state?.parking || { name: 'Metro Parking', price: 20 };
  
  const [hours, setHours] = useState(2);
  const [isBooked, setIsBooked] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [endTimeText, setEndTimeText] = useState("");

  const handleBook = async () => {
    try {
      const now = new Date();
      const startTime = now.toISOString();

      const end = new Date(now);
      end.setHours(end.getHours() + hours);
      const endTime = end.toISOString();

      const res = await fetch("http://localhost:5000/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          location: parking.name,
          startTime,
          endTime
        })
      });

      const data = await res.json();

      if (data.success) {
        const shortId = data.data._id.slice(-6);
        setBookingId("PRK-" + shortId);

        const endDate = new Date(endTime);
        const formattedTime = endDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        });

        setEndTimeText("Valid till " + formattedTime);
        setIsBooked(true);
      } else {
        alert(data.message);
      }

    } catch (err) {
      alert("Server error");
    }
  };

  if (isBooked) {
    return (
      <div className="page-container" style={{ paddingBottom: '0' }}>
        <Header title="Ticket" rightAction={
          <span onClick={() => navigate('/')} style={{color: '#3b82f6', cursor: 'pointer', fontWeight: 600}}>
            Done
          </span>
        } />

        <div className="flex-col items-center justify-center p-4 h-full gap-4 mt-8">
          
          <div className="flex items-center gap-2" style={{ color: '#22c55e' }}>
            <CheckCircle size={32} />
            <span className="text-h2">Booking Confirmed</span>
          </div>
          
          <div className="text-center text-body mb-4">
            Show this QR code at the entry gate of<br/>
            <strong>{parking.name}</strong>
          </div>

          <QRCodeDisplay 
            id={bookingId}
            validUntil={endTimeText}
            isActive={true} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header title="Book Slot" showBack={true} />
      
      <div className="p-4 flex-col gap-6">
        
        <h2 className="text-h2">{parking.name}</h2>
        <div style={{ color: '#9ca3af' }}>Select duration</div>
        
        {/* HOURS SELECTOR */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          marginTop: '10px'
        }}>
          
          <button 
            onClick={() => setHours(Math.max(1, hours - 1))}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              fontSize: '22px',
              cursor: 'pointer'
            }}
          >-</button>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '40px', color: '#fff', fontWeight: '700' }}>
              {hours}
            </div>
            <div style={{ color: '#9ca3af' }}>Hours</div>
          </div>

          <button 
            onClick={() => setHours(hours + 1)}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              fontSize: '22px',
              cursor: 'pointer'
            }}
          >+</button>
        </div>

        {/* PRICE CARD */}
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          borderRadius: '16px',
          padding: '16px',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="flex justify-between mb-3">
            <span style={{ color: '#9ca3af' }}>Price per hour</span>
            <span style={{ color: '#fff' }}>₹{parking.price}</span>
          </div>

          <div className="flex justify-between">
            <span style={{ color: '#9ca3af' }}>Total</span>
            <span style={{ color: '#3b82f6', fontSize: '20px', fontWeight: '700' }}>
              ₹{parking.price * hours}
            </span>
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={handleBook}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
              color: '#fff',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: '0 10px 30px rgba(59,130,246,0.5)',
              cursor: 'pointer'
            }}
          >
            Pay ₹{parking.price * hours} & Book
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookingConfirmationScreen;