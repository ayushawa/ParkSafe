import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "Explore", path: "/" },
    { name: "Ride", path: "/ride" },
    { name: "Bookings", path: "/bookings" },
    { name: "Logout", path: "/login" }
  ];

  const handleClick = (item) => {
    if (item.name === "Logout") {
      localStorage.removeItem("token");
      navigate("/login");
    } else {
      navigate(item.path);
    }
  };

  return (
    <div className="sidebar">
      <h2 className="logo">ParkSafe</h2>

      {menu.map((item) => (
        <div
          key={item.name}
          className={`sidebar-item ${
            location.pathname === item.path ? "active" : ""
          }`}
          onClick={() => handleClick(item)}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;