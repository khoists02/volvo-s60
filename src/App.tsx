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
      <div className={`offcanvas offcanvas-end ${showNoti ? "show" : ""}`} id="notification">
        <div className="offcanvas-header py-0 d-flex justify-content-between">
          <h5 className="offcanvas-title pt-3 pb-3 pl-3">Activity</h5>
          <button type="button" onClick={() => setShowNoti(false)} className="btn btn-light btn-sm btn-icon border-transparent rounded-pill mt-3 mb-3 mr-3">
            <i className="ph-light ph-sm-size ph-x"></i>
          </button>
        </div>
        <div className="offcanvas-body p-0">
          
        </div>
      </div>
    </>
  );
}

export default App;
