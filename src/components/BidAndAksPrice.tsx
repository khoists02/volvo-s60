import React, { FC, useMemo, useState } from "react";
import { useAppDispatch } from "../config/store";
import { getBidAskNoti } from "../reducers/ducks/operators/notificationOperator";

interface IBidAndAskPrice {
  bid: number;
  bidSize: number;
  ask: number;
  askSize: number;
  loading: boolean;
  ticker: string;
}

export const BidAndAskPrice: FC<IBidAndAskPrice> = ({
  bid,
  bidSize,
  ask,
  askSize,
  loading,
  ticker,
}) => {
  const dispatch = useAppDispatch();
  const [hide, setHide] = useState(false);
  const spread = useMemo(() => {
    return ((ask - bid) / ask) * 100;
  }, [bid, ask]);

  const keyIn = useMemo(() => {
    const val = (spread / 100) * bid;
    const rs = bid - val;
    return rs;
  }, [spread, bid]);

  const keyOut = useMemo(() => {
    const val = (spread / 100) * ask;
    const rs = ask + val;
    return rs;
  }, [spread, ask]);

  const timeToBuy = useMemo(() => {
    if (spread >= 0 && spread <= 5) {
      return (bidSize - askSize) / bidSize;
    }
    return 0;
  }, [spread, bidSize, askSize]);

  const timeToSell = useMemo(() => {
    if (spread >= 0 && spread <= 5) {
      return (askSize - bidSize) / askSize;
    }
    return 0;
  }, [spread, bidSize, askSize]);

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between">
        <div className="d-flex">
          <h5 className="title">Bid v Ask</h5>
          <span
            className="badge badge-primary d-flex cursor-pointer align-items-center ml-1"
            onClick={() => {
              dispatch(getBidAskNoti(ticker));
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
              <span className="ml-1">
                {spread.toFixed(2)}% - {(spread / 100).toFixed(2)}
              </span>
            </span>
          )}

          {keyIn > 0 && spread >= 0 && spread <= 5 && (
            <span
              className={`ml-1 d-flex align-items-center badge badge-success text-white`}
            >
              <span>Calculator KeyIn</span>
              <span className="ml-1">{keyIn.toFixed(2)}</span>
            </span>
          )}

          {keyOut > 0 && spread >= 0 && spread <= 5 && (
            <span
              className={`ml-1 d-flex align-items-center badge badge-danger text-white`}
            >
              <span>Calculator KeyOut</span>
              <span className="ml-1">{keyOut.toFixed(2)}</span>
            </span>
          )}

          {timeToBuy >= 0.5 && (
            <span className="ml-1 d-flex align-items-center badge badge-success text-white">
              Buy Now
            </span>
          )}

          {timeToSell >= 0.5 && (
            <span className="ml-1 d-flex align-items-center badge badge-danger text-white">
              Sell Now
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
            <div className={`bid flex-1 mr-2`}>
              <div className="">
                <span className="badge badge-success">Buyer</span>
                <span className="ml-2">{bid}</span>
              </div>

              <div className="m-b-xxs">
                <span>Bid Size</span>
                <span className="ml-2">{bidSize}</span>
              </div>

              <div>
                <p>
                  Giá "Bid" thể hiện mức giá tối đa mà người mua sẵn sàng trả
                  cho một cổ phiếu hoặc chứng khoán khác
                </p>
                {(bid as number) > 0 && (
                  <p className="text-warning">
                    Tips: Nếu Bid có giá trị hãy luôn đặt giá mua dưới giá Bid
                    Max {bid}
                  </p>
                )}
              </div>
            </div>
            <div className={`bid flex-1 ml-2 `}>
              <div className="">
                <span className="badge badge-danger">Seller</span>
                <span className="ml-2">{ask}</span>
              </div>

              <div className="m-b-xxs">
                <span>Ask Size</span>
                <span className="ml-2">{askSize}</span>
              </div>

              <div>
                <p>
                  Giá "Ask" thể hiện mức giá tối thiểu mà người bán sẵn sàng
                  chấp nhận để có được mức bảo đảm tương tự.
                </p>
                {(ask as number) > 0 && (
                  <p className="text-warning">
                    Tips: Nếu Ask có giá trị hãy luôn đặt giá bán lớn hơn giá
                    Ask Min {ask}
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
