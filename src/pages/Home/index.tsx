import React, { FC } from "react";
import { Route, Routes } from "react-router-dom";
import HomeContainer from "./HomeContainer";

const HomeRouter: FC = () => {
    return (
        <Routes>
            <Route path="/" element={<HomeContainer />} />
        </Routes>
    )
}

export default HomeRouter;
