import React, { FC } from "react";
import { Link } from "react-router-dom";

const Footer: FC = () => {
  return (
    <div className="navbar navbar-sm border-top">
      <div className="container-fluid">
        <span>
          © 2022{" "}
          <a href="https://themeforest.net/item/limitless-responsive-web-application-kit/13080328">
            Limitless Web App Kit
          </a>
        </span>

        <ul className="nav">
          <li className="nav-item">
            <Link
              to="https://kopyov.ticksy.com/"
              className="navbar-nav-link navbar-nav-link-icon rounded"
            >
              <div className="d-flex align-items-center mx-md-1">
                <i className="ph-light ph-lifebuoy"></i>
                <span className="d-none d-md-inline-block ms-2">Support</span>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
