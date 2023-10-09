import React, { CSSProperties, FC, useCallback, useEffect, useMemo, useState } from "react";
import { subWeeks, startOfWeek, addHours, format, subMonths, startOfMonth, startOfYear, isSameDay, isMonday, isTuesday, isWednesday, isThursday, isFriday } from "date-fns";
import axios from "axios";
import { FORMAT_DISPLAY, FORMAT_QUERY } from "../constants";
import { ITickerInfo } from "../types/ticker";

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
}

const currentDate = new Date();
const lastWeekFromCurrent = subWeeks(currentDate, 1);
const lastMonth = subMonths(currentDate, 1);
const startLastMonth = startOfMonth(lastMonth);
const startDayOfWeek = addHours(startOfWeek(lastWeekFromCurrent, { weekStartsOn: 1 }), 0);
const StockHistory: FC<IStockHistory> = ({
    ticker,
    info,
}) => {
    const [histories, setHistories] = useState<IHistoryResponse[]>([]);
    const [filterred, setFilterred] = useState<IHistoryResponse[]>([]);
    const [daysFilter, setDaysFilter] = useState(["MON", "TUES", "WED", "THUR", "FRI"]);
    const [isGrow, setIsGrow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [compareType, setCompareType] = useState<"current" | "prev">("current");
    const [specificDay, setSpecificDate] = useState("");
    const [selectedType, setSelectedType] = useState<"last-week" | "this-week" | "last-month" | "this-month" | "last-6-month" | "range" | "yearly">("last-week");
    useEffect(() => {
        const getHistoryByTicker = async () => {
            setLoading(true);
            let start = currentDate;
            if (selectedType === "last-week") {
                start = startDayOfWeek;
            } else if (selectedType === "last-month") {
                start = startLastMonth;
            } else if (selectedType === "this-month") {
                start = startOfMonth(currentDate)
            } else if (selectedType === "this-week") {
                start = startOfWeek(currentDate);
            } else if (selectedType === "last-6-month") {
                start = startOfMonth(subMonths(currentDate, 6));
            } else if (selectedType === "yearly") {
                start = startOfYear(currentDate);
            }
            const rs = await axios.get("/data", {
                params: {
                    ticker: ticker,
                    start: format(start, FORMAT_QUERY),
                    end: format(currentDate, FORMAT_QUERY),
                    // start: "2023/01/01",
                    // end: "2023/10/07"
                }
            });
            setHistories(rs.data);
            setLoading(false);
        }
        getHistoryByTicker();
    }, [selectedType, ticker]);

    const title = useMemo(() => {
        switch (selectedType) {
            case "last-week":
                const dateMonday = format(startDayOfWeek, FORMAT_DISPLAY);
                const currentDateF = format(currentDate, FORMAT_DISPLAY);
                return `Last Week ${dateMonday} - ${currentDateF}`
            case "last-month":
                const s = format(startLastMonth, FORMAT_DISPLAY);
                const e = format(currentDate, FORMAT_DISPLAY);
                return `Last Month ${s} - ${e}`
            case "this-month":
                const t = format(startOfMonth(currentDate), FORMAT_DISPLAY);
                const d = format(currentDate, FORMAT_DISPLAY);
                return `This Month ${t} - ${d}`
            case "this-week":
                const c = format(startOfWeek(currentDate), FORMAT_DISPLAY);
                const b = format(currentDate, FORMAT_DISPLAY);
                return `This Week ${c} - ${b}`

            case "last-6-month":
                const ch = format(startOfMonth(subMonths(currentDate, 6)), FORMAT_DISPLAY);
                const bj = format(currentDate, FORMAT_DISPLAY);
                return `Last 6 Month ${ch} - ${bj}`;

            case "yearly":
                const hh = format(startOfYear(currentDate), FORMAT_DISPLAY);
                const gg = format(currentDate, FORMAT_DISPLAY);
                return `Last 6 Month ${hh} - ${gg}`
            default:
                return "";
        }
    }, [selectedType]);

    const buildBgTr = useCallback((h: IHistoryResponse): CSSProperties => {
        if (!info) return {};
        const closed = compareType === "current" ? info?.currentPrice || "0" : "0";

        if (parseFloat(closed).toFixed(2) === h.adjclose.toFixed(2)) { // light
            return { backgroundColor: "#f0f2f5" }
        }

        if (parseFloat(parseFloat(closed).toFixed(2)) > h.adjclose) { // danger
            const per = ((parseFloat(closed) - h.adjclose) * 10);
            return { color: per > 0.6 ? "#ffffff" : "#333333", backgroundColor: `rgb(239 83 80 / ${per >= 1 ? 1 : per.toFixed(2)})` }
        }

        if (parseFloat(parseFloat(closed).toFixed(2)) < h.adjclose) { // success
            const per = ((h.adjclose - parseFloat(closed)) * 10);
            return { color: per > 0.6 ? "#ffffff" : "#333333", backgroundColor: `rgb(37 179 114 / ${per >= 1 ? 1 : per.toFixed(2)}) ` };
        }

        return {};
    }, [compareType, info]);

    useEffect(() => {
        let date: Date;
        if (specificDay) {
            date = new Date(specificDay);
        }
        const his = [...histories];
        let rs: IHistoryResponse[] = [];
        if (!info) rs = his;
        if (isGrow) {
            rs = his.filter((x) => x.adjclose > parseFloat(parseFloat(info?.currentPrice || "0").toFixed(2)))
        } else {
            rs = his;
        }

        rs = rs.filter((x) =>
                isInDay(new Date(x.date), "MON") ||
                isInDay(new Date(x.date), "TUES") ||
                isInDay(new Date(x.date), "WED") ||
                isInDay(new Date(x.date), "THUR") ||
                isInDay(new Date(x.date), "FRI")
            )
        if (specificDay)
            rs = rs.filter((x) => isSameDay(new Date(x.date), new Date(date)))

        setFilterred(rs);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isGrow, histories, info, specificDay, daysFilter]);

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

    }

    const expectedTrated = useMemo(() => {
        if (histories.length > 0) {
            const sum = histories.map((x) => x.adjclose).reduce((total, item) => total + item);
            return (sum / histories.length).toFixed(2);
        }
        return 0;
    }, [histories])

    const max = useMemo(() => {
        if (histories.length > 0) {
            const rs = Math.max(...histories.map((x) => x.adjclose));
            return rs;
        }
        return 0;
    }, [histories])

    const min = useMemo(() => {
        if (histories.length > 0) {
            const rs = Math.min(...histories.map((x) => x.adjclose));
            return rs;
        }
        return 0;
    }, [histories])


    return (
        <div className="card">
            <div className="card-header">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h5>Stock History comparing with {compareType === "current" ? "Current" : "Previous"} {info?.currentPrice}</h5>
                    </div>
                    <div>

                    </div>
                    <div className="list-buttons align-items-center d-flex">
                        <span className="d-flex align-items-center mr-1 cursor-pointer" onClick={() => setIsGrow(!isGrow)}>
                            <span>Grow  {isGrow && <span>({filterred.length}/{histories.length})</span>} </span>
                            <input checked={isGrow} type="checkbox" className="ml-1" />
                        </span>
                        <button
                            onClick={() => {
                                setSelectedType("last-week");
                            }}
                            className={`btn btn-${selectedType === "last-week" ? "primary" : "light"} d-flex align-item-center`}>
                            <span>Last Week</span> {loading && selectedType === "last-week" && <i className="ph-light ph-spinner ph-sm-size spinner ml-2"></i>}
                        </button>
                        <button
                            onClick={() => {
                                setSelectedType("last-month");
                            }}
                            className={`btn btn-${selectedType === "last-month" ? "primary" : "light"} d-flex align-item-center`}>
                            <span>Last Month</span> {loading && selectedType === "last-month" && <i className="ph-light ph-spinner ph-sm-size spinner ml-2"></i>}
                        </button>
                        <button
                            onClick={() => {
                                setSelectedType("this-week");
                            }}
                            className={`btn btn-${selectedType === "this-week" ? "primary" : "light"} d-flex align-item-center`}>
                            <span>This Week</span> {loading && selectedType === "this-week" && <i className="ph-light ph-spinner ph-sm-size spinner ml-2"></i>}
                        </button>
                        <button
                            onClick={() => {
                                setSelectedType("this-month");
                            }}
                            className={`btn btn-${selectedType === "this-month" ? "primary" : "light"} d-flex align-item-center`}>
                            <span>This Month</span> {loading && selectedType === "this-month" && <i className="ph-light ph-spinner ph-sm-size spinner ml-2"></i>}
                        </button>

                        <button
                            onClick={() => {
                                setSelectedType("last-6-month");
                            }}
                            className={`btn btn-${selectedType === "last-6-month" ? "primary" : "light"} d-flex align-item-center`}>
                            <span>Last 6 Month</span> {loading && selectedType === "last-6-month" && <i className="ph-light ph-spinner ph-sm-size spinner ml-2"></i>}
                        </button>

                        <button
                            onClick={() => {
                                setSelectedType("yearly");
                            }}
                            className={`btn btn-${selectedType === "yearly" ? "primary" : "light"} d-flex align-item-center`}>
                            <span>This Year</span> {loading && selectedType === "yearly" && <i className="ph-light ph-spinner ph-sm-size spinner ml-2"></i>}
                        </button>
                        <i className="ph-light ph-gear ml-1 cursor-pointer ph-sm-size"></i>
                    </div>
                </div>

            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table text-nowrap">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Date Time</th>
                                <th>Open</th>
                                <th>Close</th>
                                <th>High</th>
                                <th>Low</th>
                                <th>Adj Close</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="table-light">
                                <td className="d-flex align-items-center"
                                    colSpan={7}>
                                    {title}
                                    {loading && <i className="ph-light ph-spinner ph-sm-size spinner ml-2"></i>}
                                    <span className="text-primary ml-2">Expected: {expectedTrated}</span>
                                    <span className="text-success ml-2">Max: {max.toFixed(2)}</span>
                                    <span className="text-danger ml-2">Min: {min.toFixed(2)}</span>
                                    <input placeholder={format(currentDate, "yyyy/MM/dd")} style={{ minWidth: 150 }} type="text" onChange={e => setSpecificDate(e.target.value)} className="form-control ml-2" />
                                </td>
                            </tr>
                    
                            <tr className="table-light">
                                <td colSpan={7} className="d-flex">
                                    <div className="d-flex align-items-center mr-2 cursor-pointer"
                                        onClick={() => {
                                            let days = [...daysFilter];
                                            if (days.includes("MON")) {
                                                days = days.filter((x) => x !== "MON")
                                            } else {
                                                days = ["MON", ...days];
                                            }
                                            setDaysFilter(days);
                                        }}
                                    >
                                        <span>Monday</span>
                                        <input checked={daysFilter.includes("MON")} type="checkbox" className="ml-1" />
                                    </div>
                                    <div className="d-flex align-items-center mr-2 cursor-pointer"
                                    onClick={() => {
                                        let days = [...daysFilter];
                                        if (days.includes("TUES")) {
                                            days = days.filter((x) => x !== "TUES")
                                        } else {
                                            days = ["TUES", ...days];
                                        }
                                        setDaysFilter(days);
                                    }}>
                                        <span>Tuesday</span>
                                        <input checked={daysFilter.includes("TUES")} type="checkbox" className="ml-1" />
                                    </div>
                                    <div className="d-flex align-items-center mr-2 cursor-pointer"
                                     onClick={() => {
                                        let days = [...daysFilter];
                                        if (days.includes("WED")) {
                                            days = days.filter((x) => x !== "WED")
                                        } else {
                                            days = ["WED", ...days];
                                        }
                                        setDaysFilter(days);
                                    }}>
                                        <span>Wed</span>
                                        <input checked={daysFilter.includes("WED")} type="checkbox" className="ml-1" />
                                    </div>
                                    <div className="d-flex align-items-center mr-2 cursor-pointer" 
                                    onClick={() => {
                                        let days = [...daysFilter];
                                        if (days.includes("THUR")) {
                                            days = days.filter((x) => x !== "THUR")
                                        } else {
                                            days = ["THUR", ...days];
                                        }
                                        setDaysFilter(days);
                                    }}>
                                        <span>Thur</span>
                                        <input checked={daysFilter.includes("THUR")} type="checkbox" className="ml-1" />
                                    </div>
                                    <div className="d-flex align-items-center mr-2 cursor-pointer" onClick={() => {
                                        let days = [...daysFilter];
                                        if (days.includes("FRI")) {
                                            days = days.filter((x) => x !== "FRI")
                                        } else {
                                            days = ["FRI", ...days];
                                        }
                                        setDaysFilter(days);
                                    }}>
                                        <span>Fri</span>
                                        <input checked={daysFilter.includes("FRI")} type="checkbox" className="ml-1" />
                                    </div>
                                </td>
                            </tr>

                            {filterred.length === 0 && (
                                <tr className="table-light bg-light">
                                    <td className="d-flex align-items-center"
                                        colSpan={7}>
                                        No Data
                                    </td>
                                </tr>
                            )}


                            {filterred.map((h) => {
                                return <tr style={buildBgTr(h)} key={format(new Date(h.date), "dd/MM/yyyy HH:mm:ss")}>
                                    <td>{format(new Date(h.date), "EEEE")}</td>
                                    <td>{format(new Date(h.date), "dd/MM/yyyy HH:mm:ss")}</td>
                                    <td>{h.open.toFixed(2)}</td>
                                    <td>{h.close.toFixed(2)}</td>
                                    <td>{h.high.toFixed(2)}</td>
                                    <td>{h.low.toFixed(2)}</td>
                                    <td>{parseFloat(h.adjclose?.toString()).toFixed(2)}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default StockHistory;
