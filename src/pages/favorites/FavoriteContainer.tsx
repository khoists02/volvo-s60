import React, { FC, useState, useEffect } from "react";
import { ITickerInfo } from "../../types/ticker";
import { useNavigate } from "react-router-dom";
import {
  convertToInternationalCurrencySystem,
  getStyleStock,
} from "../../helpers";
import { useAppDispatch } from "../../config/store";
import { getFavorites } from "../../reducers/ducks/operators/notificationOperator";
import { useSelector } from "react-redux";
import { IRootState } from "../../config/reducers";

const FavoriteContainer: FC = () => {
  const navigate = useNavigate();
  const { entities, loading } = useSelector(
    (state: IRootState) => state.historyReducer,
  );
  const [favorites, setFavorites] = useState<ITickerInfo[]>([]);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getFavorites());
  }, [dispatch]);

  useEffect(() => {
    setFavorites(entities);
  }, [entities]);

  const per = (item: ITickerInfo) => {
    return `${(
      ((parseFloat(item.currentPrice) - parseFloat(item.previousClose)) /
        parseFloat(item.previousClose)) *
      100
    ).toFixed(2)}%`;
  };

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5>Favorites</h5>

            <span
              className={`badge badge-primary ${
                loading ? "cursor-not-allowed" : "cursor-pointer"
              } d-flex align-items-center`}
              onClick={() => {
                if (!loading) dispatch(getFavorites());
              }}
            >
              {loading && (
                <i className="ph-light ph-spinner ph-sm-size spinner mr-2"></i>
              )}
              <span>Reload</span>
            </span>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table text-nowrap no-border">
                <thead>
                  <tr>
                    <th>
                      {loading && (
                        <i className="ph-light ph-spinner ph-sm-size spinner ml-2"></i>
                      )}
                    </th>
                    <th>Ticker</th>
                    <th>Current Price</th>
                    <th>Previous Price</th>
                    <th>Volume</th>
                    <th>Bid</th>
                    <th>Ask</th>
                    <th>Type</th>
                    <th>Recommendation Key</th>
                    <th></th>
                    {/* <th>Recommendation Target</th> */}
                  </tr>
                </thead>
                <tbody>
                  {favorites.map((f) => {
                    return (
                      <tr
                        style={getStyleStock(
                          parseFloat(f.currentPrice),
                          parseFloat(f.previousClose),
                        )}
                        onClick={() => navigate(`/tickers/${f.symbol}`)}
                        key={f.shortName}
                      >
                        <td>
                          {loading && (
                            <i className="ph-light ph-spinner ph-sm-size spinner ml-2"></i>
                          )}

                          {!loading && (
                            <i
                              className={`text-${
                                f.currentPrice > f.previousClose
                                  ? "success"
                                  : "danger"
                              } ph-light ph-sm-size ph-trend-${
                                f.currentPrice > f.previousClose ? "up" : "down"
                              }`}
                            ></i>
                          )}
                        </td>
                        <td>{f.shortName}</td>
                        <td>
                          {f.currentPrice}
                          <span className="ml-1">({per(f)})</span>
                        </td>
                        <td>{f.previousClose}</td>
                        <td>
                          {convertToInternationalCurrencySystem(f.marketCap)}
                        </td>
                        <td>
                          {f.bid} ({f.bidSize})
                        </td>
                        <td>
                          {f.ask} ({f.askSize})
                        </td>
                        <td>{f.industryDisp}</td>
                        <td>{f.recommendationKey}</td>
                        <td>
                          <i
                            className="ph-light ph-sm-size ph-calculator cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              // eslint-disable-next-line no-console
                              console.log("calculator function");
                            }}
                          ></i>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteContainer;
