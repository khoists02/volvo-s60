import React, { FC } from "react";
import { Route, Routes } from "react-router-dom";
import HistoriesDetails from "./HistoryDetailsContainer";
import HistoryContainer from "./HistoryContainer";

const HistoryRouter: FC = () => {
    return (
        <Routes>
            <Route index path="/" element={<HistoryContainer />} /> 
            <Route index path="/:id" element={<HistoriesDetails />} />
        </Routes>
    )
}

export const HistoryRoute = {
    element: <HistoryRouter />,
    path: "/histories/*"
}
