import React, { CSSProperties, FC, useCallback, useEffect, useMemo, useState } from "react";
import { subWeeks, startOfWeek, addDays, addHours, format } from "date-fns";
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
const startDayOfWeek = addHours(startOfWeek(lastWeekFromCurrent, { weekStartsOn: 1 }), 0);
const StockHistory: FC<IStockHistory> = ({
    ticker,
    info,
}) => {
    const [histories, setHistories] = useState<IHistoryResponse[]>([]);
    const [compareType, setCompareType] = useState<"current" | "prev">("current");
    const [selectedType, setSelectedType] = useState<"last-week" | "this-week" | "last-month" | "this-month" | "range">("last-week");
    useEffect(() => {
        const getHistoryByTicker = async () => {
            const rs = await axios.get("/data", {
                params: {
                    ticker: ticker,
                    start: format(startDayOfWeek, FORMAT_QUERY),
                    end: format(currentDate, FORMAT_QUERY),
                    // start: "2023/01/01",
                    // end: "2023/10/07"
                }
            });
            setHistories(rs.data);
        }
        getHistoryByTicker();
    }, [selectedType, ticker]);
    const title = useMemo(() => {
        switch (selectedType) {
            case "last-week":
                const dateMonday = format(startDayOfWeek, FORMAT_DISPLAY);
                const currentDateF = format(currentDate, FORMAT_DISPLAY);
                return `Last Week ${dateMonday} - ${currentDateF}`

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

    return (
        <div className="card">
            <div className="card-header">
                <div className="d-flex justify-content-between align-items-center">
                    <h5>Stock History</h5>
                    <div>

                    </div>
                    <div className="list-buttons align-items-center d-flex">
                        <span className="d-flex align-items-center mr-1">
                            <span>Up</span>
                            <input type="checkbox" className="ml-1" />
                        </span>
                        <button
                            onClick={() => {
                                setSelectedType("last-week");
                            }}
                            className={`btn btn-${selectedType === "last-week" ? "primary" : "light"}`}>
                            Last Week
                        </button>
                        <button
                            onClick={() => {
                                setSelectedType("last-month");
                            }}
                            className={`btn btn-${selectedType === "last-month" ? "primary" : "light"}`}>
                            Last Month
                        </button>
                        <button className="btn btn-light">This Week</button>
                        <button className="btn btn-light">This Month</button>
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
                                <th>Date</th>
                                <th>Open</th>
                                <th>Close</th>
                                <th>High</th>
                                <th>Low</th>
                                <th>Adj Close</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="table-light">
                                <td colSpan={7}>{title}</td>
                            </tr>
                            {histories.map((h) => {
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
