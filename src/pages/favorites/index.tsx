import React, { FC } from "react";
import { Route, Routes } from "react-router-dom";
import FavoriteContainer from "./FavoriteContainer";

const Favorites: FC = () => {
  return (
    <Routes>
      <Route index path="/" element={<FavoriteContainer />} />
    </Routes>
  );
};

export const FavoriteRoute = {
  element: <Favorites />,
  path: "/favorites/*",
};
