import React from "react";
import "./app.scss";
import Sidebar from "./parts/Sidebar";
import Navbar from "./parts/Navbar";
// import PageHeader from "./parts/PageHeader";
import Footer from "./parts/Footer";

function App() {
  return (
    <>
      <Navbar />
      <div className="page-content">
        <Sidebar />
        <div className="content-wrapper">
          <div className="content-inner">
            <div className="content pt-3">
              <div className="row">
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body">Card</div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body">Card</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default App;
