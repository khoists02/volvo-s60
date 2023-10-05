import React, { FC } from "react";
import LogoIcon from "../assets/images/logo_icon.svg";
import LogoTxtLight from "../assets/images/logo_text_light.svg";

const Navbar: FC = () => {
  return (
    <div className="navbar navbar-dark navbar-expand-lg navbar-static border-bottom border-bottom-white border-opacity-10">
      <div className="container-fluid">
        <div className="d-flex d-lg-none me-2">
          <button
            type="button"
            className="navbar-toggler sidebar-mobile-main-toggle rounded-pill"
          >
            <i className="ph-list"></i>
          </button>
        </div>

        <div className="navbar-brand flex-1 flex-lg-0">
          <a href="index.html" className="d-inline-flex align-items-center">
            <img src={LogoIcon} alt="Logo Icon" />
            <img
              src={LogoTxtLight}
              className="d-none d-sm-inline-block h-16px ms-3 pl-2"
              alt="Logo Text"
            />
          </a>
        </div>
        <div className="flex-1"></div>
        <ul className="nav flex-row justify-content-end order-1 order-lg-2"></ul>
      </div>
    </div>
  );
};

export default Navbar;
