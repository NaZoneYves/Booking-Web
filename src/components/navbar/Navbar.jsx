import { NavLink } from "react-router-dom";
import "./navbar.css";

const Navbar = ({ isAuthenticated, onLogout }) => {
  return (
    <div className="navbar">
      <div className="navContainer">
        <span className="logo">Booking Website</span>
        <div className="navItems">
          {!isAuthenticated ? (
            <>
              <NavLink to="/register" ><button className="navButton">Register</button></NavLink>
              <NavLink to="/login"><button className="navButton">Login</button></NavLink>
            </>
          ) : (
            <>
              <button className="navButton" onClick={onLogout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
