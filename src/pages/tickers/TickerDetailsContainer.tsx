/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useState, useEffect, useRef, useMemo } from "react";
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
import RGL, { WidthProvider, Layout } from "react-grid-layout";
const ResponsiveGridLayout = WidthProvider(RGL);

interface IDraggable {
  children: React.ReactElement;
  className: string;
}

interface IDroppable {
  children: React.ReactElement;
}

const layout: Layout[] = [
  {
    i: "info",
    x: 0,
    y: 0,
    w: 12,
    h: 2,
    isResizable: true,
    isDraggable: true,
    isBounded: true,
  },
  {
    i: "daily",
    x: 0,
    y: 2,
    w: 12,
    h: 2,
    isResizable: true,
    isDraggable: true,
    isBounded: true,
  },
  {
    i: "bid",
    x: 0,
    y: 4,
    w: 7,
    h: 3,
    isResizable: true,
    isDraggable: true,
    isBounded: true,
  },
  {
    i: "play",
    x: 7,
    y: 4,
    w: 5,
    h: 3,
    isResizable: true,
    isDraggable: true,
    isBounded: true,
  },
  {
    i: "history",
    x: 0,
    y: 7,
    w: 12,
    h: 5,
    isResizable: true,
    isDraggable: true,
    isBounded: true,
  },
  {
    i: "cashfow",
    x: 0,
    y: 12,
    w: 100,
    h: 2,
    isResizable: true,
    isDraggable: true,
    isBounded: true,
  },
  {
    i: "new",
    x: 0,
    y: 14,
    w: 12,
    h: 3,
    isResizable: true,
    isDraggable: true,
    isBounded: true,
  },
];

const layoutLocal = localStorage.getItem("layout")
  ? JSON.parse(localStorage.getItem("layout") as string)
  : layout;

export const DroppableContainer: FC<IDroppable> = ({ children }) => {
  // @ts-ignore
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: "image",
    drop: () => ({ name: "name of this drop target" }),
  }));

  // eslint-disable-next-line no-console
  // console.log({ canDrop, isOver });

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
  const [initLayout, setInitLay] = useState<Layout[]>(layoutLocal);
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
  const { edit } = useSelector((state: IRootState) => state.playsReducer);

  useEffect(() => {
    const ls = [...initLayout];
    if (edit) {
      setInitLay(
        ls.map((x) => {
          return {
            ...x,
            isDraggable: true,
            isResizable: true,
          };
        }),
      );
    } else {
      const data = ls.map((x) => {
        return {
          ...x,
          isDraggable: false,
          isResizable: false,
        };
      });
      setInitLay(data);
      const json = JSON.stringify(data);
      // localStorage.setItem("layout", json);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edit]);
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

  const handleLayoutChange = (arr: Layout[]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setInitLay(arr as any);
    localStorage.setItem("layout", JSON.stringify(arr));
  };

  const keys = useMemo(() => {
    return initLayout.map((m) => m.i);
  }, [initLayout]);

  const showInfo = useMemo(() => {
    return keys.includes("info");
  }, [keys]);

  const showDaily = useMemo(() => {
    return keys.includes("daily");
  }, [keys]);

  const showHistory = useMemo(() => {
    return keys.includes("history");
  }, [keys]);

  const showBid = useMemo(() => {
    return keys.includes("bid");
  }, [keys]);

  const showPlay = useMemo(() => {
    return keys.includes("play");
  }, [keys]);

  const showCashFlow = useMemo(() => {
    return keys.includes("cashfow");
  }, [keys]);

  const showNew = useMemo(() => {
    return keys.includes("new");
  }, [keys]);

  return (
    <>
      {error && (
        <div className="row mb-2">
          <div className="col-md-12">
            <ErrorAlert
              message={`Ticker ${tickerStr} ${error}`}
              onClose={() => dispatch(DailyActions.clearEr())}
            />
          </div>
        </div>
      )}
      {!edit && (
        <div className="row mb-2 mt-2">
          <div className="col-md-12 d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                handleLayoutChange(layout);
              }}
            >
              Reset Layout
            </button>
          </div>
        </div>
      )}

      <ResponsiveGridLayout
        layout={initLayout}
        onLayoutChange={(l) => handleLayoutChange(l)}
        compactType="horizontal"
        cols={12}
        rowHeight={100}
        style={{ width: "100%" }}
        verticalCompact={false}
        isBounded={true}
      >
        {showInfo && (
          <div key="info" className="pos-r">
            {edit && (
              <i
                className="ph-light ph-sm-size ph-x cursor-pointer text-white bg-danger"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const cl = [...initLayout].filter((x) => x.i !== "info");
                  handleLayoutChange(cl);
                }}
                style={{
                  position: "absolute",
                  right: 10,
                  top: 10,
                  zIndex: 1000,
                }}
              ></i>
            )}

            <TickerInfo
              ticker={ticker}
              loading={loading}
              edit={edit}
              reload={() => {
                dispatch(getTickerInfo(tickerStr as string));
              }}
            />
          </div>
        )}

        {!HOLIDAYS.includes(format(new Date(), "yyyy-MM-dd")) && showDaily && (
          <div key="daily" className="pos-r">
            {edit && (
              <i
                className="ph-light ph-sm-size ph-x cursor-pointer text-white bg-danger"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setInitLay(initLayout.filter((x) => x.i !== "daily"));
                }}
                style={{
                  position: "absolute",
                  right: 10,
                  top: 10,
                  zIndex: 1000,
                }}
              ></i>
            )}

            <DailyStock ticker={tickerStr || ""} edit={edit} />
          </div>
        )}
        {/* TODO: // comment */}
        {showBid && (
          <div key="bid" className="pos-r">
            {edit && (
              <i
                className="ph-light ph-sm-size ph-x cursor-pointer text-white bg-danger"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setInitLay(initLayout.filter((x) => x.i !== "bid"));
                }}
                style={{
                  position: "absolute",
                  right: 10,
                  top: 10,
                  zIndex: 1000,
                }}
              ></i>
            )}

            <BidAndAskPrice
              updatedAt={bidasks[bidasks.length - 1]?.updatedAt as string}
              loading={loadingBidAsk}
              ticker={tickerStr as string}
              bid={bidasks[bidasks.length - 1]?.bid}
              ask={bidasks[bidasks.length - 1]?.ask}
              bidSize={bidasks[bidasks.length - 1]?.bidSize}
              askSize={bidasks[bidasks.length - 1]?.askSize}
              edit={edit}
            />
          </div>
        )}

        {showPlay && (
          <div key="play" className="pos-r">
            {edit && (
              <i
                className="ph-light ph-sm-size ph-x cursor-pointer text-white bg-danger"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setInitLay(initLayout.filter((x) => x.i !== "play"));
                }}
                style={{
                  position: "absolute",
                  right: 10,
                  top: 10,
                  zIndex: 1000,
                }}
              ></i>
            )}

            <PlayBlock
              ticker={ticker?.symbol as string}
              currentPrice={
                ticker?.currentPrice ? parseFloat(ticker?.currentPrice) : 0
              }
              edit={edit}
            />
          </div>
        )}

        {showHistory && (
          <div key="history" className="pos-r">
            {edit && (
              <i
                className="ph-light ph-sm-size ph-x cursor-pointer text-white bg-danger"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setInitLay(initLayout.filter((x) => x.i !== "history"));
                }}
                style={{
                  position: "absolute",
                  right: 10,
                  top: 10,
                  zIndex: 1000,
                }}
              ></i>
            )}

            <StockHistory info={ticker} ticker={tickerStr || ""} edit={edit} />
          </div>
        )}

        {showCashFlow && (
          <div key="cashfow" className="pos-r">
            {edit && (
              <i
                className="ph-light ph-sm-size ph-x cursor-pointer text-white bg-danger"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setInitLay(initLayout.filter((x) => x.i !== "cashfow"));
                }}
                style={{
                  position: "absolute",
                  right: 10,
                  top: 10,
                  zIndex: 1000,
                }}
              ></i>
            )}

            <CashFlow ticker={tickerStr as string} edit={edit} />
          </div>
        )}

        {showNew && (
          <div key="new" className="pos-r">
            {edit && (
              <i
                className="ph-light ph-sm-size ph-x cursor-pointer text-white bg-danger"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setInitLay(initLayout.filter((x) => x.i !== "new"));
                }}
                style={{
                  position: "absolute",
                  right: 10,
                  top: 10,
                  zIndex: 1000,
                }}
              ></i>
            )}

            <New ticker={tickerStr as string} edit={edit} />
          </div>
        )}
      </ResponsiveGridLayout>
    </>
  );
};

export default TickerDetails;
