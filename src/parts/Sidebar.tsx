import React, { FC, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar: FC = () => {
  const path = useLocation();
  const [collapsed, setCollapsed] = useState(window.innerWidth > 1800 ? false: true);
  return (
    <div className={`sidebar sidebar-dark sidebar-main sidebar-expand-lg ${collapsed ? "sidebar-main-resized" : ""}`}>
      <div className="sidebar-content">
        <div className="sidebar-section">
        <div className="sidebar-section-body d-flex justify-content-center">
						<h5 className="sidebar-resize-hide flex-grow-1 my-auto">Navigation</h5>

						<div>
							<button onClick={() => setCollapsed(!collapsed)} type="button" className="btn btn-flat-white btn-icon btn-sm rounded-pill border-transparent sidebar-control sidebar-main-resize d-none d-lg-inline-flex text-white">
								<i className="ph-light ph-sm-size ph-arrows-left-right"></i>
							</button>

							<button type="button" className="btn btn-flat-white btn-icon btn-sm rounded-pill border-transparent sidebar-mobile-main-toggle d-lg-none text-white">
								<i className="ph-light ph-sm-size ph-x"></i>
							</button>
						</div>
					</div>
          <div className="nav nav-sidebar">
            <div className="nav-item">
              <Link to="/histories" className={`nav-link ${path.pathname === "/histories" ? "active": ""}`}>
                <i className="ph-light ph-sm-size ph-swatches"></i>
                <span>Histories</span>
              </Link>
            </div>

            <div className="nav-item">
              <Link to="/favorites" className={`nav-link ${path.pathname === "/favorites" ? "active": ""}`}>
                <i className="ph-light ph-sm-size ph-star"></i>
                <span>Favorites</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
