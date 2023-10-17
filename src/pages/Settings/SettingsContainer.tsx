import axios from "axios";
import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ITickerAccount } from "../../types/ticker";
import { HOLIDAYS } from "../../constants";
import format from "date-fns/format";

const SettingsContainer: FC = () => {
  const navigate = useNavigate();
  const [currentAcc, setCurrentAcc] = useState<ITickerAccount>({
    ticker: "",
    balance: "0",
    current: "0",
    id: "",
    count: 0,
    priceIn: 0,
  });
  useEffect(() => {
    const getCurrentAcc = async () => {
      const rs = await axios.get("/account", { params: { ticker: "BLND" } });
      setCurrentAcc(rs.data);
    };

    getCurrentAcc();
  }, []);
  return (
    <div className="card">
      <div className="card-header">
        <h5 className="title">Settings</h5>
      </div>
      <div className="card-body">
        <div className="form-group row">
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
          <label htmlFor="count" className="col-md-2">
            Count
          </label>
          <input
            type="text"
            className="form-control col-md-5"
            readOnly
            value={currentAcc?.count}
          />
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

        <div className="form-group">
          <button
            className="btn btn-primary"
            type="button"
            onClick={async () => {
              await axios.put("/account", {
                id: currentAcc.id,
                balance: parseFloat(currentAcc.balance),
                current: parseFloat(currentAcc.current),
                priceIn: currentAcc.priceIn,
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
          </button>
          <button className="btn btn-light ml-2" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsContainer;
