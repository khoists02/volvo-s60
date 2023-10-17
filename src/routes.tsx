/* eslint-disable react/jsx-pascal-case */
import { Route, Routes, Navigate } from "react-router-dom";
import SettingRouter from "./pages/settings";
import { HistoryRoute } from "./pages/tickers";
import { FavoriteRoute } from "./pages/favorites";
import { BidAskRoute } from "./pages/bidasks";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={HistoryRoute.path} element={HistoryRoute.element} />
      <Route path={FavoriteRoute.path} element={FavoriteRoute.element} />
      <Route path={BidAskRoute.path} element={BidAskRoute.element} />
      <Route path="/settings" element={<SettingRouter />} />
      <Route path="/" element={<Navigate to="/favorites" />} />
      <Route path="*" element={<Navigate to="/NotFound" />} />
      <Route path="/NotFound" element={<span>Not Found Page</span>} />
    </Routes>
  );
};

export default AppRoutes;
