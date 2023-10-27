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
import {
  getBidAskNoti,
  getTickerInfo,
} from "../../reducers/ducks/operators/notificationOperator";
// import { BidAndAskPrice } from "../../components/BidAndAksPrice";
// import axios from "axios";
// import { IBidAsk } from "../../types/notification";
import { New } from "../../components/New";
import { CashFlow } from "../../components/CashFlow";
import { getAccount } from "../settings/ducks/operators";
import { ErrorAlert } from "../../components/ErrorAlert";
import { DailyActions } from "../../reducers/ducks/slices/dailySlice";
import { TickerIcon, randomColor } from "../../components/TickerIcon";
import { BidAndAskPrice } from "../../components/BidAndAksPrice";
import { PlayBlock } from "../../components/PlayBlock";
import { useDrag } from "react-dnd";
import { useDrop } from "react-dnd";

interface IDraggable {
  children: React.ReactElement;
  className: string;
}

interface IDroppable {
  children: React.ReactElement;
}

export const DroppableContainer: FC<IDroppable> = ({ children }) => {
  // @ts-ignore
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: "image",
    drop: () => ({ name: "name of this drop target" }),
  }));

  // eslint-disable-next-line no-console
  console.log({ canDrop, isOver });

  return <div ref={drop}>{children}</div>;
};

export const DraggableContainer: FC<IDraggable> = ({ children, className }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [{ isDragging }, drag] = useDrag({
    type: "image",
    item: () => {
      // eslint-disable-next-line
      return {};
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  return (
    <div className={className} ref={drag}>
      {children}
    </div>
  );
};

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
  const { bidasks, loadingBidAsk } = useSelector(
    (state: IRootState) => state.notiReducer,
  );
  useEffect(() => {
    setTicker({
      ...tickerInfo,
      icon: (
        <TickerIcon
          size="lg"
          symbol={tickerInfo?.symbol as string}
          backgroundColor={randomColor()}
        />
      ),
    });
  }, [tickerInfo]);

  useEffect(() => {
    dispatch(getTickerInfo(tickerStr as string));
    dispatch(getBidAskNoti(tickerStr as string));
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
    <DroppableContainer>
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
        {bidasks.length > 0 && (
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-8">
                <BidAndAskPrice
                  updatedAt={bidasks[bidasks.length - 1].updatedAt as string}
                  loading={loadingBidAsk}
                  ticker={tickerStr as string}
                  bid={bidasks[bidasks.length - 1].bid}
                  ask={bidasks[bidasks.length - 1].ask}
                  bidSize={bidasks[bidasks.length - 1].bidSize}
                  askSize={bidasks[bidasks.length - 1].askSize}
                />
              </div>
              <div className="col-md-4">
                <PlayBlock ticker={ticker?.symbol as string} />
              </div>
            </div>
          </div>
        )}

        <div className="col-md-12">
          <StockHistory info={ticker} ticker={tickerStr || ""} />
        </div>

        <div className="col-md-12">
          <CashFlow ticker={tickerStr as string} />
        </div>
        <DraggableContainer className="col-md-12">
          <New ticker={tickerStr as string} />
        </DraggableContainer>
      </div>
    </DroppableContainer>
  );
};

export default TickerDetails;
