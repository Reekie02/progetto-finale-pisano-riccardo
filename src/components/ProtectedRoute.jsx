import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute() {
    const { user, initializing } = useAuth();
    const location = useLocation();

    if (initializing) {
        return <p className="text-center mt-10 text-gray-600">Caricamento...</p>;
    }

    if (!user) {
        return <Navigate to="/auth/signin" replace state={{ from: location.pathname }} />;
    }

    return <Outlet />;
}