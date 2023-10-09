import React from "react";
import "./app.scss";
import Sidebar from "./parts/Sidebar";
import Navbar from "./parts/Navbar";
import Footer from "./parts/Footer";
import AppRoutes from "./routes";
import PageHeader from "./parts/PageHeader";
import { useLocation } from "react-router-dom";

function App() {
  const path = useLocation();
  return (
    <>
      <Navbar />
      <div className="page-content">
        <Sidebar />
        <div className="content-wrapper">
          <div className="content-inner">
            {path.pathname === "/home" && <PageHeader />}
            <div className="content pt-3">
              <AppRoutes />
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default App;
