import { addDays, addHours, format, isSunday } from "date-fns";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { getStyleStock } from "../helpers";
import { useSelector } from "react-redux";
import { IRootState } from "../config/reducers";
import { useAppDispatch } from "../config/store";
import {
  getDailyDataByTicker,
  getTickerInfo,
} from "../reducers/ducks/operators/notificationOperator";

interface IDailyStock {
  ticker: string;
}

const DailyStock: FC<IDailyStock> = ({ ticker }) => {
  const timer = useRef<NodeJS.Timer | null>(null);
  const currentDate = new Date();
  const nextDate = addDays(addHours(currentDate, 0), 1);
  const [hour, setHour] = useState(currentDate.getHours());
  const [openMarket, setOpenMarket] = useState(false);
  const dispatch = useAppDispatch();
  const {
    ticker: tickerInfo,
    loading,
    dailyData,
    dailyLoading,
  } = useSelector((state: IRootState) => state.dailyReducer);

  const [hide, setHide] = useState(false);
  const fetchData = useCallback(() => {
    dispatch(getTickerInfo(ticker as string));
    dispatch(
      getDailyDataByTicker(
        ticker as string,
        format(currentDate, "yyyy-MM-dd"),
        format(nextDate, "yyyy-MM-dd"),
        "5m",
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, ticker]);
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // run first time ok
    if ((hour >= 20 || (hour >= 0 && hour <= 5)) && !isSunday(new Date()))
      setOpenMarket(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    timer.current = setInterval(
      () => {
        // eslint-disable-next-line no-console
        console.log("current hour", hour);
        setHour(currentDate.getHours());
        if ((hour >= 20 || (hour >= 0 && hour <= 5)) && !isSunday(new Date())) {
          fetchData();
        }
      },
      1000 * 60 * 5, // 5mn after 20PM - 5AM next day
    );

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hour]);

  return (
    <div className="card">
      <div className="card-header d-flex align-items-center justify-content-between">
        {openMarket && (
          <>
            <h5 className="title d-flex align-items-center">
              <span>
                {ticker} {tickerInfo?.previousClose}
              </span>
              <span
                className="cursor-pointer badge badge-primary ml-2 mr-2"
                onClick={() => {
                  fetchData();
                }}
              >
                Reload
              </span>
              {(loading || dailyLoading) && (
                <i className="ph-light ph-spinner ph-sm-size spinner"></i>
              )}
              <span className="ml-2">Interval: 5m</span>
            </h5>

            <h5 onClick={() => setHide(!hide)}>
              <i
                className={`cursor-pointer ph-light ph-sm-size ph-arrow-${
                  !hide ? "right" : "down"
                } font-weight`}
              ></i>
            </h5>
          </>
        )}
        {!openMarket && <h5>{tickerInfo?.symbol} Market Close</h5>}
      </div>
      {!hide && (
        <div className="card-body animated fadeInUp">
          {openMarket && (
            <div className="m-tb-sm">
              <span>Close after 5m: {dailyData[0]?.close}</span>
            </div>
          )}

          {openMarket && (
            <div className="table-responsive table-max-h">
              <table className="table text-nowrap">
                <thead>
                  <tr>
                    <th>
                      {dailyLoading && (
                        <i className="ph-light ph-spinner ph-sm-size spinner ml-2"></i>
                      )}

                      {openMarket && (
                        <i className="animated-stock bounceOut text-success ph-light ph-sm-size ph-trend-up"></i>
                      )}
                    </th>
                    <th>Open</th>
                    <th>High</th>
                    <th>Low</th>
                    <th>Close</th>
                  </tr>
                </thead>

                <tbody
                  style={{ maxHeight: "calc(100vh - 25px)", overflowY: "auto" }}
                >
                  {dailyLoading && (
                    <tr>
                      <td colSpan={5}>
                        <i className="ph-light ph-spinner ph-sm-size spinner ml-2"></i>
                      </td>
                    </tr>
                  )}
                  {dailyData.map((h) => {
                    return (
                      <tr
                        style={getStyleStock(
                          h.close,
                          parseFloat(tickerInfo?.previousClose as string),
                        )}
                        key={h.date}
                        className="tr-tree"
                      >
                        <td></td>
                        <td>{h.open.toFixed(2)}</td>
                        <td>{h.high.toFixed(2)}</td>
                        <td>{h.low.toFixed(2)}</td>
                        <td>{h.close.toFixed(3)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DailyStock;
