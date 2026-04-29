import { Navigate, Outlet, useLocation } from "react-router-dom";
import Spinner from "./Spinner";
import useAuth from "../hooks/useAuth";
import useUsers from "../hooks/useUsers";

const RequireAuth = () => {
    const { session, loading } = useAuth();
    const location = useLocation();

    if (loading) return <Outlet />;
    if (!session) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

const RequireGuest = () => {
    const { session, loading } = useAuth();

    if (loading) return <Outlet />;
    if (session) return <Navigate to="/" replace />;

    return <Outlet />;
};

const RequireRole = ({ allowedRoles = [] }) => {
    const { session, loading: authLoading } = useAuth();
    const { user, loading: userLoading } = useUsers();
    const location = useLocation();

    if (authLoading || userLoading) return <Outlet />;
    if (!session || !user) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export { RequireAuth, RequireGuest, RequireRole };
