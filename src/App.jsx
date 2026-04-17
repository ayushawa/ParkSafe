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

const Layout = ({ children }) => (
  <div className="layout">
    <Sidebar />
    <div className="main-content">{children}</div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ROOT */}
        <Route
          path="/"
          element={
            isLoggedIn()
              ? <Layout><HomeScreen /></Layout>
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/list"
          element={
            isLoggedIn()
              ? <Layout><ParkingListScreen /></Layout>
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/confirm"
          element={
            isLoggedIn()
              ? <Layout><BookingConfirmationScreen /></Layout>
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/bookings"
          element={
            isLoggedIn()
              ? <Layout><MyBookingsScreen /></Layout>
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/ride"
          element={
            isLoggedIn()
              ? <Layout><RideBookingScreen /></Layout>
              : <Navigate to="/login" />
          }
        />

      </Routes>
    </Router>
  );
}

export default App;