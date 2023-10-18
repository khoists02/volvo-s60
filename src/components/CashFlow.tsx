/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useEffect, useState } from "react";
import { useAppDispatch } from "../config/store";
import { getCashFlow } from "../reducers/ducks/operators/notificationOperator";
import { useSelector } from "react-redux";
import { IRootState } from "../config/reducers";
import { format } from "date-fns";

interface ICashFlow {
  ticker: string;
}

interface ICashFlowResponse {
  date: number;
}

export const CashFlow: FC<ICashFlow> = ({ ticker }) => {
  const dispatch = useAppDispatch();
  const [hide, setHide] = useState(false);
  const { loadingCashflow, cashflow } = useSelector(
    (state: IRootState) => state.notiReducer,
  );
  const [date, setDate] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("");

  const [objectKeys, setObjectKeys] = useState<string[]>([]);
  const [object, setObject] = useState(null);
  useEffect(() => {
    if (ticker) dispatch(getCashFlow(ticker));
  }, [dispatch, ticker]);

  useEffect(() => {
    if (cashflow) {
      setDate(Object.keys(cashflow));
    }
  }, [cashflow]);

  useEffect(() => {
    if (cashflow && selectedDate) {
      setObject(cashflow[selectedDate]);
    }
  }, [cashflow, selectedDate]);

  useEffect(() => {
    if (cashflow && selectedDate && object) {
      setObjectKeys(Object.keys(object));
    }
  }, [cashflow, selectedDate, object]);

  const formatLabel = (label: string): string => {
    return label.replace(/([a-z])([A-Z])/g, "$1 $2");
  };

  return (
    <div className="card">
      <div className="card-header d-flex algin-items-center justify-content-between">
        <div className="d-flex">
          <h5 className="title">CashFlow - {ticker}</h5>

          <span
            className="ml-1 badge badge-primary cursor-pointer d-flex align-items-center"
            onClick={() => {
              dispatch(getCashFlow(ticker));
            }}
          >
            <span>Reload</span>
            {loadingCashflow && (
              <i className="ph-light ph-spinner ph-xs-size spinner ml-1"></i>
            )}
          </span>
        </div>
        <i
          onClick={() => setHide(!hide)}
          className={`cursor-pointer ph-light ph-sm-size ph-arrow-${
            !hide ? "right" : "down"
          } font-weight`}
        ></i>
      </div>
      {!hide && (
        <div className="card-body animated fadeInUp">
          {date.map((dt) => {
            return (
              <div key={dt}>
                <div className="mb-1">
                  <span
                    onClick={() => {
                      if (dt === selectedDate) setSelectedDate("");
                      else setSelectedDate(dt);
                    }}
                    className={`badge ${
                      selectedDate === dt
                        ? "badge-secondary text-white"
                        : "badge-light"
                    } d-flex cursor-pointer align-items-center`}
                    style={{ width: 150 }}
                  >
                    <span className="flex-1">
                      {format(new Date(parseInt(dt, 10)), "yyyy-MM-dd")}
                    </span>
                    <i className="ph-light ph-xs-size ph-arrow-right cursor-pointer"></i>
                  </span>
                </div>
                {dt === selectedDate && object && (
                  <div className="p-3 card animated fadeInUp">
                    {objectKeys.map((obj) => {
                      return (
                        <div className="d-flex mb-1" key={obj}>
                          <span
                            style={{ width: 300 }}
                            className="badge badge-primary text-white p-lr-sm t-tb-xs text-left f-4"
                          >
                            {formatLabel(obj)}
                          </span>
                          <span className="ml-1 badge badge-secondary">
                            {object[obj] ? object[obj] : "NaN"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
