import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import ParkingCard from '../components/ParkingCard';

const ParkingListScreen = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const searchText = state?.search?.toLowerCase() || "";

  const [parkings, setParkings] = useState([]);

  useEffect(() => {
    fetchParking();
  }, []);

  const fetchParking = async () => {
    try {
      const res = await fetch("http://localhost:5000/parking");
      const data = await res.json();

      const filtered = data
        .filter(p => p.name.toLowerCase().includes(searchText))
        .map((p, index) => ({
          id: index + 1,
          name: p.name,
          address: "Near Metro Station",
          distance: "Nearby",
          available: p.availableSlots,
          total: p.totalSlots,
          price: p.price
        }));

      setParkings(filtered);

    } catch (err) {
      console.log(err);
      alert("Error fetching parking");
    }
  };

  return (
    <div className="page-container">
      <Header title="Nearby Parking" showBack={true} />
      
      <div className="p-4 flex-col gap-4">
        <h3 className="text-body-strong mb-2 text-color-secondary">
          Found {parkings.length} locations
        </h3>

        {parkings.length === 0 && (
          <div style={{ color: '#888' }}>
            No parking found
          </div>
        )}

        {parkings.map((parking) => {
          const isFull = parking.available === 0;

          return (
            <div 
              key={parking.id} 
              className="mb-4"
              onClick={() => {
                if (!isFull) {
                  navigate('/confirm', { state: { parking } });
                }
              }}
              style={{
                opacity: isFull ? 0.5 : 1,
                cursor: isFull ? 'not-allowed' : 'pointer',
                position: 'relative'
              }}
            >
              <ParkingCard {...parking} />

              {isFull && (
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'red',
                    color: '#fff',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                >
                  FULL
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ParkingListScreen;