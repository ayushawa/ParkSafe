import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import ParkingCard from '../components/ParkingCard';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ParkingListScreen = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const searchText = state?.search?.toLowerCase() || "";

  const [parkings, setParkings] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const fetchParking = async (start, end) => {
    try {
      let url = "http://localhost:5000/parking";

      if (start && end) {
        url += `?startTime=${start.toISOString()}&endTime=${end.toISOString()}`;
      }

      const res = await fetch(url);
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
    }
  };

  useEffect(() => {
    fetchParking();
  }, []);

  return (
    <div className="page-container">
      <Header title="Nearby Parking" showBack={true} />

      <div className="p-4 flex-col gap-4">

        <h3 className="text-h3">Select Time</h3>

        <DatePicker
          selected={startTime}
          onChange={(date) => {
            setStartTime(date);
            if (endTime && date < endTime) {
              fetchParking(date, endTime);
            }
          }}
          showTimeSelect
          minDate={new Date()}
          dateFormat="Pp"
          placeholderText="Start time"
          className="datepicker-input"
        />

        <DatePicker
          selected={endTime}
          onChange={(date) => {
            setEndTime(date);
            if (startTime && startTime < date) {
              fetchParking(startTime, date);
            }
          }}
          showTimeSelect
          minDate={new Date()}
          dateFormat="Pp"
          placeholderText="End time"
          className="datepicker-input"
        />

        {/* 🔥 SHOW SELECTED TIME */}
        {startTime && endTime && (
          <div style={{ marginTop: "10px", color: "#aaa" }}>
            Selected: {startTime.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
            {" → "}
            {endTime.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
          </div>
        )}

        <h3 className="text-body-strong">
          Found {parkings.length} locations
        </h3>

        {parkings.map((parking) => {
          const isFull = parking.available === 0;

          return (
            <div key={parking.id} className="mb-4">
              <ParkingCard
                {...parking}
                isFull={isFull}
                onClick={() => {
                  if (!isFull) {
                    navigate('/confirm', {
                      state: {
                        parking,
                        startTime,
                        endTime
                      }
                    });
                  }
                }}
              />
            </div>
          );
        })}

      </div>
    </div>
  );
};

export default ParkingListScreen;