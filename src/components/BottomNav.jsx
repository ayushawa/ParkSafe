import { Link, useLocation } from 'react-router-dom';
import { Map, BookMarked, Compass } from 'lucide-react';
import './BottomNav.css';

const BottomNav = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bottom-nav">
      <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
        <Map size={24} />
        <span>Explore</span>
      </Link>
      <Link to="/ride" className={`nav-item ${isActive('/ride') ? 'active' : ''}`}>
        <Compass size={24} />
        <span>Ride</span>
      </Link>
      <Link to="/bookings" className={`nav-item ${isActive('/bookings') ? 'active' : ''}`}>
        <BookMarked size={24} />
        <span>Bookings</span>
      </Link>
    </div>
  );
};

export default BottomNav;
