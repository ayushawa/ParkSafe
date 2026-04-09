import { useEffect, useState } from 'react';
import Header from '../components/Header';
import QRCodeDisplay from '../components/QRCodeDisplay';
import { WifiOff, Calendar } from 'lucide-react';

const MyBookingsScreen = () => {
  const [bookings, setBookings] = useState([]);


  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch("http://localhost:5000/bookings");
      const data = await res.json();

    
      const formatted = data.map((b) => {
        // handle old data (time only)
        if (!b.startTime || !b.endTime) {
          return {
            id: b._id.slice(-6),
            location: b.location,
            date: "Old Booking",
            time: b.time || "N/A",
            isActive: false
          };
        }

        // handle new data
        const start = new Date(b.startTime);
        const end = new Date(b.endTime);

        return {
          id: b._id.slice(-6),
          location: b.location,
          date: start.toDateString(),
          time: `${start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
          isActive: end > new Date()
        };
      });

      setBookings(formatted);

    } catch (err) {
      console.log(err);
      alert("Error fetching bookings");
    }
  };

  const activeBooking = bookings.find(b => b.isActive);
  const pastBookings = bookings.filter(b => !b.isActive);

  return (
    <div className="page-container">
      <Header title="My Bookings" />
      
      <div className="p-4 flex-col gap-6">
        <div className="flex items-center gap-2 text-caption">
          <WifiOff size={16} />
          <span>Available offline</span>
        </div>

        {activeBooking && (
          <div>
            <h3 className="text-h3 mb-4 text-color-secondary">Active Now</h3>
            <div 
              style={{
                backgroundColor: 'var(--surface-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px 16px',
                border: '1px solid var(--border-color)',
              }}
            >
              <h2 className="text-h2 text-center mb-2">{activeBooking.location}</h2>
              <div className="flex justify-center items-center gap-2 mb-6 text-color-secondary text-body">
                <Calendar size={16} />
                <span>{activeBooking.date}, {activeBooking.time}</span>
              </div>
              
              <QRCodeDisplay 
                id={activeBooking.id} 
                validUntil={activeBooking.time.split(' - ')[1] || "N/A"} 
                isActive={true} 
              />
            </div>
          </div>
        )}

        {pastBookings.length > 0 && (
          <div className="mt-4">
            <h3 className="text-h3 mb-4 text-color-secondary">Past Bookings</h3>
            {pastBookings.map((booking) => (
              <div 
                key={booking.id}
                className="flex justify-between items-center p-4 mb-3"
                style={{
                  backgroundColor: 'var(--surface-color)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div>
                  <div className="text-body-strong">{booking.location}</div>
                  <div className="text-caption mt-1">
                    {booking.date} • {booking.time}
                  </div>
                </div>
                <div className="text-color-secondary text-body">
                  {booking.id}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsScreen;