import React, { FC } from "react";
import { Route, Routes } from "react-router-dom";
import TickerDetails from "./TickerDetailsContainer";

const HistoryRouter: FC = () => {
  return (
    <Routes>
      <Route index path="/:id" element={<TickerDetails />} />
    </Routes>
  );
};

export const HistoryRoute = {
  element: <HistoryRouter />,
  path: "/tickers/*",
};
