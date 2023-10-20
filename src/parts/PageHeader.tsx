import React, { FC, useEffect, useMemo, useState } from "react";
import BlendIcon from "./icons/Bend";
import axios from "axios";
import { ITickerAccount, ITickerDropdown, ITickerInfo } from "../types/ticker";
import { useLocation, useNavigate } from "react-router-dom";
import CustomerDropdown, { ICustomer } from "../components/CustomerDropdown";

const PageHeader: FC = () => {
  const options: ICustomer[] = [
    {
      icon: <BlendIcon width={32} height={32} />,
      ticker: "BLND",
      name: "Blend Labs, Inc.",
    },
  ];
  const [selected, setSelected] = useState<ICustomer | undefined>(
    options.find((p) => p.ticker === "BLND"),
  );
  const navigate = useNavigate();
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
              icon: <BlendIcon width={80} height={80} />,
            };
          }),
        ]);
      }
    };
    const getCurrentAcc = async () => {
      const rs = await axios.get("/account", { params: { ticker: "BLND" } });
      setCurrentAcc(rs.data);
    };
    const getInfo = async () => {
      try {
        const rs = await axios.get("/info", {
          params: {
            ticker: "BLND",
          },
        });
        setTicker({ ...rs.data, icon: <BlendIcon width={70} height={70} /> });
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
            <CustomerDropdown
              options={options}
              selected={selected as ICustomer}
              onChange={(value: ICustomer) => {
                setSelected(value);
              }}
            />

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

      {/* <div className="page-header-content d-lg-flex border-top">
						<div className="d-flex">
							<div className="breadcrumb py-2">
								<a href="index.html" className="breadcrumb-item"><i className="ph-house"></i></a>
								<a href="#" className="breadcrumb-item">Home</a>
								<span className="breadcrumb-item active">Dashboard</span>
							</div>

							<a href="#breadcrumb_elements" className="btn btn-light align-self-center collapsed d-lg-none border-transparent rounded-pill p-0 ms-auto" data-bs-toggle="collapse">
								<i className="ph-caret-down collapsible-indicator ph-sm m-1"></i>
							</a>
						</div>

						<div className="collapse d-lg-block ms-lg-auto" id="breadcrumb_elements">
							<div className="d-lg-flex mb-2 mb-lg-0">
								<a href="#" className="d-flex align-items-center text-body py-2">
									<i className="ph-lifebuoy me-2"></i>
									Support
								</a>

								<div className="dropdown ms-lg-3">
									<a href="#" className="d-flex align-items-center text-body dropdown-toggle py-2" data-bs-toggle="dropdown">
										<i className="ph-gear me-2"></i>
										<span className="flex-1">Settings</span>
									</a>

									<div className="dropdown-menu dropdown-menu-end w-100 w-lg-auto">
										<a href="#" className="dropdown-item">
											<i className="ph-shield-warning me-2"></i>
											Account security
										</a>
										<a href="#" className="dropdown-item">
											<i className="ph-chart-bar me-2"></i>
											Analytics
										</a>
										<a href="#" className="dropdown-item">
											<i className="ph-lock-key me-2"></i>
											Privacy
										</a>
										<div className="dropdown-divider"></div>
										<a href="#" className="dropdown-item">
											<i className="ph-gear me-2"></i>
											All settings
										</a>
									</div>
								</div>
							</div>
						</div>
					</div> */}
    </div>
  );
};

export default PageHeader;
