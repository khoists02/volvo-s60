import React, { FC } from "react";

const PageHeader: FC = () => {
  return (
    <div className="page-header">
      <div className="page-header-content d-lg-flex">
        <div className="d-flex">
          <h4 className="page-title mb-0">
            Home - <span className="fw-normal">Dashboard</span>
          </h4>

          <a
            href="#page_header"
            className="btn btn-light align-self-center collapsed d-lg-none border-transparent rounded-pill p-0 ms-auto"
            data-bs-toggle="collapse"
          >
            <i className="ph-caret-down collapsible-indicator ph-sm m-1"></i>
          </a>
        </div>

        <div
          className="collapse d-lg-block my-lg-auto ms-lg-auto"
          id="page_header"
        >
          <div className="d-sm-flex align-items-center mb-3 mb-lg-0 ms-lg-3">
            <div className="d-inline-flex align-items-center">
              <a href="#" className="status-indicator-container ms-1">
                <img
                  src="../../../assets/images/demo/users/face24.jpg"
                  className="w-32px h-32px rounded-pill"
                  alt=""
                />
                <span className="status-indicator bg-warning"></span>
              </a>
              <a href="#" className="status-indicator-container ms-1">
                <img
                  src="../../../assets/images/demo/users/face1.jpg"
                  className="w-32px h-32px rounded-pill"
                  alt=""
                />
                <span className="status-indicator bg-success"></span>
              </a>
              <a href="#" className="status-indicator-container ms-1">
                <img
                  src="../../../assets/images/demo/users/face3.jpg"
                  className="w-32px h-32px rounded-pill"
                  alt=""
                />
                <span className="status-indicator bg-danger"></span>
              </a>
              <a href="#" className="status-indicator-container ms-1">
                <img
                  src="../../../assets/images/demo/users/face5.jpg"
                  className="w-32px h-32px rounded-pill"
                  alt=""
                />
                <span className="status-indicator bg-success"></span>
              </a>

              <div className="vr flex-shrink-0 my-1 mx-3"></div>

              <a
                href="#"
                className="btn btn-primary btn-icon w-32px h-32px rounded-pill"
              >
                <i className="ph-plus"></i>
              </a>

              <div className="dropdown ms-2">
                <a
                  href="#"
                  className="btn btn-light btn-icon w-32px h-32px rounded-pill"
                  data-bs-toggle="dropdown"
                >
                  <i className="ph-dots-three-vertical"></i>
                </a>

                <div className="dropdown-menu dropdown-menu-end">
                  <button type="button" className="dropdown-item">
                    <i className="ph-briefcase me-2"></i>
                    Customer details
                  </button>
                  <button type="button" className="dropdown-item">
                    <i className="ph-folder-user me-2"></i>
                    User directory
                  </button>
                  <button type="button" className="dropdown-item">
                    <i className="ph-user-gear me-2"></i>
                    Permissions
                  </button>
                  <div className="dropdown-divider"></div>
                  <button type="button" className="dropdown-item">
                    <i className="ph-users-four me-2"></i>
                    Manage users
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
