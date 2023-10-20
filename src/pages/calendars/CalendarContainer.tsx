/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useEffect, useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import { FED_DAYS, HOLIDAYS } from "../../constants";
import { useSelector } from "react-redux";
import { IRootState } from "../../config/reducers";
import { useAppDispatch } from "../../config/store";
import { getCashFlow } from "../../reducers/ducks/operators/notificationOperator";
import format from "date-fns/format";
import axios from "axios";
import { isBefore } from "date-fns";
import { useNavigate } from "react-router-dom";

interface ITickerReportDays {
  label: string;
  value: string[];
}

const CalendarContainer: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [tickerReportDays, setTickerReportDays] = useState<ITickerReportDays[]>(
    [],
  );
  const [date, setDate] = useState<string[]>([]);
  const { cashflow } = useSelector((state: IRootState) => state.notiReducer);

  useEffect(() => {
    dispatch(getCashFlow("BLND"));
  }, [dispatch]);

  useEffect(() => {
    if (cashflow) {
      setDate(Object.keys(cashflow));
    }
  }, [cashflow]);
  const fedEvents = FED_DAYS.map((f) => {
    return {
      id: new Date().getMilliseconds(),
      title: `Fed Events - ${f}`,
      start: f,
      color: "red",
    };
  });
  const holidayEvents = HOLIDAYS.map((f) => {
    return {
      id: new Date().getMilliseconds(),
      title: `Holiday - ${f}`,
      start: f,
    };
  });

  const tickerEvents = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rs: any[] = [];
    if (tickerReportDays.length > 0) {
      tickerReportDays.forEach((dt) => {
        dt.value.forEach((vl) => {
          rs.push({
            id: new Date().getMilliseconds(),
            title: `BLND Event - ${dt.label} - ${vl}`,
            start: vl,
            color: "#5c6bc0",
          });
        });
      });
    }
    return rs || [];
  }, [tickerReportDays]);

  useEffect(() => {
    const getTickerReportDays = async () => {
      const rs = await axios.get("/earningdates", {
        params: { ticker: "BLND" },
      });
      if (rs.data) {
        const keys = Object.keys(rs.data);
        // eslint-disable-next-line no-console
        setTickerReportDays(
          keys.map((k: string) => {
            return {
              label: k,
              value: Object.keys(rs.data[k])
                .filter((v) => isBefore(new Date(), new Date(parseInt(v, 10))))
                .map((x) => format(new Date(parseInt(x, 10)), "yyyy-MM-dd")),
            };
          }),
        );
      }
    };

    getTickerReportDays();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="row">
      <i
        className="ml-2 cursor-pointer ph-light ph-sm-size ph-arrow-left font-weight"
        onClick={() => {
          navigate(-1);
        }}
      ></i>
      <div className="calendar-container">
        <FullCalendar
          viewClassNames="test"
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={
            [
              ...fedEvents,
              ...holidayEvents,
              ...tickerEvents,
            ] as unknown as InputEvent[]
          }
        />
      </div>
    </div>
  );
};

export default CalendarContainer;
