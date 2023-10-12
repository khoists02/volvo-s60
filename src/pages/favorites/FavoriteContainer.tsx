import axios from "axios";
import React, { FC, useState, useEffect, useRef } from "react";
import { ITickerInfo } from "../../types/ticker";
import { useNavigate } from "react-router-dom";

const FavoriteContainer: FC = () => {
    const navigate = useNavigate();
    const current = new Date();
    const hour: number = current.getHours();
    let timer = useRef<NodeJS.Timer | null>(null);
    const [loading, setLoading] = useState(false);
    const [favorites, setFavorites] = useState<ITickerInfo[]>([]);
    useEffect(() => {
        timer.current = setInterval(() => {
            if (hour >= 21) {
                getList();
            }
        }, 1000 * 30); // 10s, after 21h every day
        const getList = async () => {
            setLoading(true);
            const rs = await axios.get("/favorites", { params: { ticker: "BLND" } });
            setFavorites(rs.data.content || []);
            setLoading(false);
        }
        return () => {
            if (timer.current) clearInterval(timer.current)
        }
    }, [hour]);
    useEffect(() => {

        const getList = async () => {
            setLoading(true);
            const rs = await axios.get("/favorites", { params: { ticker: "BLND" } });
            setFavorites(rs.data.content || []);
            setLoading(false);
        }
        getList();
    }, []);

    const per = (item: ITickerInfo) => {

        return `${(((parseFloat(item.currentPrice) - parseFloat(item.previousClose)) / parseFloat(item.previousClose)) * 100).toFixed(2)}%`
    }

    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="card">
                    <div className="card-header">
                        <h5>Favorites</h5>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table text-nowrap">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Ticker</th>
                                        <th>Current Price</th>
                                        <th>Previous Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading && (

                                        <tr>
                                            <td colSpan={4}>
                                                <i className="ph-light ph-spinner ph-sm-size spinner ml-2"></i>
                                            </td>
                                        </tr>
                                    )}
                                    {favorites.map((f) => {
                                        return (
                                            <tr
                                                className={`bg-${f.currentPrice > f.previousClose ? "success" : "danger"} text-white`}
                                                onClick={() => navigate(`/histories/${f.symbol}`)} key={f.shortName}>
                                                <td>
                                                    <i className={`text-white ph-light ph-sm-size ph-trend-${f.currentPrice > f.previousClose ? "up" : "down"}`}></i>
                                                </td>
                                                <td>{f.shortName}</td>
                                                <td>{f.currentPrice}
                                                    <span className="ml-1">({per(f)})</span>
                                                </td>
                                                <td>{f.previousClose}</td>
                                            </tr>
                                        )
                                    })}

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FavoriteContainer;
