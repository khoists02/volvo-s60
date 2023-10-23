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
  const id = tickerPr.id;
  const [tickerStr, setTickerStr] = useState(id?.toUpperCase());
  const [createLoading, setCreateLoading] = useState(false);

  const [isCreate, setIsCreate] = useState(false);

  const { bidasks, loadingBidAsk } = useSelector(
    (state: IRootState) => state.notiReducer,
  );

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
      <div className="col-md-12 mb-1">
        <div className="card">
          <div className="card-header d-flex align-items-center">
            <h5 className="title">
              Bid v Asks {isCreate ? "Create" : "Listing"}
            </h5>
            <span
              className="ml-1 badge badge-primary text-white cursor-pointer"
              onClick={() => setIsCreate(true)}
            >
              Create
            </span>

            <span
              className="cursor-pointer badge badge-primary ml-2 mr-2 d-flex align-items-center"
              onClick={() => {
                dispatch(getBidAskNoti(tickerStr as string));
              }}
            >
              <span>Reload</span>
              {loadingBidAsk && (
                <i className="ph-light ph-spinner ml-1 ph-xs-size spinner"></i>
              )}
            </span>

            <span
              className="cursor-pointer badge badge-light ml-1 d-flex align-items-center"
              onClick={() => {
                navigate(-1);
              }}
            >
              <span>Back</span>
            </span>
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
                      <th>Ask</th>
                      <th>Ask Size</th>
                      <th>Bid</th>
                      <th>Bid Size</th>
                      <th>Updated At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bidasks.map((item) => {
                      return (
                        <tr key={item.id}>
                          <td>{item.ticker}</td>
                          <td>{item.ask}</td>
                          <td>{item.askSize}</td>
                          <td>{item.bid}</td>
                          <td>{item.bidSize}</td>
                          <td>{item.updatedAt}</td>
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
