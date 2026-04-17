import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import HomeScreen from './screens/HomeScreen';
import ParkingListScreen from './screens/ParkingListScreen';
import BookingConfirmationScreen from './screens/BookingConfirmationScreen';
import MyBookingsScreen from './screens/MyBookingsScreen';
import RideBookingScreen from './screens/RideBookingScreen';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Sidebar from "./components/Sidebar";

const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

function App() {
  return (
    <Router>

      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/login" element={!isLoggedIn() ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!isLoggedIn() ? <Signup /> : <Navigate to="/" />} />

        {/* PROTECTED ROUTES WITH SIDEBAR */}
        <Route
          path="/*"
          element={
            isLoggedIn() ? (
              <div className="layout">
                <Sidebar />
                <div className="main-content">
                  <Routes>
                    <Route path="/" element={<HomeScreen />} />
                    <Route path="/list" element={<ParkingListScreen />} />
                    <Route path="/confirm" element={<BookingConfirmationScreen />} />
                    <Route path="/bookings" element={<MyBookingsScreen />} />
                    <Route path="/ride" element={<RideBookingScreen />} />
                  </Routes>
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

      </Routes>

    </Router>
  );
}

export default App;