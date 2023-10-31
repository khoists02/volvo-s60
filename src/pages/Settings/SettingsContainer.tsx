// import axios from "axios";
import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { ITickerAccount } from "../../types/ticker";
import { FED_DAYS, HOLIDAYS } from "../../constants";
import format from "date-fns/format";
// import { useAppDispatch } from "../../config/store";
// import { getAccount } from "./ducks/operators";
import { useSelector } from "react-redux";
import { IRootState } from "../../config/reducers";

const SettingsContainer: FC = () => {
  const { account, loading } = useSelector(
    (state: IRootState) => state.accountReducer,
  );
  // const [tab, setTab] = useState("BLND");
  const [cal, setCal] = useState(0);
  const [out, setOut] = useState(0);
  const navigate = useNavigate();
  // const dispatch = useAppDispatch();
  // const [currentAcc, setCurrentAcc] = useState<ITickerAccount>({
  //   ticker: "",
  //   balance: "0",
  //   current: "0",
  //   id: "",
  //   count: 0,
  //   priceIn: 0,
  //   priceOut: 0,
  // });
  // useEffect(() => {
  //   dispatch(getAccount(tab));
  // }, [dispatch, tab]);
  useEffect(() => {
    // setCurrentAcc(account);
    setCal(account.priceIn);
  }, [account]);
  return (
    <>
      {/* <ul className="nav nav-tabs nav-tabs-highlight nav-justified">
        <li className="nav-item">
          <a
            href="#"
            className={`nav-link ${tab === "BLND" ? "active" : ""}`}
            onClick={() => setTab("BLND")}
          >
            BLND
          </a>
        </li>
        <li className="nav-item">
          <a
            href="#"
            className={`nav-link ${tab === "LAZR" ? "active" : ""}`}
            onClick={() => setTab("LAZR")}
          >
            LAZR
          </a>
        </li>
      </ul> */}
      <div className="card">
        <div className="card-header d-flex align-items-center">
          <h5 className="title">Settings</h5>
          {loading && (
            <i className="ph-light ph-spinner ph-xs-size spinner ml-1"></i>
          )}
        </div>
        <div className="card-body">
          {/* <div className="form-group row">
            <label htmlFor="balance" className="col-md-2">
              Balance
            </label>
            <input
              type="text"
              className="form-control col-md-5"
              value={currentAcc?.balance}
              onChange={(e) => {
                setCurrentAcc({ ...currentAcc, balance: e.target.value });
              }}
            />
          </div>

          <div className="form-group row">
            <label htmlFor="current" className="col-md-2">
              Current
            </label>
            <input
              type="text"
              className="form-control col-md-5"
              value={currentAcc?.current}
              onChange={(e) => {
                setCurrentAcc({ ...currentAcc, current: e.target.value });
              }}
            />
          </div>

          <div className="form-group row">
            <label htmlFor="current" className="col-md-2">
              Price In
            </label>
            <input
              type="number"
              className="form-control col-md-5"
              value={currentAcc?.priceIn}
              onChange={(e) => {
                setCurrentAcc({
                  ...currentAcc,
                  priceIn: parseFloat(e.target.value || "0"),
                });
              }}
            />
          </div>

          <div className="form-group row">
            <label htmlFor="current" className="col-md-2">
              Price Out
            </label>
            <input
              type="number"
              className="form-control col-md-5"
              value={currentAcc?.priceOut}
              onChange={(e) => {
                setCurrentAcc({
                  ...currentAcc,
                  priceOut: parseFloat(e.target.value || "0"),
                });
              }}
            />
          </div>

          <div className="form-group row">
            <label htmlFor="count" className="col-md-2">
              Count
            </label>
            <input
              type="text"
              className="form-control col-md-5"
              readOnly
              value={currentAcc?.count}
            />
          </div> */}

          <div className="form-group row">
            <div className="col-md-2">Fed Days</div>
            <div className="col-md-5 p-0">
              <div className="d-flex" style={{ flexDirection: "column" }}>
                <a
                  href="https://vn.investing.com/central-banks/fed-rate-monitor"
                  target="_blank"
                >
                  https://vn.investing.com/central-banks/fed-rate-monitor
                </a>
                <span>
                  {FED_DAYS.map((item) => {
                    return (
                      <span
                        className={`mr-1 mb-1 p-xs badge badge-${
                          format(new Date(), "yyyy-MM-dd") === item
                            ? "danger text-white"
                            : "light"
                        }`}
                        key={item}
                      >
                        {item}
                      </span>
                    );
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="form-group row">
            <div className="col-md-2">
              <span className="">Holidays</span>
            </div>
            <div className="col-md-5 p-0">
              <span>
                {HOLIDAYS.map((item) => {
                  return (
                    <span
                      className={`mr-1 mb-1 p-xs badge badge-${
                        format(new Date(), "yyyy-MM-dd") === item
                          ? "secondary text-white"
                          : "light"
                      }`}
                      key={item}
                    >
                      {item}
                    </span>
                  );
                })}
              </span>
            </div>
          </div>

          <div className="form-group row">
            <div className="col-md-2">
              <span className="">Calculator In</span>
            </div>
            <div className="col-md-5 p-0">
              <div className="row d-flex align-items-center">
                <div className="col-md-6">
                  <input
                    type="number"
                    className="form-control"
                    value={cal}
                    onChange={(e) => {
                      setCal(parseFloat(e.target.value));
                    }}
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="number"
                    readOnly
                    className="form-control"
                    value={cal - cal * 0.1}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-group row">
            <div className="col-md-2">
              <span className="">Calculator Out</span>
            </div>
            <div className="col-md-5 p-0">
              <div className="row d-flex align-items-center">
                <div className="col-md-6">
                  <input
                    type="number"
                    className="form-control"
                    value={out}
                    onChange={(e) => {
                      setOut(parseFloat(e.target.value));
                    }}
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="number"
                    readOnly
                    className="form-control"
                    value={(out - out * 0.05).toFixed(2)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            {/* <button
              className="btn btn-primary"
              type="button"
              onClick={async () => {
                await axios.put("/account", {
                  id: currentAcc.id,
                  balance: parseFloat(currentAcc.balance),
                  current: parseFloat(currentAcc.current),
                  priceIn: currentAcc.priceIn,
                  priceOut: currentAcc.priceOut,
                  ticker: tab,
                  count: parseFloat(
                    (
                      parseFloat(currentAcc.balance) /
                      parseFloat(currentAcc.current)
                    ).toFixed(1),
                  ),
                });
                navigate("/tickers/" + currentAcc.ticker);
              }}
            >
              Save
            </button> */}
            <button
              className="btn btn-primary"
              onClick={() => navigate("/calendars")}
            >
              <i className="ph-light ph-xs-size ph-calendar"></i>
            </button>
            <button className="btn btn-light ml-2" onClick={() => navigate(-1)}>
              Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsContainer;
