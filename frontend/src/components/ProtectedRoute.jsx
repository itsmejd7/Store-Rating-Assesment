import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin')       return <Navigate to="/admin"  replace />;
    if (user.role === 'store_owner') return <Navigate to="/owner"  replace />;
    return <Navigate to="/stores" replace />;
  }

  return <Outlet />;
}
