/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useState, useEffect, useRef } from "react";
import TickerInfo from "../../components/TickerInfo";
import { ITickerInfo } from "../../types/ticker";
import axios from "axios";
import BlendIcon from "../../parts/icons/Bend";
import StockHistory from "../../components/StockHistory";
import { useParams } from "react-router-dom";
import { addDays } from "date-fns";

const HistoriesDetails: FC = () => {
  const tickerPr = useParams();
  const id = tickerPr.id;
  const timer = useRef<NodeJS.Timer | null>(null);
  const [tickerStr, setTickerStr] = useState(id?.toUpperCase());
  const [count, setCount] = useState(0);
  const current = new Date();
  const nextDay = addDays(current, 1);
  const hour: number = current.getHours();
  const hourNext: number = nextDay.getHours();
  const [ticker, setTicker] = useState<ITickerInfo | undefined>(undefined);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getInfo = async () => {
      setLoading(true);
      const rs = await axios.get("/info", {
        params: {
          ticker: tickerStr,
        },
      });
      setTicker({ ...rs.data, icon: <BlendIcon width={70} height={70} /> });
      setLoading(false);
    };
    getInfo();
    timer.current = setInterval(
      () => {
        if (hour >= 20 && hourNext <= 5) getInfo(); // 20PM td - 5PM tmr
      },
      1000 * 60 * 5, // 5mn
    );

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickerStr]);
  return (
    <div className="row">
      <div className="col-md-12">
        <TickerInfo
          ticker={ticker}
          loading={loading}
          reload={async () => {
            setLoading(true);
            const rs = await axios.get("/info", {
              params: {
                ticker: tickerStr,
              },
            });
            setTicker({
              ...rs.data,
              icon: <BlendIcon width={70} height={70} />,
            });
            setLoading(false);
          }}
        />
      </div>

      <div className="col-md-12">
        <StockHistory info={ticker} ticker={tickerStr || ""} />
      </div>
    </div>
  );
};

export default HistoriesDetails;
