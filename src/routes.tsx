import { Route, Routes, Navigate } from "react-router-dom";
import HomeRouter from "./pages/Home";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/home" element={<HomeRouter />} />
            <Route path="/" element={<Navigate to="/home"  />} />
            <Route path="*" element={<Navigate to="/NotFound"  />} />
            <Route path="/NotFound" element={<span>Not Found Page</span>} />
        </Routes>
    )
}

export default AppRoutes;
