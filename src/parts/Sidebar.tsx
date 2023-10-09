import React, { FC } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar: FC = () => {
  const path = useLocation();
  return (
    <div className="sidebar sidebar-dark sidebar-main sidebar-expand-lg sidebar-main-resized">
      <div className="sidebar-content">
        <div className="sidebar-section">
          <div className="nav nav-sidebar">
            <div className="nav-item">
              <Link to="/home" className={`nav-link ${path.pathname === "/home" ? "active": ""}`}>
                <i className="ph-light ph-swatches"></i>
                <span>Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
