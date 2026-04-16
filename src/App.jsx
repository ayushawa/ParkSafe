import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import HomeScreen from './screens/HomeScreen';
import ParkingListScreen from './screens/ParkingListScreen';
import BookingConfirmationScreen from './screens/BookingConfirmationScreen';
import MyBookingsScreen from './screens/MyBookingsScreen';
import RideBookingScreen from './screens/RideBookingScreen';
import BottomNav from './components/BottomNav';
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// ✅ SIMPLE CHECK (no state, no bugs)
const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

function App() {
  return (
    <Router>
      <Routes>

        {/* LOGIN */}
        <Route 
          path="/login" 
          element={isLoggedIn() ? <Navigate to="/" /> : <Login />} 
        />

        {/* SIGNUP */}
        <Route 
          path="/signup" 
          element={isLoggedIn() ? <Navigate to="/" /> : <Signup />} 
        />

        {/* HOME */}
        <Route 
          path="/" 
          element={isLoggedIn() ? <HomeScreen /> : <Navigate to="/login" />} 
        />

        {/* OTHER ROUTES */}
        <Route path="/list" element={isLoggedIn() ? <ParkingListScreen /> : <Navigate to="/login" />} />
        <Route path="/confirm" element={isLoggedIn() ? <BookingConfirmationScreen /> : <Navigate to="/login" />} />
        <Route path="/bookings" element={isLoggedIn() ? <MyBookingsScreen /> : <Navigate to="/login" />} />
        <Route path="/ride" element={isLoggedIn() ? <RideBookingScreen /> : <Navigate to="/login" />} />

      </Routes>

      {/* NAVBAR */}
      {isLoggedIn() && <BottomNav />}

    </Router>
  );
}

export default App;