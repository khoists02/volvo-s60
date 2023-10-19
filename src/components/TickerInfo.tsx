import React, { FC, useEffect, useState } from "react";
import { ITickerInfo } from "../types/ticker";
import { convertToInternationalCurrencySystem } from "../helpers";
import { addDays, format, isBefore } from "date-fns";
import { FED_DAYS, HOLIDAYS } from "../constants";
import axios from "axios";

interface ITickerReportDays {
  label: string;
  value: string[];
}

const TickerInfo: FC<{
  ticker?: ITickerInfo;
  reload?: () => void;
  loading: boolean;
}> = ({ ticker, loading, reload }) => {
  const currentDate = new Date();
  const [percent, setPercent] = useState<number>(0);
  const [tickerReportDays, setTickerReportDays] = useState<ITickerReportDays[]>(
    [],
  );

  useEffect(() => {
    const getTickerReportDays = async () => {
      const rs = await axios.get("/earningdates", {
        params: { ticker: "BLND" },
      });
      if (rs.data) {
        const keys = Object.keys(rs.data);
        // eslint-disable-next-line no-console
        setTickerReportDays(
          keys.map((k: string) => {
            return {
              label: k,
              value: Object.keys(rs.data[k])
                .filter((v) => isBefore(new Date(), new Date(parseInt(v, 10))))
                .map((x) => format(new Date(parseInt(x, 10)), "dd-MM-yyyy")),
            };
          }),
        );
      }
    };

    getTickerReportDays();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ticker) {
      const rs =
        ((parseFloat(ticker.currentPrice) - parseFloat(ticker.previousClose)) /
          parseFloat(ticker.previousClose)) *
        100;
      setPercent(rs);
    }
  }, [ticker]);
  return (
    <div className="card">
      <div className="card-header d-sm-flex align-items-sm-center py-sm-0">
        <h5 className="py-sm-2 my-sm-1">
          <div
            className={`${
              loading ? "skeleton-box" : ""
            } d-flex align-items-center`}
          >
            <span>{ticker?.shortName}</span>
            {HOLIDAYS.includes(format(new Date(), "yyyy-MM-dd")) && (
              <span className="badge badge-success text-white ml-1">
                Holiday {format(new Date(), "dd-MM-yyyy")}
              </span>
            )}
            {FED_DAYS.includes(
              format(addDays(new Date(), 1), "yyyy-MM-dd"),
            ) && (
              <span className="badge badge-danger text-white ml-1">
                Danger Next Day {format(addDays(new Date(), 1), "dd-MM-yyyy")}
              </span>
            )}

            {tickerReportDays.map((t) => {
              return t.value.includes(
                format(addDays(new Date(), 1), "dd-MM-yyyy"),
              ) ? (
                <div key={t.label}>
                  <span className="badge badge-secondary text-white ml-1">
                    Next Day {t.label}{" "}
                    {format(addDays(new Date(), 1), "dd-MM-yyyy")}
                  </span>
                </div>
              ) : null;
            })}
          </div>
        </h5>
        {loading && ticker && (
          <i className="ph-light ph-sm-size ph-spinner spinner"></i>
        )}
      </div>

      <div className="card-body d-lg-flex align-items-lg-center justify-content-lg-between flex-lg-wrap">
        <div className="d-flex align-items-center mb-3 mb-lg-0">
          <div id="tickets-status">{ticker?.icon}</div>
          <div className="ml-1">
            <div className="d-flex align-items-center">
              <h5 className="mb-0">{ticker?.currentPrice}</h5>
              <i
                className={`ph-light ph-arrow-${
                  percent >= 0 ? "up" : "down"
                } text-${
                  percent >= 0 ? "success" : "danger"
                } fs-base lh-base align-top p-lr-xxs`}
              ></i>
              <span className={`text-${percent >= 0 ? "success" : "danger"}`}>
                {percent >= 0 ? "+" : ""}
                {percent.toFixed(2)}%
              </span>
            </div>

            <div className="font-h4">
              <span className="">Prev Close</span>
              <span className="ml-2">{ticker?.previousClose}</span>
            </div>

            <div className="d-flex align-items-center">
              <span className="d-inline-block bg-success rounded-pill p-1 mr-1"></span>
              <span className="text-muted">{currentDate.toDateString()}</span>
              <span
                className="badge badge-primary ml-1 cursor-pointer d-flex align-items-center"
                onClick={() => {
                  if (reload) reload();
                }}
              >
                {loading && (
                  <i className="ph-light ph-spinner ph-xs-size spinner mr-1"></i>
                )}
                <span>Reload</span>
              </span>
            </div>

            <div>
              {ticker?.recommendationMean ===
                parseFloat(ticker?.currentPrice as string) && (
                <span className="badge badge-success m-t-xxs">Sold now</span>
              )}
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center mb-3 mb-lg-0">
          <div className="bg-opacity-10 text-primary lh-1 rounded-pill p-2">
            <i className="ph-light ph-lg-size ph-currency-circle-dollar"></i>
          </div>
          <div className="ml-1 text-right" style={{ width: 200 }}>
            <span className="d-flex align-items-center">
              <h5 className="mb-0">
                {convertToInternationalCurrencySystem(ticker?.marketCap)}
              </h5>
              <span className="text-muted ml-1">Market cap</span>
            </span>
            <span className="d-flex align-items-center">
              <h5 className="mb-0">{ticker?.volume}</h5>
              <span className="text-muted ml-1">Vol</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TickerInfo;
