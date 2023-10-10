import React, { FC, useState, useEffect } from "react";
import TickerInfo from "../../components/TickerInfo";
import { ITickerInfo } from "../../types/ticker";
import axios from "axios";
import BlendIcon from "../../parts/Icons/Bend";
import StockHistory from "../../components/StockHistory";

const HomeContainer: FC = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [tickerStr, setTickerStr] = useState("BLND");
    const [ticker, setTicker] = useState<ITickerInfo | undefined>(undefined);
    useEffect(() => {
        const getInfo = async () => {
          const rs = await axios.get("/info", {
            params: {
              ticker: tickerStr
            }
          });
          setTicker({...rs.data, icon: <BlendIcon width={70} height={70} />});
        }
        getInfo();
      }, [tickerStr]);
    return (
        <div className="row">
            <div className="col-md-12">
                <TickerInfo ticker={ticker} />
            </div>


            <div className="col-md-12">
                <StockHistory info={ticker} ticker={tickerStr} />
            </div>
        </div>
    )
}

export default HomeContainer;
