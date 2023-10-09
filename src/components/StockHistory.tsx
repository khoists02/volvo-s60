import React, { FC, useEffect, useMemo, useState } from "react";
import { subWeeks, startOfWeek, addDays, addHours, format } from "date-fns";
import axios from "axios";

export interface IStockHistory {
    type?: "last-week" | "this-week" | "last-month" | "this-month" | "range";
    ticker: string;
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

const FORMAT_QUERY = "yyyy/MM/dd";
const FORMAT_DISPLAY = "dd/MM/yyyy";

const currentDate = new Date();
const lastWeekFromCurrent = subWeeks(currentDate, 1);
const startDayOfWeek = addHours(startOfWeek(lastWeekFromCurrent, { weekStartsOn: 1 }), 0);
const fridayOfWeek = addHours(addDays(startDayOfWeek, 4), 23);
const satOfWeek = addHours(addDays(startDayOfWeek, 5), 23);
const StockHistory: FC<IStockHistory> = ({
    type = "last-week",
    ticker
}) => {
    const [histories, setHistories] = useState<IHistoryResponse[]>([]);
    useEffect(() => {
        const getHistoryByTicker = async () => {
            const rs = await axios.get("/data", {
                params: {
                    ticker: ticker,
                    start: format(startDayOfWeek, FORMAT_QUERY),
                    end: format(satOfWeek, FORMAT_QUERY),
                }
            });
            setHistories(rs.data);
        }
        getHistoryByTicker();
    }, [type, ticker]);
    const title = useMemo(() => {
        switch (type) {
            case "last-week":
                const dateMonday = format(startDayOfWeek, FORMAT_DISPLAY);
                const dateFriday = format(fridayOfWeek, FORMAT_DISPLAY);
                return `Last Week ${dateMonday} - ${dateFriday}`

            default:
                return "";
        }
    }, [type]);
    return (
        <div className="card">
            <div className="card-header">
                <div className="d-flex justify-content-between align-items-center">
                    <h5>Stock History</h5>
                    <div className="list-buttons">
                        <button className={`btn btn-${type === "last-week" ? "primary": "light"}`}>Last Week</button>
                        <button className="btn btn-light">Last Month</button>
                        <button className="btn btn-light">This Week</button>
                        <button className="btn btn-light">This Month</button>
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
                                return  <tr key={format(new Date(h.date), "dd/MM/yyyy HH:mm:ss")}>
                                    <td>{format(new Date(h.date), "EEEE")}</td>
                                    <td>{format(new Date(h.date), "dd/MM/yyyy HH:mm:ss")}</td>
                                    <td>{h.open}</td>
                                    <td>{h.close}</td>
                                    <td>{h.high}</td>
                                    <td>{h.low}</td>
                                    <td className="text-success">{parseFloat(h.adjclose.toString()).toFixed(2)}</td>
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
