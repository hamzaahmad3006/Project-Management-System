import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export default function PrivateRoute({ Component }: any) {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);



    if (!isAuthenticated) {
        return <Navigate to="/auth/login" />;
    }




    return <Component />;
}