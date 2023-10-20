import React, { FC } from "react";
import { Route, Routes } from "react-router-dom";
import CalendarContainer from "./CalendarContainer";

const CalendarRouter: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<CalendarContainer />} />
    </Routes>
  );
};

export default CalendarRouter;
