import React, { FC, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ITickerAccount, ITickerDropdown, ITickerInfo } from "../types/ticker";
import { useLocation, useNavigate } from "react-router-dom";
import CustomerDropdown, { ICustomer } from "../components/CustomerDropdown";
import { TickerIcon, randomColor } from "../components/TickerIcon";
import { useAppDispatch } from "../config/store";
import { getFavorites } from "../reducers/ducks/operators/notificationOperator";
import { useSelector } from "react-redux";
import { IRootState } from "../config/reducers";

const PageHeader: FC = () => {
  const [options, setOptions] = useState<ICustomer[]>([]);
  const [selected, setSelected] = useState<ICustomer | undefined>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const path = useLocation();
  const pathArr = path.pathname.split("/").filter((p) => p !== "");
  const tickerPr = pathArr[1] || "";
  const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tickers, setTickers] = useState<ITickerDropdown[]>([]);
  const [currentAcc, setCurrentAcc] = useState<ITickerAccount | null>(null);
  const [ticker, setTicker] = useState<ITickerInfo | undefined>(undefined);
  const { entities } = useSelector((state: IRootState) => state.historyReducer);
  useEffect(() => {
    if (entities.length > 0) return;
    dispatch(getFavorites());
  }, [dispatch, entities]);
  useEffect(() => {
    const getSettings = async () => {
      const rs = await axios.get("/settings");
      if (rs.data.length) {
        setTickers([
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...rs.data.map((x: any) => {
            return {
              ...x,
              sub: x.short,
              name: x.short,
              icon: <TickerIcon size="lg" symbol={tickerPr as string} />,
            };
          }),
        ]);
      }
    };
    const getCurrentAcc = async () => {
      const rs = await axios.get("/account", { params: { ticker: tickerPr } });
      setCurrentAcc(rs.data);
    };
    const getInfo = async () => {
      try {
        // TODO: Replace URL later
        const rs = await axios.get("/short", {
          params: {
            ticker: tickerPr,
          },
        });
        // TODO: Replace content later
        setTicker({
          ...rs.data.content,
          icon: <TickerIcon size="lg" symbol={tickerPr as string} />,
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    };
    if (tickerPr) {
      getInfo();
      getSettings();
      getCurrentAcc();
    }
  }, [tickerPr]);

  useEffect(() => {
    if (entities.length > 0) {
      const rs = entities.map((e) => {
        return {
          icon: (
            <TickerIcon
              size="sm"
              symbol={e.symbol as string}
              backgroundColor={randomColor()}
            />
          ),
          ticker: e.symbol,
          name: e.symbol,
        };
      }) as ICustomer[];
      setOptions(rs);
      setSelected(rs.find((r) => r.ticker === tickerPr));
    }
  }, [entities, tickerPr]);

  const totalPerc = useMemo(() => {
    if (ticker && currentAcc) {
      return (
        (parseFloat(ticker.currentPrice) - parseFloat(currentAcc.current)) /
        parseFloat(currentAcc.current)
      );
    }
    return 0;
  }, [ticker, currentAcc]);

  return (
    <div className="page-header page-header-light shadow">
      <div className="page-header-content d-lg-flex">
        <div
          className="collapse d-lg-block my-lg-auto ms-lg-auto w-100"
          id="page_header"
        >
          <div className="d-sm-flex align-items-center justify-content-between mb-3 mb-lg-0 ms-lg-3">
            {options.length > 0 && (
              <CustomerDropdown
                options={options}
                selected={selected as ICustomer}
                onChange={(value: ICustomer) => {
                  window.location.href = "/tickers/" + value.ticker;
                }}
              />
            )}

            <div
              className="d-flex align-items-center mb-3 mb-lg-0 justify-content-end"
              style={{ width: 250 }}
            >
              <div className="bg-opacity-10 text-primary lh-1 rounded-pill p-2">
                <i
                  className={`ph-light ph-md-size ph-trend-${
                    totalPerc < 0 ? "down" : "up"
                  } text-${totalPerc < 0 ? "danger" : "success"}`}
                ></i>
              </div>
              <div className="ml-1 flex-1 p-tb-xxs">
                <h5 className="mb-0">
                  {USDollar.format(parseFloat(currentAcc?.balance || "") || 0)}
                </h5>
                <div className="d-flex align-items-center">
                  <span className="mb-0 d-flex">
                    <span>
                      {USDollar.format(
                        parseFloat(currentAcc?.current || "0") || 0,
                      )}
                    </span>
                    <span
                      className={`d-flex align-items-center text-danger ml-2`}
                    >
                      <i
                        className={`ph-light ph-arrow-down fs-base lh-base align-top`}
                      ></i>
                      {totalPerc > 0 ? "+" : ""}
                      {(totalPerc * 100).toFixed(2)}%
                    </span>
                  </span>
                </div>
                <div>
                  @
                  {parseFloat(currentAcc?.count as unknown as string).toFixed(
                    2,
                  )}
                </div>
              </div>
              <i
                className="ph-light ph-gear ml-1 cursor-pointer ph-sm-size"
                onClick={() => {
                  navigate("/settings");
                }}
              ></i>
            </div>
            {/* <div className="vr d-none d-sm-block flex-shrink-0 my-2 mx-3"></div>

								<div className="d-inline-flex mt-3 mt-sm-0">
									<a href="#" className="status-indicator-container ms-1">
										<img src="../../../assets/images/demo/users/face24.jpg" className="w-32px h-32px rounded-pill" alt="" />
										<span className="status-indicator bg-warning"></span>
									</a>
									<a href="#" className="status-indicator-container ms-1">
										<img src="../../../assets/images/demo/users/face1.jpg" className="w-32px h-32px rounded-pill" alt="" />
										<span className="status-indicator bg-success"></span>
									</a>
									<a href="#" className="status-indicator-container ms-1">
										<img src="../../../assets/images/demo/users/face3.jpg" className="w-32px h-32px rounded-pill" alt="" />
										<span className="status-indicator bg-danger"></span>
									</a>
									<a href="#" className="btn btn-outline-primary btn-icon w-32px h-32px rounded-pill ms-3">
										<i className="ph-plus"></i>
									</a>
								</div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
