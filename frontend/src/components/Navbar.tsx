import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthcontext } from "../hooks/useAuthContext";

export const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // State for mobile menu
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = useLogout();
  const { state } = useAuthcontext();
  const { user } = state;
  // const [firstName, setFirstName] = useState(" ");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setDarkMode(prefersDark);
    if (prefersDark) document.documentElement.classList.add("dark-mode");
  }, []);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen); // Toggle the mobile menu
  };
  // console.log("Navbar user:", user);

  return (
    <header>
      <div className="container">
        <div className="left">
          {/* Dummy Logo SVG */}
          <Link to="/">
            <svg
              width="40"
              height="40"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="logo"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#1aac83"
                strokeWidth="10"
              />
              <text
                x="50%"
                y="55%"
                textAnchor="middle"
                fill="#1aac83"
                fontSize="40"
                fontWeight="bold"
                fontFamily="Poppins"
                dy=".3em"
              >
                F
              </text>
            </svg>
            
          </Link>
          {user && <span>{user.firstName}</span>}
        </div>

        <nav className={`right ${mobileMenuOpen ? "active" : ""}`}>
          
          <Link to="/home" className="nav-link">
            Dashboard
          </Link>
          <Link to="/about" className="nav-link">
            About
          </Link>
          <Link to="/orders" className="nav-link">
            Orders
          </Link>
          <Link to="/products" className="nav-link">
            Products
          </Link>
          {/* Mobile Profile Dropdown */}
          <div className="profile-dropdown" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="profile-btn"
              aria-haspopup="true"
              aria-expanded={dropdownOpen ? "true" : "false"}
            >
              {/* Profile icon (circle with initials or dummy) */}
              <div className="profile-icon">FR</div>
            </button>
            {dropdownOpen && (
              <ul className={`dropdown-menu ${dropdownOpen ? "open" : ""}`}>
                <li>
                  <Link to="/profile" onClick={() => setDropdownOpen(false)}>
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link to="/settings" onClick={() => setDropdownOpen(false)}>
                    Settings
                  </Link>
                </li>
                <li>
                  <Link to="/help" onClick={() => setDropdownOpen(false)}>
                    Help & Support
                  </Link>
                </li>
                <li>
                  <Link
                    to="/logout"
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                    className="dropdown-item logout-btn"
                  >
                    Log out
                  </Link>
                </li>
              </ul>
            )}
          </div>
          {/* darkmode  */}
          <div className="darkmode-toggle">
            <label className="switch">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={toggleDarkMode}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </nav>

        {/* Hamburger Menu for Mobile View */}
        <button
          className="navbar-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>
      {/* Mobile Menu */}
      <div className={`navbar-mobile ${mobileMenuOpen ? "active" : ""}`}>
        
        {/* <Link to="/home" className="nav-link-mobile" onClick={toggleMobileMenu}>
          {user && <span>{user.firstName}</span>}
        </Link> */}
        <Link to="/home" className="nav-link-mobile" onClick={toggleMobileMenu}>
        {/* {user && <span>{user.firstName}</span>}<br></br><br></br> */}
          Dashboard
        </Link>
        <Link
          to="/about"
          className="nav-link-mobile"
          onClick={toggleMobileMenu}
        >
          About
        </Link>
        <Link
          to="/orders"
          className="nav-link-mobile"
          onClick={toggleMobileMenu}
        >
          Orders
        </Link>
        <Link
          to="/products"
          className="nav-link-mobile"
          onClick={toggleMobileMenu}
        >
          Products
        </Link>
        <Link
          to="/logout"
          className="nav-link-mobile"
          onClick={() => {
            logout();
            toggleMobileMenu();
          }}
        >
          Logout
        </Link>
      </div>
    </header>
  );
};
