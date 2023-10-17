/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from "react";
import "./app.scss";
import Sidebar from "./parts/Sidebar";
import Navbar from "./parts/Navbar";
import Footer from "./parts/Footer";
import AppRoutes from "./routes";
import PageHeader from "./parts/PageHeader";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { IRootState } from "./config/reducers";
import { useAppDispatch } from "./config/store";
import {
  getAllNoti,
  getCountNoti,
} from "./reducers/ducks/operators/notificationOperator";
import axios from "axios";
import { addDays, format, isSunday } from "date-fns";
import { HistoryAction } from "./reducers/ducks/slices/historySlice";

function App() {
  const path = useLocation();
  const timer = useRef<NodeJS.Timer | null>(null);
  const timerTicker = useRef<NodeJS.Timer | null>(null);
  const dispatch = useAppDispatch();
  const current = new Date();
  const [hour, setHour] = useState(current.getHours());
  const { entities, loading, count } = useSelector(
    (state: IRootState) => state.notiReducer,
  );

  useEffect(() => {
    const getStock = async () => {
      const inRs = await axios.get("/info", {
        params: {
          ticker: "BLND",
        },
      });
      const prevClose = inRs.data.previousClose
        ? parseFloat(inRs.data.previousClose)
        : 0;
      const rs = await axios.get("/daily", {
        params: {
          ticker: "BLND",
          start: format(new Date(), "yyyy-MM-dd"),
          end: format(addDays(new Date(), 1), "yyyy-MM-dd"),
          interval: "5m",
        },
      });
      const arrays = rs.data || [];
      if (arrays.length > 0) {
        const item = arrays[arrays.length - 1];
        const per = ((parseFloat(item.Close) - prevClose) / prevClose) * 100;
        if (Math.abs(per) > 5) {
          // increase or decrease more than (+ or -) 5%
          const dataRequest = {
            ticker: "BLND",
            per: parseFloat(per.toFixed(2)),
            close: parseFloat(item.Close),
            updatedAt: `${format(new Date(), "yyyy-MM-dd")} ${format(
              new Date(),
              "HH:mm:ss",
            )}`,
          };
          await axios.post("/notifications", dataRequest);
          // reload
          dispatch(getAllNoti());
          dispatch(getCountNoti());
        }
      }
    };

    timerTicker.current = setInterval(
      () => {
        // eslint-disable-next-line no-console
        console.log("current hour", hour);
        setHour(current.getHours());
        if ((hour >= 20 || (hour >= 0 && hour <= 5)) && !isSunday(new Date()))
          getStock();
      },
      1000 * 60 * 5, // 5mn after 20PM - 5AM next day
    );

    return () => {
      if (timerTicker.current) clearInterval(timerTicker.current);
      dispatch(HistoryAction.clear());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hour]);

  useEffect(() => {
    dispatch(getAllNoti());
    dispatch(getCountNoti());

    timer.current = setInterval(() => {
      dispatch(getAllNoti());
      dispatch(getCountNoti());
    }, 1000 * 60); // after 1ph

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [dispatch]);
  const [showNoti, setShowNoti] = useState(false);
  return (
    <>
      <Navbar show={showNoti} toggle={(s) => setShowNoti(s)} />
      <div className="page-content">
        <Sidebar />
        <div className="content-wrapper">
          <div className="content-inner">
            {path.pathname.includes("/tickers/") && <PageHeader />}
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
          <div className="bg-light fw-medium py-2 px-3 d-flex align-items-center">
            New notifications
            {count > 0 && (
              <span
                className="ml-2 badge badge-secondary cursor-pointer"
                onClick={async () => {
                  const ids = entities.filter((x) => !x.read).map((x) => x.id);
                  ids.forEach(async (id) => {
                    await axios.put(`/notifications/${id}/read`);
                    dispatch(getCountNoti());
                    dispatch(getAllNoti());
                  });
                }}
              >
                Mark all read
              </span>
            )}
            <span
              className="badge badge-primary ml-2 cursor-pointer"
              onClick={() => {
                dispatch(getAllNoti());
                dispatch(getCountNoti());
              }}
            >
              {loading && (
                <i className="ph-light ph-spinner ph-sm-size spinner mr-2"></i>
              )}
              Reload
            </span>
          </div>
          {loading && (
            <div className="p-3">
              <i className="ph-light ph-spinner ph-sm-size spinner mr-2"></i>
            </div>
          )}

          {entities.map((entity) => {
            return (
              <div className="pl-3 pr-3 mt-2" key={entity.id}>
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
                      The {entity.ticker} has been{" "}
                      <span
                        className={`p-lr-xxs ${
                          entity.per < 0 ? "text-danger" : "text-success"
                        }`}
                      >
                        {entity.per < 0 ? "decrease" : "increase"}
                        {entity.per}%
                      </span>
                      and close is {entity.close}
                    </div>
                    <div className="fs-sm text-muted mt-1">
                      {entity.updatedAt}
                    </div>
                    {!entity.read && (
                      <span
                        onClick={async () => {
                          await axios.put(`/notifications/${entity.id}/read`);
                          dispatch(getCountNoti());
                          dispatch(getAllNoti());
                        }}
                        className="badge badge-primary cursor-pointer"
                      >
                        Read
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default App;
