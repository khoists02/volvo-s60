import React, { FC, useState, useEffect, useRef } from "react";
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
import { FormModal } from "../../components/FormModal";
import axios from "axios";
import { ConfirmDeleteModal } from "../../components/ConfirmDeleteModal";

const FavoriteContainer: FC = () => {
  const navigate = useNavigate();
  const timer = useRef<NodeJS.Timer | null>(null);
  const { entities, loading } = useSelector(
    (state: IRootState) => state.historyReducer,
  );
  const [favorites, setFavorites] = useState<ITickerInfo[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const dispatch = useAppDispatch();
  const [selectedId, setSelectedId] = useState("");
  const [newTicker, setNewTicker] = useState("");
  useEffect(() => {
    dispatch(getFavorites());
  }, [dispatch]);

  useEffect(() => {
    timer.current = setInterval(
      () => {
        dispatch(getFavorites());
      },
      1000 * 60 * 5, // 5mn
    );

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (entities) setFavorites(entities);
  }, [entities]);

  const per = (item: ITickerInfo) => {
    return `${(
      ((parseFloat(item.currentPrice) - parseFloat(item.previousClose)) /
        parseFloat(item.previousClose)) *
      100
    ).toFixed(2)}%`;
  };

  const createModalForm = (): React.ReactElement => {
    return (
      <div className="form-group row align-items-center">
        <div className="form-label col-md-3">
          <label htmlFor="">Ticker</label>
        </div>
        <div className="form-label col-md-5">
          <input
            type="text"
            className="form-control"
            value={newTicker}
            onChange={(e) => setNewTicker(e.target.value)}
            name="newTicker"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="row">
      {showConfirmDelete && (
        <ConfirmDeleteModal
          show={showConfirmDelete}
          onClose={() => setShowConfirmDelete(false)}
          onConfirm={async () => {
            if (!selectedId) return;
            try {
              await axios.delete("/favorites?id=" + selectedId);
              dispatch(getFavorites());
              setShowConfirmDelete(false);
            } catch (error) {
              // eslint-disable-next-line no-console
              console.log("error", error);
              setShowConfirmDelete(false);
            }
          }}
        />
      )}
      {showAddModal && (
        <FormModal
          size="lg"
          show={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setNewTicker("");
          }}
          onConfirm={async () => {
            try {
              await axios.post("/favorites", { ticker: newTicker });
              setShowAddModal(false);
              dispatch(getFavorites());
            } catch (error) {
              // eslint-disable-next-line no-console
              console.log("error", error);
              setShowAddModal(false);
            }
          }}
          okButton="Add"
          cancelButton="Cancel"
          title="Add New Favorite"
          disabledConfirmBtn={newTicker === ""}
          children={createModalForm()}
        />
      )}
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5>Favorites</h5>
            <div className="d-flex">
              <button
                className={`btn btn-primary ${
                  loading ? "cursor-not-allowed" : "cursor-pointer"
                } d-flex align-items-center`}
                onClick={() => {
                  if (!loading) dispatch(getFavorites());
                }}
              >
                {loading && (
                  <i className="ph-light ph-spinner ph-xs-size spinner mr-2"></i>
                )}
                <span>Reload</span>
              </button>

              <button
                className="btn btn-primary ml-2"
                onClick={() => setShowAddModal(true)}
              >
                Add New
              </button>
            </div>
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
                          <div className={`${loading ? "skeleton-box" : ""}`}>
                            <span>
                              {" "}
                              {parseFloat(f.currentPrice).toFixed(3)}
                              <span className="ml-1">({per(f)})</span>
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className={`${loading ? "skeleton-box" : ""}`}>
                            <span>
                              {" "}
                              {parseFloat(f.previousClose).toFixed(3)}
                            </span>
                          </div>
                        </td>
                        <td>
                          {convertToInternationalCurrencySystem(f.marketCap)}
                        </td>
                        <td>
                          <div className={`${loading ? "skeleton-box" : ""}`}>
                            <span>
                              {" "}
                              {f.bid} ({f.bidSize})
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className={`${loading ? "skeleton-box" : ""}`}>
                            <span>
                              {" "}
                              {f.ask} ({f.askSize})
                            </span>
                          </div>
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

                          <i
                            className="ph-light ph-sm-size ph-currency-circle-dollar cursor-pointer ml-2"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              navigate(`/bidasks/${f.symbol}`);
                            }}
                          ></i>

                          <i
                            className="ph-light ph-sm-size ph-trash
                            cursor-pointer ml-2 text-danger"
                            onClick={async (e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedId(f.uuid || "");
                              setShowConfirmDelete(true);
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
