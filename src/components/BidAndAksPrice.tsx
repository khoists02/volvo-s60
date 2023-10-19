import React, { FC, useEffect, useMemo, useState } from "react";
import { ITickerInfo } from "../types/ticker";
import { useAppDispatch } from "../config/store";
import { getTickerInfo } from "../reducers/ducks/operators/notificationOperator";

interface IBidAndAskPrice {
  ticker?: ITickerInfo;
  loading: boolean;
}

export const BidAndAskPrice: FC<IBidAndAskPrice> = ({ ticker, loading }) => {
  const [currentTicker, setCurrentTicker] = useState<ITickerInfo | null>(null);
  const dispatch = useAppDispatch();
  const [hide, setHide] = useState(false);
  useEffect(() => {
    setCurrentTicker(ticker as ITickerInfo);
  }, [ticker]);

  const spread = useMemo(() => {
    if (!ticker) return 0;

    if (ticker?.ask === 0 || ticker.bid === 0) return 0;

    let rs = 0;

    const ask = ticker?.ask || 0;
    const bid = ticker?.bid || 0;

    rs = (ask - bid) / ask;

    return rs * 100;
  }, [ticker]);

  const keyIn = useMemo(() => {
    if (!ticker) return 0;

    if (ticker?.ask === 0 || ticker?.bid === 0) return 0;
    const bid = ticker.bid || 0;
    const val = (spread / 100) * bid;
    const rs = bid - val;
    return rs;
  }, [ticker, spread]);

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between">
        <div className="d-flex">
          <h5 className="title">Bid v Ask</h5>
          <span
            className="badge badge-primary d-flex cursor-pointer align-items-center ml-1"
            onClick={() => {
              dispatch(getTickerInfo(ticker?.symbol as string));
            }}
          >
            <span className="">Reload</span>
            {loading && (
              <i className="ph-light ph-xs-size ph-spinner spinner ml-1"></i>
            )}
          </span>
          {spread > 0 && (
            <span
              className={`ml-1 d-flex align-items-center badge badge-${
                spread > 1 ? "danger" : "success"
              } text-white`}
            >
              <span>Spread </span>
              <span className="ml-1">{spread.toFixed(2)}%</span>
            </span>
          )}

          {keyIn > 0 && (
            <span
              className={`ml-1 d-flex align-items-center badge badge-success text-white`}
            >
              <span>Key In </span>
              <span className="ml-1">{keyIn}</span>
            </span>
          )}
        </div>
        <i
          onClick={() => setHide(!hide)}
          className={`cursor-pointer ph-light ph-sm-size ph-arrow-${
            !hide ? "right" : "down"
          } font-weight`}
        ></i>
      </div>
      {!hide && (
        <div className="card-body animated fadeInUp">
          <div className="d-flex justify-content-between">
            <div
              className={`bid flex-1 mr-2 ${
                currentTicker?.bid !== 0 &&
                currentTicker?.bidSize !== undefined &&
                currentTicker?.askSize !== undefined &&
                currentTicker?.bidSize > currentTicker?.askSize
                  ? "bg-success text-white p-3"
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
                  Giá "Bid" thể hiện mức giá tối đa mà người mua sẵn sàng trả
                  cho một cổ phiếu hoặc chứng khoán khác
                </p>
                {(currentTicker?.bid as number) > 0 && (
                  <p className="text-warning">
                    Tips: Nếu Bid có giá trị hãy luôn đặt giá mua dưới giá Bid
                    Max {currentTicker?.bid}
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
                  ? "bg-success text-white p-3"
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
                  Giá "Ask" thể hiện mức giá tối thiểu mà người bán sẵn sàng
                  chấp nhận để có được mức bảo đảm tương tự.
                </p>
                {(currentTicker?.ask as number) > 0 && (
                  <p className="text-warning">
                    Tips: Nếu Ask có giá trị hãy luôn đặt giá bán lớn hơn giá
                    Ask Min {currentTicker?.ask}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
