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
  getFavoritesTimer,
} from "./reducers/ducks/operators/notificationOperator";
import axios from "axios";
import { addDays, format } from "date-fns";
import { HistoryAction } from "./reducers/ducks/slices/historySlice";

function App() {
  const path = useLocation();
  const timer = useRef<NodeJS.Timer | null>(null);
  const timerTicker = useRef<NodeJS.Timer | null>(null);
  const dispatch = useAppDispatch();
  const current = new Date();
  const nextDay = addDays(current, 1);
  const hour: number = current.getHours();
  const hourNext: number = nextDay.getHours();
  const { entities, loading, count } = useSelector(
    (state: IRootState) => state.notiReducer,
  );

  const { entitiesTimer } = useSelector(
    (state: IRootState) => state.historyReducer,
  );

  useEffect(() => {
    timerTicker.current = setInterval(
      () => {
        if (hour >= 20 && hourNext <= 5) dispatch(getFavoritesTimer()); // 20PM td - 5PM tmr
      },
      1000 * 60 * 5, // 5mn
    );

    return () => {
      if (timerTicker.current) clearInterval(timerTicker.current);
      dispatch(HistoryAction.clear());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    const getStock = async () => {
      const blnd = entitiesTimer.find((x) => x.symbol === "BLND");
      if (blnd) {
        const { previousClose, currentPrice, symbol } = blnd;
        const per =
          (parseFloat(currentPrice) - parseFloat(previousClose)) /
          parseFloat(previousClose);
        const dataRequest = {
          ticker: symbol,
          per: parseFloat(per.toFixed(2)),
          close: parseFloat(currentPrice),
          updatedAt: `${format(new Date(), "yyyy-MM-dd")} ${format(
            new Date(),
            "HH:mm:ss",
          )}`,
        };
        await axios.post("/notifications", dataRequest);
      }
    };
    if (entitiesTimer.length > 0) getStock();
  }, [entitiesTimer]);

  useEffect(() => {
    dispatch(getAllNoti());
    dispatch(getCountNoti());

    timer.current = setInterval(() => {
      dispatch(getAllNoti());
      dispatch(getCountNoti());
    }, 1000 * 60); // 10s, after 21h every day

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
