/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../config/store";
import { getBidAskNoti } from "../../reducers/ducks/operators/notificationOperator";
import { IRootState } from "../../config/reducers";
import { useSelector } from "react-redux";
import { IBidAsk } from "../../types/notification";
import format from "date-fns/format";
import axios from "axios";
import { ConfirmDeleteModal } from "../../components/ConfirmDeleteModal";

const initModel: IBidAsk = {
  ask: 0,
  bid: 0,
  bidSize: 0,
  askSize: 0,
  ticker: "",
  updatedAt: "",
};

const BidAsksController: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const tickerPr = useParams();
  const [data, setData] = useState<IBidAsk>(initModel);
  const [filtered, setFiltered] = useState<IBidAsk[]>([]);
  const id = tickerPr.id;
  const [tickerStr, setTickerStr] = useState(id?.toUpperCase());
  const [createLoading, setCreateLoading] = useState(false);
  const [isToday, setIsToday] = useState(true);
  const [isCreate, setIsCreate] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const { bidasks, loadingBidAsk } = useSelector(
    (state: IRootState) => state.notiReducer,
  );

  useEffect(() => {
    if (isToday) {
      const dateFormat = format(new Date(), "yyyy-MM-dd");
      const rs: IBidAsk[] = [];
      const clone = [...bidasks];
      clone.forEach((cl) => {
        const date = cl.updatedAt?.split(" ")[0];
        if (date === dateFormat) rs.push(cl);
      });
      setFiltered(rs);
    } else {
      setFiltered(bidasks);
    }
  }, [bidasks, isToday]);

  useEffect(() => {
    dispatch(getBidAskNoti(tickerStr as string));
    setData({
      ...data,
      ticker: tickerStr as string,
      updatedAt: format(new Date(), "yyyy-MM-dd HH:mm"),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, tickerStr]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    setData({ ...data, [name]: value });
  };

  const handleSave = async () => {
    try {
      setCreateLoading(true);
      await axios.post("/bidasks", {
        ...data,
        updatedAt: format(new Date(), "yyyy-MM-dd HH:mm"),
      });
      setCreateLoading(false);
      setIsCreate(false);
      dispatch(getBidAskNoti(tickerStr as string));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log({ error });
      setCreateLoading(false);
    }
  };

  return (
    <div className="row">
      {showConfirmDelete && (
        <ConfirmDeleteModal
          show={showConfirmDelete}
          onClose={() => setShowConfirmDelete(false)}
          onConfirm={() => {}}
        />
      )}
      <div className="col-md-12 mb-1">
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between">
            <h5 className="title">
              Bid v Asks {isCreate ? "Create" : "Listing"}
            </h5>
            {!isCreate && (
              <div className="d-flex">
                <button
                  onClick={() => setIsToday(!isToday)}
                  className={`ml-2 btn btn-${
                    !isToday ? "primary" : "light"
                  } text-${!isToday ? "white" : ""} cursor-pointer`}
                >
                  All
                </button>
                <button
                  className={`ml-2 btn btn-${
                    isToday ? "primary" : "light"
                  } text-${isToday ? "white" : ""} cursor-pointer`}
                  onClick={() => setIsToday(!isToday)}
                >
                  Today
                </button>
                <button
                  className="ml-2 btn btn-primary text-white cursor-pointer"
                  onClick={() => setIsCreate(true)}
                >
                  Create
                </button>
                <button
                  className="cursor-pointer btn btn-primary ml-2 d-flex align-items-center"
                  onClick={() => {
                    dispatch(getBidAskNoti(tickerStr as string));
                  }}
                >
                  <span>Reload</span>
                  {loadingBidAsk && (
                    <i className="ph-light ph-spinner ml-2 ph-xs-size spinner"></i>
                  )}
                </button>
                <button
                  className="cursor-pointer btn btn-light ml-2 d-flex align-items-center"
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  <span>Back</span>
                </button>
              </div>
            )}
          </div>
          <div className="card-body">
            {isCreate && (
              <div className="row">
                <div className="col-md-12 mb-1">
                  <div className="from-group row">
                    <div className="col-md-2 form-label">Bid</div>
                    <div className="col-md-6">
                      <input
                        name="bid"
                        type="number"
                        onChange={handleInputChange}
                        value={data.bid}
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-12 mb-1">
                  <div className="from-group row">
                    <div className="col-md-2 form-label">Bid Size</div>
                    <div className="col-md-6">
                      <input
                        type="number"
                        name="bidSize"
                        value={data.bidSize}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-12 mb-1">
                  <div className="from-group row">
                    <div className="col-md-2 form-label">Ask</div>
                    <div className="col-md-6">
                      <input
                        type="number"
                        name="ask"
                        value={data.ask}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-12 mb-1">
                  <div className="from-group row">
                    <div className="col-md-2 form-label">Ask Size</div>
                    <div className="col-md-6">
                      <input
                        type="number"
                        value={data.askSize}
                        onChange={handleInputChange}
                        name="askSize"
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-12 mb-1 d-flex justify-content-end">
                  <button
                    className="btn btn-light"
                    type="button"
                    onClick={() => setIsCreate(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary ml-1"
                    type="button"
                    onClick={handleSave}
                  >
                    Create
                  </button>
                </div>
              </div>
            )}
            {!isCreate && (
              <div className="table-responsive">
                <table className="table text-nowrap">
                  <thead>
                    <tr>
                      <th>Ticker</th>
                      <th>Bid</th>
                      <th>Ask</th>
                      <th>Updated At</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item) => {
                      return (
                        <tr key={item.id}>
                          <td>{item.ticker}</td>
                          <td>
                            {item.bid} x {item.bidSize}
                          </td>
                          <td>
                            {item.ask} x {item.askSize}
                          </td>
                          <td>{item.updatedAt}</td>
                          <td>
                            <i
                              className="ph-light ph-sm-size ph-trash
                            cursor-pointer ml-2 text-danger"
                              onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidAsksController;
