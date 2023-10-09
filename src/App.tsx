import React from "react";
import "./app.scss";
import Sidebar from "./parts/Sidebar";
import Navbar from "./parts/Navbar";
import Footer from "./parts/Footer";
import AppRoutes from "./routes";
import PageHeader from "./parts/PageHeader";

function App() {
 
  return (
    <>
      <Navbar />
      <div className="page-content">
        <Sidebar />
        <div className="content-wrapper">
          <div className="content-inner">

            <PageHeader />
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
