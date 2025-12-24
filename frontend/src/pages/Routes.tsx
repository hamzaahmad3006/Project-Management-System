import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Auth from "./auth";
import PrivateRoute from "../components/PrivateRoute";
import Dashboard from "./Dashboard/";
import InvitationHandler from "./Dashboard/invitationHandler/InvitationHandler";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export default function Index() {
    const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

    if (loading) return <div>Loading...</div>;



    return (
        <>
            <Routes>
                <Route path="auth/*" element={!isAuthenticated ? (<Auth />) : (<Navigate to="/dashboard" />)} />
                <Route path="invitation/:token/:action" element={<InvitationHandler />} />

                <Route path='/*' element={isAuthenticated ? (<PrivateRoute Component={Dashboard} />) : (<Navigate to="/auth/login" />)} />



            </Routes>
        </>
    );
}