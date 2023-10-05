import React, { FC } from "react";

const Sidebar: FC = () => {
  return (
    <div className="sidebar sidebar-dark sidebar-main sidebar-expand-lg">
      <div className="sidebar-content">
        <div className="sidebar-section">
          <div className="nav nav-sidebar">
            <div className="nav-item">
              <a href="#" className="nav-link">
                <i className="ph-swatches"></i>
                <span>Themes</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
