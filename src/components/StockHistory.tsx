import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  subWeeks,
  startOfWeek,
  addHours,
  format,
  subMonths,
  startOfMonth,
  startOfYear,
  isSameDay,
  isMonday,
  isTuesday,
  isWednesday,
  isThursday,
  isFriday,
  addDays,
  endOfMonth,
  endOfWeek,
} from "date-fns";
import axios from "axios";
import { FORMAT_DISPLAY, FORMAT_QUERY, FilterType } from "../constants";
import { ITickerInfo } from "../types/ticker";
import Select from "react-select";
import { getStyleStock } from "../helpers";
import { IRootState } from "../config/reducers";
import { useSelector } from "react-redux";

export interface IStockHistory {
  ticker: string;
  info?: ITickerInfo;
}

export interface IHistoryResponse {
  date: number;
  open: number;
  close: number;
  low: number;
  high: number;
  ticker: string;
  volume: number;
  adjclose: number;
  timeline?: string;
}

const currentDate = new Date();
const lastWeekFromCurrent = subWeeks(currentDate, 1);
const lastMonth = subMonths(currentDate, 1);
const startLastMonth = startOfMonth(lastMonth);
const startDayOfWeek = addHours(
  startOfWeek(lastWeekFromCurrent, { weekStartsOn: 1 }),
  0,
);
const StockHistory: FC<IStockHistory> = ({ ticker, info }) => {
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [histories, setHistories] = useState<IHistoryResponse[]>([]);
  const [filterred, setFilterred] = useState<IHistoryResponse[]>([]);
  const [dailyData, setDailyData] = useState<IHistoryResponse[]>([]);
  const intervalOptions = [
    { label: "5m", value: "5m" },
    { label: "15m", value: "15m" },
    { label: "30m", value: "30m" },
    { label: "1h", value: "1h" },
  ];
  const [selectedInterval, setSelectedInterval] = useState("15m");
  const [daysFilter, setDaysFilter] = useState([
    "MON",
    "TUES",
    "WED",
    "THUR",
    "FRI",
  ]);
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy/MM/dd"),
  );
  const [isGrow, setIsGrow] = useState(false);
  const [isDown, setIsDown] = useState(false);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [compareType, setCompareType] = useState<"current" | "prev">("current");
  const [specificDay, setSpecificDate] = useState("");
  const [selectedType, setSelectedType] = useState<FilterType>(
    FilterType["this-week"],
  );
  const { account } = useSelector((state: IRootState) => state.accountReducer);

  const { ticker: tickerInfo } = useSelector(
    (state: IRootState) => state.dailyReducer,
  );
  const [dailyLoading, setDailyLoading] = useState(false);
  useEffect(() => {
    setSelectedDate("");
    const getHistoryByTicker = async () => {
      setLoading(true);
      let start = currentDate;
      let end = addDays(currentDate, 1);
      if (selectedType === FilterType["last-week"]) {
        start = startDayOfWeek;
        end = endOfWeek(startDayOfWeek);
      } else if (selectedType === FilterType["last-month"]) {
        start = startLastMonth;
        end = endOfMonth(startLastMonth);
      } else if (selectedType === FilterType["this-month"]) {
        start = startOfMonth(currentDate);
      } else if (selectedType === FilterType["this-week"]) {
        start = startOfWeek(currentDate);
      } else if (selectedType === FilterType["last-6-month"]) {
        start = startOfMonth(subMonths(currentDate, 6));
      } else if (selectedType === FilterType.yearly) {
        start = startOfYear(currentDate);
      }
      const rs = await axios.get("/data", {
        params: {
          ticker: ticker,
          start: format(start, FORMAT_QUERY),
          end: format(end, FORMAT_QUERY),
        },
      });
      setHistories(rs.data);
      setLoading(false);
    };
    getHistoryByTicker();
  }, [selectedType, ticker]);

  const title = useMemo(() => {
    switch (selectedType) {
      case FilterType["last-week"]:
        const dateMonday = format(startDayOfWeek, FORMAT_DISPLAY);
        const currentDateF = format(currentDate, FORMAT_DISPLAY);
        return `Last Week ${dateMonday} - ${currentDateF}`;
      case FilterType["last-month"]:
        const s = format(startLastMonth, FORMAT_DISPLAY);
        const e = format(currentDate, FORMAT_DISPLAY);
        return `Last Month ${s} - ${e}`;
      case FilterType["this-month"]:
        const t = format(startOfMonth(currentDate), FORMAT_DISPLAY);
        const d = format(currentDate, FORMAT_DISPLAY);
        return `This Month ${t} - ${d}`;
      case FilterType["this-week"]:
        const c = format(startOfWeek(currentDate), FORMAT_DISPLAY);
        const b = format(currentDate, FORMAT_DISPLAY);
        return `This Week ${c} - ${b}`;

      case FilterType["last-6-month"]:
        const ch = format(
          startOfMonth(subMonths(currentDate, 6)),
          FORMAT_DISPLAY,
        );
        const bj = format(currentDate, FORMAT_DISPLAY);
        return `Last 6 Month ${ch} - ${bj}`;

      case FilterType.yearly:
        const hh = format(startOfYear(currentDate), FORMAT_DISPLAY);
        const gg = format(currentDate, FORMAT_DISPLAY);
        return `Last 6 Month ${hh} - ${gg}`;
      default:
        return "";
    }
  }, [selectedType]);

  const isInDay = (date: Date, type: string) => {
    switch (type) {
      case "MON":
        return daysFilter.includes("MON") && isMonday(date);
      case "TUES":
        return daysFilter.includes("TUES") && isTuesday(date);
      case "WED":
        return daysFilter.includes("WED") && isWednesday(date);
      case "THUR":
        return daysFilter.includes("THUR") && isThursday(date);
      case "FRI":
        return daysFilter.includes("FRI") && isFriday(date);
      default:
        return true;
    }
  };

  useEffect(() => {
    let date: Date;
    if (specificDay) {
      date = new Date(specificDay);
    }
    const his = [...histories];
    let rs: IHistoryResponse[] = [];
    if (!info) rs = his;

    if (isGrow) {
      rs = his.filter(
        (x) =>
          x.adjclose >
          parseFloat(parseFloat(info?.currentPrice || "0").toFixed(2)),
      );
    } else {
      rs = his;
    }
    rs = rs.filter(
      (x) =>
        isInDay(new Date(x.date), "MON") ||
        isInDay(new Date(x.date), "TUES") ||
        isInDay(new Date(x.date), "WED") ||
        isInDay(new Date(x.date), "THUR") ||
        isInDay(new Date(x.date), "FRI"),
    );
    if (specificDay)
      rs = rs.filter((x) => isSameDay(new Date(x.date), new Date(date)));

    setFilterred(rs.reverse());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGrow, isDown, histories, info, specificDay, daysFilter]);

  const expectedTrated = useMemo(() => {
    if (histories.length > 0) {
      const sum = histories
        .map((x) => x.adjclose)
        .reduce((total, item) => total + item);
      return (sum / histories.length).toFixed(2);
    }
    return 0;
  }, [histories]);

  const max = useMemo(() => {
    if (histories.length > 0) {
      const rs = Math.max(...histories.map((x) => x.adjclose));
      return rs;
    }
    return 0;
  }, [histories]);

  const min = useMemo(() => {
    if (histories.length > 0) {
      const rs = Math.min(...histories.map((x) => x.adjclose));
      return rs;
    }
    return 0;
  }, [histories]);

  useEffect(() => {
    if (selectedDate && selectedInterval) {
      const getDaily = async () => {
        setDailyLoading(true);
        const start = format(new Date(selectedDate), "yyyy-MM-dd");

        const end = format(addDays(new Date(selectedDate), 1), "yyyy-MM-dd");
        const res = await axios.get("/daily", {
          params: {
            ticker: ticker,
            start,
            end,
            interval: selectedInterval,
          },
        });
        if (res.data) {
          const dailyRs: IHistoryResponse[] = [];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          res.data.forEach((r: any) => {
            dailyRs.push({
              open: r.Open,
              date: new Date(selectedDate).getMilliseconds(),
              close: r.Close,
              low: r.Low,
              high: r.High,
              ticker: ticker,
              volume: 0,
              adjclose: 0,
            });
          });
          setDailyData(
            dailyRs.reverse().map((x, index) => {
              const t = (index + 1) * 15;
              return { ...x, timeline: t.toString() };
            }),
          );
          setDailyLoading(false);
        }
      };

      getDaily();
    }
  }, [selectedDate, selectedInterval, ticker]);

  const closePer = useCallback(
    (close: number) => {
      return tickerInfo?.previousClose
        ? ((close - parseFloat(tickerInfo?.previousClose || "0")) /
            parseFloat(tickerInfo?.previousClose || "1")) *
            100
        : 0;
    },
    [tickerInfo],
  );

  return (
    <div className="card">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <h5 style={{ width: 200 }}>Stock History</h5>
            {showAdvanced && (
              <input
                placeholder={format(currentDate, "yyyy/MM/dd")}
                style={{ minWidth: 150 }}
                type="text"
                onChange={(e) => setSpecificDate(e.target.value)}
                className="form-control"
              />
            )}
          </div>
          <div></div>
          <div className="list-buttons align-items-center d-flex">
            <span
              className="d-flex align-items-center mr-1 cursor-pointer"
              onClick={() => {
                setIsGrow(!isGrow);
              }}
            >
              <span>
                Grow{" "}
                {isGrow && (
                  <span>
                    ({filterred.length}/{histories.length})
                  </span>
                )}{" "}
              </span>
              <input checked={isGrow} type="checkbox" className="ml-1" />
            </span>

            <span
              className="d-flex align-items-center mr-1 cursor-pointer"
              onClick={() => {
                setIsDown(!isDown);
              }}
            >
              <span>
                Down{" "}
                {isDown && (
                  <span>
                    ({filterred.length}/{histories.length})
                  </span>
                )}{" "}
              </span>
              <input
                readOnly
                checked={isDown}
                type="checkbox"
                className="ml-1"
              />
            </span>

            <button
              onClick={() => {
                setSelectedType(FilterType["this-week"]);
              }}
              className={`btn btn-${
                selectedType === FilterType["this-week"] ? "primary" : "light"
              } d-flex align-item-center`}
            >
              <span>This Week</span>{" "}
              {loading && selectedType === FilterType["this-week"] && (
                <i className="ph-light ph-spinner ph-sm-size spinner ml-2"></i>
              )}
            </button>
            <button
              onClick={() => {
                setSelectedType(FilterType["last-week"]);
              }}
              className={`btn btn-${
                selectedType === FilterType["last-week"] ? "primary" : "light"
              } d-flex align-item-center`}
            >
              <span>Last Week</span>{" "}
              {loading && selectedType === FilterType["last-week"] && (
                <i className="ph-light ph-spinner ph-sm-size spinner ml-2"></i>
              )}
            </button>
            <button
              onClick={() => {
                setSelectedType(FilterType["this-month"]);
              }}
              className={`btn btn-${
                selectedType === FilterType["this-month"] ? "primary" : "light"
              } d-flex align-item-center`}
            >
              <span>This Month</span>{" "}
              {loading && selectedType === FilterType["this-month"] && (
                <i className="ph-light ph-spinner ph-sm-size spinner ml-2"></i>
              )}
            </button>
            <button
              onClick={() => {
                setSelectedType(FilterType["last-month"]);
              }}
              className={`btn btn-${
                selectedType === FilterType["last-month"] ? "primary" : "light"
              } d-flex align-item-center`}
            >
              <span>Last Month</span>{" "}
              {loading && selectedType === FilterType["last-month"] && (
                <i className="ph-light ph-spinner ph-sm-size spinner ml-2"></i>
              )}
            </button>

            <button
              onClick={() => {
                setSelectedType(FilterType["last-6-month"]);
              }}
              className={`btn btn-${
                selectedType === FilterType["last-6-month"]
                  ? "primary"
                  : "light"
              } d-flex align-item-center`}
            >
              <span>Last 6 Month</span>{" "}
              {loading && selectedType === FilterType["last-6-month"] && (
                <i className="ph-light ph-spinner ph-sm-size spinner ml-2"></i>
              )}
            </button>

            <button
              onClick={() => {
                setSelectedType(FilterType.yearly);
              }}
              className={`btn btn-${
                selectedType === FilterType.yearly ? "primary" : "light"
              } d-flex align-item-center`}
            >
              <span>This Year</span>{" "}
              {loading && selectedType === FilterType.yearly && (
                <i className="ph-light ph-spinner ph-sm-size spinner ml-2"></i>
              )}
            </button>
            <Select
              options={intervalOptions}
              defaultValue={intervalOptions.find(
                (i) => i.value === selectedInterval,
              )}
              onChange={(e) => {
                setSelectedInterval(e?.value || "");
              }}
              className="m-lr-xs"
            />
            <i
              className={`ph-light ph-gear ml-1 cursor-pointer ph-sm-size ${
                showAdvanced ? "text-success" : ""
              }`}
              onClick={() => {
                setShowAdvanced(!showAdvanced);
              }}
            ></i>
          </div>
        </div>

        {showAdvanced && filterred.length > 0 && (
          <div className="animated fadeInUp">
            <div className="table-light">
              <div className="d-flex align-items-center p-tb-xs w-100">
                <div
                  style={{ height: "2em", width: 400 }}
                  className={`${loading ? "skeleton-box" : ""}`}
                >
                  <span>
                    {" "}
                    <h4>{title}</h4>
                  </span>
                </div>

                {loading && (
                  <i className="ph-light ph-spinner ph-sm-size spinner ml-2"></i>
                )}
              </div>
            </div>

            <div className="table-light">
              <div className="d-flex align-items-center p-tb-xs w-100 font-weight font-h4">
                <span className="text-secondary">
                  Current: {parseFloat(info?.currentPrice || "0").toFixed(3)}
                </span>
                <span className="text-primary ml-2">Avg: {expectedTrated}</span>
                <span className="text-success ml-2">Max: {max.toFixed(2)}</span>
                <span className="text-danger ml-2">Min: {min.toFixed(2)}</span>
              </div>
            </div>

            <div className="table-light">
              <div className="d-flex p-tb-xs w-100">
                <div
                  className="d-flex align-items-center mr-2 cursor-pointer"
                  onClick={() => {
                    let days = [...daysFilter];
                    if (days.includes("MON")) {
                      days = days.filter((x) => x !== "MON");
                    } else {
                      days = ["MON", ...days];
                    }
                    setDaysFilter(days);
                  }}
                >
                  <span>Monday</span>
                  <input
                    checked={daysFilter.includes("MON")}
                    type="checkbox"
                    className="ml-1"
                  />
                </div>
                <div
                  className="d-flex align-items-center mr-2 cursor-pointer"
                  onClick={() => {
                    let days = [...daysFilter];
                    if (days.includes("TUES")) {
                      days = days.filter((x) => x !== "TUES");
                    } else {
                      days = ["TUES", ...days];
                    }
                    setDaysFilter(days);
                  }}
                >
                  <span>Tuesday</span>
                  <input
                    checked={daysFilter.includes("TUES")}
                    type="checkbox"
                    className="ml-1"
                  />
                </div>
                <div
                  className="d-flex align-items-center mr-2 cursor-pointer"
                  onClick={() => {
                    let days = [...daysFilter];
                    if (days.includes("WED")) {
                      days = days.filter((x) => x !== "WED");
                    } else {
                      days = ["WED", ...days];
                    }
                    setDaysFilter(days);
                  }}
                >
                  <span>Wed</span>
                  <input
                    checked={daysFilter.includes("WED")}
                    type="checkbox"
                    className="ml-1"
                  />
                </div>
                <div
                  className="d-flex align-items-center mr-2 cursor-pointer"
                  onClick={() => {
                    let days = [...daysFilter];
                    if (days.includes("THUR")) {
                      days = days.filter((x) => x !== "THUR");
                    } else {
                      days = ["THUR", ...days];
                    }
                    setDaysFilter(days);
                  }}
                >
                  <span>Thur</span>
                  <input
                    checked={daysFilter.includes("THUR")}
                    type="checkbox"
                    className="ml-1"
                  />
                </div>
                <div
                  className="d-flex align-items-center mr-2 cursor-pointer"
                  onClick={() => {
                    let days = [...daysFilter];
                    if (days.includes("FRI")) {
                      days = days.filter((x) => x !== "FRI");
                    } else {
                      days = ["FRI", ...days];
                    }
                    setDaysFilter(days);
                  }}
                >
                  <span>Fri</span>
                  <input
                    checked={daysFilter.includes("FRI")}
                    type="checkbox"
                    className="ml-1"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table text-nowrap no-border">
            <thead>
              <tr>
                <th></th>
                <th>Date Time</th>
                <th>Open</th>
                <th>High</th>
                <th>Low</th>
                <th>Close</th>
                <th>Adj Close</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7}>
                    <i className="ph-light ph-spinner ph-sm-size spinner ml-2"></i>
                  </td>
                </tr>
              )}

              {filterred.map((h) => {
                return (
                  <>
                    <tr
                      style={getStyleStock(
                        h.adjclose,
                        parseFloat(info?.previousClose as string) || 0,
                      )}
                      className="cursor-pointer"
                      key={format(new Date(h.date), "dd/MM/yyyy HH:mm:ss")}
                      onClick={() => {
                        if (
                          selectedDate ===
                          format(new Date(h.date), "yyyy/MM/dd")
                        ) {
                          setSelectedDate("");
                        } else {
                          setSelectedDate(
                            format(new Date(h.date), "yyyy/MM/dd"),
                          );
                        }
                      }}
                    >
                      <td className="d-flex align-items-center">
                        {(selectedType === FilterType["this-week"] ||
                          selectedType === FilterType["last-month"] ||
                          selectedType === FilterType["this-month"] ||
                          selectedType === FilterType["last-week"]) && (
                          <span className="mr-1">
                            {dailyLoading ? (
                              <i className="ph-light ph-xs-size ph-spinner spinner"></i>
                            ) : (
                              <i
                                className={`ph-light ph-caret-circle-${
                                  selectedDate ===
                                  format(new Date(h.date), "yyyy/MM/dd")
                                    ? "down text-secondary"
                                    : "right"
                                } cursor-pointer`}
                              ></i>
                            )}
                          </span>
                        )}

                        <span>{format(new Date(h.date), "EEEE")}</span>
                        <span className="ml-2">
                          {format(new Date(h.date), "dd-MM-yyyy")}
                        </span>
                      </td>
                      <td>{format(new Date(h.date), "dd/MM/yyyy HH:mm:ss")}</td>
                      <td>{h.open.toFixed(2)}</td>
                      <td>{h.high.toFixed(2)}</td>
                      <td>{h.low.toFixed(2)}</td>
                      <td>{h.close.toFixed(3)}</td>
                      <td>
                        <span>
                          {parseFloat(h.adjclose?.toString()).toFixed(3)}
                        </span>
                        {account.priceIn >= h.adjclose && (
                          <span className="cursor-pointer badge badge-secondary text-white ml-2">
                            KeyIn {account.priceIn}
                          </span>
                        )}

                        {account.priceOut <= h.adjclose && (
                          <span className="cursor-pointer badge badge-white text-success ml-2">
                            KeyOut {account.priceOut}
                          </span>
                        )}
                      </td>
                    </tr>
                    {selectedDate === format(new Date(h.date), "yyyy/MM/dd") &&
                      // eslint-disable-next-line @typescript-eslint/no-shadow
                      dailyData.map((h) => {
                        return (
                          <tr
                            style={getStyleStock(
                              h.close,
                              parseFloat(info?.previousClose as string) || 0,
                            )}
                            key={h.date}
                            className="tr-tree"
                          >
                            <td></td>
                            <td>{selectedInterval}</td>
                            <td>{h.open.toFixed(2)}</td>
                            <td>{h.high.toFixed(2)}</td>
                            <td>{h.low.toFixed(2)}</td>
                            <td>
                              <span> {h.close.toFixed(3)}</span>
                              <span className="ml-1">
                                ({closePer(h.close).toFixed(2)}%)
                              </span>
                            </td>
                            <th></th>
                          </tr>
                        );
                      })}
                  </>
                );
              })}
              {filterred.length === 0 && !loading && (
                <tr className="">
                  <div className="d-flex align-items-center p-lr-sm p-tb-xs w-100">
                    No Data
                  </div>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockHistory;
