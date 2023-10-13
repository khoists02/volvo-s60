/* eslint-disable react/jsx-pascal-case */
import { Route, Routes, Navigate } from "react-router-dom";
import SettingRouter from "./pages/Settings";
import { HistoryRoute } from "./pages/Histories";
import { FavoriteRoute } from "./pages/favorites";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={HistoryRoute.path} element={HistoryRoute.element} />
      <Route path={FavoriteRoute.path} element={FavoriteRoute.element} />
      <Route path="/settings" element={<SettingRouter />} />
      <Route path="/" element={<Navigate to="/histories" />} />
      <Route path="*" element={<Navigate to="/NotFound" />} />
      <Route path="/NotFound" element={<span>Not Found Page</span>} />
    </Routes>
  );
};

export default AppRoutes;
