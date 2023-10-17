/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useState, useEffect, useRef } from "react";
import TickerInfo from "../../components/TickerInfo";
import { ITickerInfo } from "../../types/ticker";
import axios from "axios";
import BlendIcon from "../../parts/icons/Bend";
import StockHistory from "../../components/StockHistory";
import { useParams } from "react-router-dom";
import { addDays } from "date-fns";
import DailyStock from "../../components/DailyStock";
import { HOLIDAYS } from "../../constants";
import format from "date-fns/format";
import { useSelector } from "react-redux";
import { IRootState } from "../../config/reducers";
import { useAppDispatch } from "../../config/store";
import { getTickerInfo } from "../../reducers/ducks/operators/notificationOperator";
import { BidAndAskPrice } from "../../components/BidAndAksPrice";

const TickerDetails: FC = () => {
  const dispatch = useAppDispatch();
  const tickerPr = useParams();
  const id = tickerPr.id;
  const timer = useRef<NodeJS.Timer | null>(null);
  const [tickerStr, setTickerStr] = useState(id?.toUpperCase());
  const current = new Date();
  const [hour, setHour] = useState(current.getHours());
  const [ticker, setTicker] = useState<ITickerInfo | undefined>(undefined);
  const { ticker: tickerInfo, loading } = useSelector(
    (state: IRootState) => state.dailyReducer,
  );
  useEffect(() => {
    setTicker({ ...tickerInfo, icon: <BlendIcon width={70} height={70} /> });
  }, [tickerInfo]);
  useEffect(() => {
    dispatch(getTickerInfo(tickerStr as string));
    timer.current = setInterval(
      () => {
        // eslint-disable-next-line no-console
        console.log("current hour", hour);
        setHour(new Date().getHours());
        if (hour >= 20 || (hour >= 0 && hour <= 5))
          dispatch(getTickerInfo(tickerStr as string)); // 20PM td - 5PM tmr
      },
      1000 * 60 * 1, // 1mn
    );

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickerStr, hour]);
  return (
    <div className="row">
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

      <div className="col-md-12">
        <BidAndAskPrice loading={loading} ticker={ticker} />
      </div>

      <div className="col-md-12">
        <StockHistory info={ticker} ticker={tickerStr || ""} />
      </div>
    </div>
  );
};

export default TickerDetails;
