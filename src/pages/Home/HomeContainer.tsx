import React, { FC, useState, useEffect } from "react";
import TickerInfo from "../../components/TickerInfo";
import { ITickerInfo } from "../../types/ticker";
import axios from "axios";
import BlendIcon from "../../parts/Icons/Bend";
import StockHistory from "../../components/StockHistory";

const HomeContainer: FC = () => {
    const [ticker, setTicker] = useState<ITickerInfo | undefined>(undefined);
    useEffect(() => {
        const getInfo = async () => {
          const rs = await axios.get("/info", {
            params: {
              ticker: "BLND"
            }
          });
          setTicker({...rs.data, icon: <BlendIcon width={70} height={70} />});
        }
        getInfo();
      }, []);
    return (
        <div className="row">
            <div className="col-md-12">
                <TickerInfo ticker={ticker} />
            </div>


            <div className="col-md-12">
                <StockHistory info={ticker} ticker="BLND" />
            </div>
        </div>
    )
}

export default HomeContainer;
