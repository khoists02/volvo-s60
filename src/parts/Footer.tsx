import React, { FC } from "react";

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
            <a
              href="https://kopyov.ticksy.com/"
              className="navbar-nav-link navbar-nav-link-icon rounded"
              target="_blank"
            >
              <div className="d-flex align-items-center mx-md-1">
                <i className="ph-lifebuoy"></i>
                <span className="d-none d-md-inline-block ms-2">Support</span>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
