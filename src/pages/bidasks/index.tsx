import React, { FC } from "react";
import { Route, Routes } from "react-router-dom";
import BidAsksController from "./BidAsksController";

const BidAskRouter: FC = () => {
  return (
    <Routes>
      <Route index path="/:id" element={<BidAsksController />} />
    </Routes>
  );
};

export const BidAskRoute = {
  element: <BidAskRouter />,
  path: "/bidasks/*",
};
