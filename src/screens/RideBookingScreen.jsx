import { useState } from 'react';
import Header from '../components/Header';
import RideOption from '../components/RideOption';
import Button from '../components/Button';
import { CarFront, Zap, Navigation } from 'lucide-react';

const rides = [
  { id: 'cab', title: 'Mini Cab', time: '3 min', price: 150, icon: CarFront },
  { id: 'erickshaw', title: 'E-Rickshaw (Shared)', time: '1 min', price: 20, icon: Zap },
  { id: 'erickshaw-private', title: 'E-Rickshaw (Private)', time: '2 min', price: 50, icon: Zap },
];

const RideBookingScreen = () => {
  const [selectedRide, setSelectedRide] = useState('erickshaw');
  const [isBooked, setIsBooked] = useState(false);

  const handleBook = () => {
    setIsBooked(true);
  };

  if (isBooked) {
    return (
      <div className="page-container flex-col items-center justify-center p-4">
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          boxShadow: '0 8px 32px rgba(0, 122, 255, 0.4)'
        }}>
          <CarFront size={40} color="#fff" />
        </div>
        <h1 className="text-h1 mb-2 text-center">Finding your ride...</h1>
        <p className="text-body text-color-secondary text-center">Driver usually arrives in 2 mins.</p>
        
        <div className="mt-8 w-full">
          <Button variant="danger" fullWidth onClick={() => setIsBooked(false)}>Cancel Search</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header title="Last Mile Ride" />
      
      {/* Map Segment */}
      <div 
        style={{ 
          height: '250px', 
          width: '100%', 
          backgroundColor: '#e5e5ea',
          position: 'relative'
        }}
        className="map-bg"
      >
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'var(--surface-color)',
          padding: '8px 16px',
          borderRadius: '20px',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: '600'
        }}>
          <Navigation size={16} color="var(--accent-color)" />
          Sector 21 Parking
        </div>
      </div>

      <div className="p-4 flex-col flex-1" style={{ backgroundColor: 'var(--bg-color)', zIndex: 1, marginTop: '-20px', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
        <h3 className="text-h3 mb-4 mt-2">Available Rides</h3>
        
        {rides.map(ride => (
          <RideOption 
            key={ride.id}
            {...ride}
            selected={selectedRide === ride.id}
            onClick={() => setSelectedRide(ride.id)}
          />
        ))}

        <div className="mt-auto pt-4 pb-4">
          <Button fullWidth onClick={handleBook}>
            Book {rides.find(r => r.id === selectedRide)?.title}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RideBookingScreen;
