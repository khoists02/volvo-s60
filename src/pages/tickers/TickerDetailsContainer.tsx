/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useState, useEffect, useRef } from "react";
import TickerInfo from "../../components/TickerInfo";
import { ITickerInfo } from "../../types/ticker";
import StockHistory from "../../components/StockHistory";
import { useParams } from "react-router-dom";
import DailyStock from "../../components/DailyStock";
import { HOLIDAYS } from "../../constants";
import format from "date-fns/format";
import { useSelector } from "react-redux";
import { IRootState } from "../../config/reducers";
import { useAppDispatch } from "../../config/store";
import { getTickerInfo } from "../../reducers/ducks/operators/notificationOperator";
// import { BidAndAskPrice } from "../../components/BidAndAksPrice";
// import axios from "axios";
// import { IBidAsk } from "../../types/notification";
import { New } from "../../components/New";
import { CashFlow } from "../../components/CashFlow";
import { getAccount } from "../settings/ducks/operators";
import { ErrorAlert } from "../../components/ErrorAlert";
import { DailyActions } from "../../reducers/ducks/slices/dailySlice";
import { TickerIcon } from "../../components/TickerIcon";

const TickerDetails: FC = () => {
  const dispatch = useAppDispatch();
  const tickerPr = useParams();
  const id = tickerPr.id;
  const timer = useRef<NodeJS.Timer | null>(null);
  const [tickerStr, setTickerStr] = useState(id?.toUpperCase());
  const current = new Date();
  const [hour, setHour] = useState(current.getHours());
  const [ticker, setTicker] = useState<ITickerInfo | undefined>(undefined);
  const {
    ticker: tickerInfo,
    loading,
    error,
  } = useSelector((state: IRootState) => state.dailyReducer);
  useEffect(() => {
    setTicker({
      ...tickerInfo,
      icon: <TickerIcon size="lg" symbol={tickerInfo?.symbol as string} />,
    });
  }, [tickerInfo]);

  useEffect(() => {
    dispatch(getTickerInfo(tickerStr as string));
    dispatch(getAccount(tickerStr as string));
    timer.current = setInterval(
      () => {
        // eslint-disable-next-line no-console
        console.log("current hour", hour);
        setHour(new Date().getHours());
        dispatch(getTickerInfo(tickerStr as string));
      },
      1000 * 60 * 5, // 1mn
    );

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickerStr, hour]);
  return (
    <div className="row">
      {error && (
        <div className="col-md-12">
          <ErrorAlert
            message={`Ticker ${tickerStr} ${error}`}
            onClose={() => dispatch(DailyActions.clearEr())}
          />
        </div>
      )}

      <div className="col-md-12">
        <TickerInfo
          ticker={ticker}
          loading={loading}
          reload={() => {
            dispatch(getTickerInfo(tickerStr as string));
          }}
        />
      </div>
      {!HOLIDAYS.includes(format(new Date(), "yyyy-MM-dd")) && (
        <div className="col-md-12 m-tb-sm">
          <DailyStock ticker={tickerStr || ""} />
        </div>
      )}
      {/* TODO: // comment */}
      {/* <div className="col-md-12">
        <BidAndAskPrice loading={loading} ticker={ticker} />
      </div> */}

      <div className="col-md-12">
        <StockHistory info={ticker} ticker={tickerStr || ""} />
      </div>

      <div className="col-md-12">
        <CashFlow ticker={tickerStr as string} />
      </div>

      <div className="col-md-12">
        <New ticker={tickerStr as string} />
      </div>
    </div>
  );
};

export default TickerDetails;
