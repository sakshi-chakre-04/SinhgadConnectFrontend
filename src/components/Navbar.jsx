import globe from "../assets/globe.png";
import lens from "../assets/lens.png";
import Avatar from "react-avatar";
import { useState } from "react";
import ASKQues from "./ASKQues";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Reusable styles for navigation links
  const navLinkStyles = ({ isActive }) =>
    `nav-icon-link ${isActive ? "nav-icon-active" : ""}`;

  return (
    <>
      <div className="navbar-container">
        {/* SinhgadConnect Logo */}
        <NavLink to="/dashboard" className="navbar-logo">
          SinhgadConnect
        </NavLink>

        {/* Navigation Icons */}
        <div className="navbar-icons">
          <NavLink to="/dashboard" className={navLinkStyles}>
            {/* Home Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" style={{ flexShrink: 0 }}>
              <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5H6a.5.5 0 0 0-.5.5v4H2.5z"/>
            </svg>
          </NavLink>

          <NavLink to="/posts" className={navLinkStyles}>
            {/* Posts/List Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
          </NavLink>

          <NavLink to="/create-post" className={navLinkStyles}>
            {/* Create Post/Pencil Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" style={{ flexShrink: 0 }}>
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
              <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
            </svg>
          </NavLink>

          <NavLink to="/community" className={navLinkStyles}>
            {/* Community/Group Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
              <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A3.01 3.01 0 0 0 17.1 7c-.8 0-1.54.5-1.85 1.26l-1.92 5.76A2.99 2.99 0 0 0 16.2 17H18v5h2zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zm1.5 1h-2c-1.1 0-2 .9-2 2v5.5h6V14.5c0-1.1-.9-2-2-2zM6 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A3.01 3.01 0 0 0 7.1 7c-.8 0-1.54.5-1.85 1.26L3.33 14.37A2.99 2.99 0 0 0 6.2 17H8v5h2z"/>
            </svg>
          </NavLink>

          <NavLink to="/notifications" className={navLinkStyles}>
            {/* Notification/Bell Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" style={{ flexShrink: 0 }}>
              <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0"/>
            </svg>
          </NavLink>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <img src={lens} alt="Search" style={{ width: '16px', height: '16px', flexShrink: 0 }} />
          <input
            placeholder="Search SinhgadConnect"
            className="search-input"
          />
        </div>

        {/* Profile and Actions */}
        <div className="profile-section">
          <div className="user-info-badge">
            {user?.department} - Year {user?.year}
          </div>
          <img src={globe} alt="Globe" className="globe-icon" />
          <Avatar 
            name={user?.name || "User"} 
            round 
            size="30" 
            style={{ cursor: 'pointer', flexShrink: 0 }}
          />
          <button
            onClick={() => setIsOpen(true)}
            className="add-question-btn"
          >
            Add Question
          </button>
          <button
            onClick={handleLogout}
            className="logout-btn"
          >
            Logout
          </button>
          {isOpen && (
            <ASKQues
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              initialTab={"Add Question"}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;