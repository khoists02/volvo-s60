import React, { FC, useEffect, useState } from "react";
import { ITickerInfo } from "../types/ticker";

interface IBidAndAskPrice {
  ticker?: ITickerInfo;
  loading: boolean;
}

export const BidAndAskPrice: FC<IBidAndAskPrice> = ({ ticker, loading }) => {
  const [currentTicker, setCurrentTicker] = useState<ITickerInfo | null>(null);
  useEffect(() => {
    setCurrentTicker(ticker as ITickerInfo);
  }, [ticker]);
  return (
    <div className="card">
      <div className="card-header d-flex">
        <h5 className="title">Bid v Ask</h5>
        {loading && (
          <i className="ph-light ph-sm-size ph-spinner spinner mr-1"></i>
        )}
      </div>
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <div
            className={`bid flex-1 mr-2 ${
              currentTicker?.bid !== 0 &&
              currentTicker?.bidSize !== undefined &&
              currentTicker?.askSize !== undefined &&
              currentTicker?.bidSize > currentTicker?.askSize
                ? "bg-success text-white"
                : ""
            }`}
          >
            <div className="">
              <span className="badge badge-secondary">Buyer</span>
              <span className="ml-2">{currentTicker?.bid}</span>
            </div>

            <div className="m-b-xxs">
              <span>Bid Size</span>
              <span className="ml-2">{currentTicker?.bidSize}</span>
            </div>

            <div>
              <p>
                Giá "Bid" thể hiện mức giá tối đa mà người mua sẵn sàng trả cho
                một cổ phiếu hoặc chứng khoán khác
              </p>
              {(currentTicker?.bid as number) > 0 && (
                <p className="text-warning">
                  Tips: Nếu Bid có giá trị hãy luôn đặt giá mua dưới giá Bid Max{" "}
                  {currentTicker?.bid}
                </p>
              )}
            </div>
          </div>
          <div
            className={`bid flex-1 ml-2 ${
              currentTicker?.ask !== 0 &&
              currentTicker?.bidSize !== undefined &&
              currentTicker?.askSize !== undefined &&
              currentTicker?.askSize > currentTicker?.bidSize
                ? "bg-success text-white"
                : ""
            }`}
          >
            <div className="">
              <span className="badge badge-primary">Seller</span>
              <span className="ml-2">{currentTicker?.ask}</span>
            </div>

            <div className="m-b-xxs">
              <span>Ask Size</span>
              <span className="ml-2">{currentTicker?.askSize}</span>
            </div>

            <div>
              <p>
                Giá "Ask" thể hiện mức giá tối thiểu mà người bán sẵn sàng chấp
                nhận để có được mức bảo đảm tương tự.
              </p>
              {(currentTicker?.ask as number) > 0 && (
                <p className="text-warning">
                  Tips: Nếu Ask có giá trị hãy luôn đặt giá mua lớn hơn giá Ask
                  Min {currentTicker?.ask}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
