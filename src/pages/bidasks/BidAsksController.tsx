/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../config/store";
import { getBidAskNoti } from "../../reducers/ducks/operators/notificationOperator";
import { IRootState } from "../../config/reducers";
import { useSelector } from "react-redux";

const BidAsksController: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const tickerPr = useParams();
  const id = tickerPr.id;
  const [tickerStr, setTickerStr] = useState(id?.toUpperCase());

  const { bidasks, loadingBidAsk } = useSelector(
    (state: IRootState) => state.notiReducer,
  );

  useEffect(() => {
    dispatch(getBidAskNoti(tickerStr as string));
  }, [dispatch, tickerStr]);
  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card">
          <div className="card-header d-flex align-items-center">
            <h5 className="title">Bid v Asks Listing</h5>
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
              className="cursor-pointer badge badge-light ml-2 mr-2 d-flex align-items-center"
              onClick={() => {
                navigate(-1);
              }}
            >
              <span>Back</span>
            </span>
          </div>
          <div className="card-body">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidAsksController;
