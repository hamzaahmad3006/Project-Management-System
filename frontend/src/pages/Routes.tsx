import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Auth from './auth';
import PrivateRoute from '../components/PrivateRoute';
import Dashboard from './dashboard';
import InvitationHandler from './dashboard/invitationHandler/InvitationHandler';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import WelcomePage from './welcome/WelcomePage';

export default function Index() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  return (
    <>
      <Routes>
        <Route
          path="auth/*"
          element={
            !isAuthenticated ? <Auth /> : <Navigate to={user?.hasSeenWelcome ? '/' : '/welcome'} />
          }
        />
        <Route
          path="welcome"
          element={isAuthenticated && !user?.hasSeenWelcome ? <WelcomePage /> : <Navigate to="/" />}
        />
        <Route path="invitation/:token/:action" element={<InvitationHandler />} />

        <Route
          path="/*"
          element={
            isAuthenticated ? (
              user?.hasSeenWelcome ? (
                <PrivateRoute Component={Dashboard} />
              ) : (
                <Navigate to="/welcome" />
              )
            ) : (
              <Navigate to="/auth/login" />
            )
          }
        />
      </Routes>
    </>
  );
}
