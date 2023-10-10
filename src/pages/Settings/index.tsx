import React, { FC } from "react";
import { Route, Routes } from "react-router-dom";
import SettingsContainer from "./SettingsContainer";

const SettingRouter: FC = () => {
    return (
        <Routes>
            <Route path="/" element={<SettingsContainer />} />
        </Routes>
    )
}

export default SettingRouter;
