import React, { useState } from "react";
import "./app.scss";
import Sidebar from "./parts/Sidebar";
import Navbar from "./parts/Navbar";
import Footer from "./parts/Footer";
import AppRoutes from "./routes";
import PageHeader from "./parts/PageHeader";
import { useLocation } from "react-router-dom";

function App() {
  const path = useLocation();

  const [showNoti, setShowNoti] = useState(false);
  return (
    <>
      <Navbar show={showNoti} toggle={(s) => setShowNoti(s)} />
      <div className="page-content">
        <Sidebar />
        <div className="content-wrapper">
          <div className="content-inner">
            {path.pathname.includes("/histories/") && <PageHeader />}
            <div className="content pt-3">
              <AppRoutes />
            </div>
          </div>
          <Footer />
        </div>
      </div>
      <div
        className={`offcanvas offcanvas-end ${
          showNoti ? "show animated fadeInRight" : ""
        }`}
        id="notification"
      >
        <div className="offcanvas-header py-0 d-flex justify-content-between">
          <h5 className="offcanvas-title pt-3 pb-3 pl-3">Activity</h5>
          <button
            type="button"
            onClick={() => setShowNoti(false)}
            className="btn btn-light btn-sm btn-icon border-transparent rounded-pill mt-3 mb-3 mr-3"
          >
            <i className="ph-light ph-sm-size ph-x"></i>
          </button>
        </div>
        <div className="offcanvas-body p-0">
          <div className="bg-light fw-medium py-2 px-3">New notifications</div>
          <div className="p-3">
            <div className="d-flex align-items-start mb-3">
              <span className="status-indicator-container me-3">
                <img
                  src="../../../assets/images/demo/users/face1.jpg"
                  className="w-40px h-40px rounded-pill"
                  alt=""
                />
                <span className="status-indicator bg-success"></span>
              </span>
              <div className="flex-fill">
                <div>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Natus, deserunt iure neque temporibus veritatis, suscipit
                  voluptate asperiores doloribus laudantium veniam libero harum
                  enim dignissimos tempore consequatur quaerat itaque
                  consectetur rerum.
                </div>
                <div className="fs-sm text-muted mt-1">2 hours ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
