import React, { FC, useEffect, useState } from "react";
import { ITickerInfo } from "../types/ticker";
import { convertToInternationalCurrencySystem } from "../helpers";

const TickerInfo: FC<{ ticker?: ITickerInfo; reload?: () => void; loading: boolean }> = ({
    ticker,
    loading,
    reload,
}) => {
    const currentDate = new Date();
    const [percent, setPercent] = useState<number>(0);
    useEffect(() => {
        if (ticker) {
            const rs = (parseFloat(ticker.currentPrice) - parseFloat(ticker.previousClose)) / parseFloat(ticker.previousClose) * 100;
            setPercent(rs);
        }
    }, [ticker]);
    return (
        <div className="card">
            <div className="card-header d-sm-flex align-items-sm-center py-sm-0">
                <h5 className="py-sm-2 my-sm-1">{ticker?.shortName}</h5>
               {loading && ticker && <i className="ph-light ph-sm-size ph-spinner spinner"></i>} 
            </div>

            <div className="card-body d-lg-flex align-items-lg-center justify-content-lg-between flex-lg-wrap">
                <div className="d-flex align-items-center mb-3 mb-lg-0">
                    <div id="tickets-status">
                        {ticker?.icon}
                    </div>
                    <div className="ml-1">
                        <div className="d-flex align-items-center">
                            <h5 className="mb-0">{ticker?.currentPrice}</h5>
                            <i className={`ph-light ph-arrow-${percent >= 0 ? "up": "down"} text-${percent >= 0 ? "success": "danger"} fs-base lh-base align-top p-lr-xxs`}></i>
                            <span className={`text-${percent >= 0 ? "success": "danger"}`}>
                                {percent >= 0 ? "+": ""}{percent.toFixed(2)}%
                            </span>
                        </div>

                        <div className="">
                            <span className="">Prev Close</span>
                            <span className="ml-2">{ticker?.previousClose}</span>
                        </div>
                        <div className="d-flex align-items-center">
                            <span className="d-inline-block bg-success rounded-pill p-1 mr-1"></span>
                            <span className="text-muted">{currentDate.toDateString()}</span>
                            <span className="ml-1 cursor-pointer" onClick={() => {
                                if (reload) reload();
                            }}>
                                <i className=" ph-light ph-sm-size ph-arrow-clockwise"></i>
                                </span>
                        </div>

                    </div>
                </div>

                <div className="d-flex align-items-center mb-3 mb-lg-0">
                    <div className="bg-opacity-10 text-primary lh-1 rounded-pill p-2">
                        <i className="ph-light ph-lg-size ph-currency-circle-dollar"></i>
                    </div>
                    <div className="ml-1">
                        <h5 className="mb-0">{convertToInternationalCurrencySystem(ticker?.marketCap)}</h5>
                        <span className="text-muted">Market cap</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TickerInfo;
