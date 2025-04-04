import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import necLogo from "../assets/nec_logo.png";
import "../components/Home.css";
import './Navbar.css';

const Navbar = () => {
  const [dropdownOpen1, setDropdownOpen1] = useState(false);
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate(); 

  const logout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login'); 
  };

  return (
    <div>
      <nav className="navbar">
        <Link to="/" className="navbar-brand"> {/* Use Link for logo */}
          <img className="logo" src={necLogo} alt="NEC Logo" />
        </Link>
        <div className="nav-links">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/recruiters">Recruiters</Link></li>

            {user ? (
              <>
                <li className="nav-item dropdown">
                  <div
                    className="profile-circle"
                    onClick={() => setDropdownOpen1(!dropdownOpen1)}
                  >
                   {user.name.charAt(0)}
                  </div>
                  {dropdownOpen1 && (
                    <div className="dropdown-menu1">
                      <Link
                        to="/profile"
                        className="dropdown-item"
                        style={{
                          color: "black",
                          backgroundColor: "white",
                          padding: "8px",
                          display: "block",
                        }}
                        onMouseOver={(e) => e.target.style.color = "blue"}
                        onMouseOut={(e) => e.target.style.color = "black"}
                      >
                        Profile
                      </Link>
                      <button // Use a button for logout
                        className="dropdown-item"
                        onClick={logout}
                        style={{
                          color: "black",
                          backgroundColor: "white",
                          padding: "8px",
                          display: "block",
                          border: 'none', // Remove default button border
                          cursor: 'pointer', // Add cursor pointer for better UX
                        }}
                        onMouseOver={(e) => e.target.style.color = "blue"}
                        onMouseOut={(e) => e.target.style.color = "black"}
                      >
                        LogOut
                      </button>
                    </div>
                  )}
                </li>
              </>
            ) : (
              <li><Link to="/login" className="login-btn">Login</Link></li>
            )}
          </ul>
        </div>
      </nav>

      {/* Styles (Consider moving to CSS file) */}
      <style>
        {`
          .profile-circle {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: white;
            color: blue;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            border: 2px solid blue;
          }

          .dropdown-menu1 { /* Corrected class name */
            position: absolute;
            background: white;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            padding: 10px;
            right: 0; /* Adjust the dropdown position */
            z-index: 1000; /* Ensure it's above other content */
          }

          .dropdown-item {
              display: block;
              padding: 8px;
              color: black;
              background-color: white;
              text-decoration: none;
              border: none;
              cursor: pointer;
              text-align: left;
          }

          .dropdown-item:hover {
              color: blue;
          }
        `}
      </style>
    </div>
  );
}

export default Navbar;