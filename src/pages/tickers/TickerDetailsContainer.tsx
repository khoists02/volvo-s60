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

  // useEffect(() => {
  //   setInitLay(layout);
  // }, []);
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
      <DroppableContainer>
        <ResponsiveGridLayout
          // isBounded={true}
          layout={initLayout}
          onLayoutChange={(l) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setInitLay(l as any);
            localStorage.setItem("layout", JSON.stringify(l));
          }}
          compactType="horizontal"
          cols={12}
          rowHeight={100}
          style={{ width: "100%" }}
          verticalCompact={false}
          isBounded={true}
        >
          <div key="info">
            <TickerInfo
              ticker={ticker}
              loading={loading}
              edit={edit}
              reload={() => {
                dispatch(getTickerInfo(tickerStr as string));
              }}
            />
          </div>
          {!HOLIDAYS.includes(format(new Date(), "yyyy-MM-dd")) && (
            <div key="daily">
              <DailyStock ticker={tickerStr || ""} edit={edit} />
            </div>
          )}
          {/* TODO: // comment */}
          <div key="bid">
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

          <div key="play">
            <PlayBlock ticker={ticker?.symbol as string} edit={edit} />
          </div>

          <div key="history">
            <StockHistory info={ticker} ticker={tickerStr || ""} edit={edit} />
          </div>

          <div className="" key="cashfow">
            <CashFlow ticker={tickerStr as string} edit={edit} />
          </div>
          <div key="new">
            <New ticker={tickerStr as string} edit={edit} />
          </div>
        </ResponsiveGridLayout>
      </DroppableContainer>
    </>
  );
};

export default TickerDetails;
