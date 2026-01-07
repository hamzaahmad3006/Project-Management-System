import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface PrivateRouteProps {
    Component: React.ComponentType;
}

export default function PrivateRoute({ Component }: PrivateRouteProps) {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" />;
    }

    return <Component />;
}