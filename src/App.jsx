import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomeScreen from './screens/HomeScreen';
import ParkingListScreen from './screens/ParkingListScreen';
import BookingConfirmationScreen from './screens/BookingConfirmationScreen';
import MyBookingsScreen from './screens/MyBookingsScreen';
import RideBookingScreen from './screens/RideBookingScreen';
import BottomNav from './components/BottomNav';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/list" element={<ParkingListScreen />} />
        <Route path="/confirm" element={<BookingConfirmationScreen />} />
        <Route path="/bookings" element={<MyBookingsScreen />} />
        <Route path="/ride" element={<RideBookingScreen />} />
      </Routes>

      <BottomNav />
    </Router>
  );
}

export default App;