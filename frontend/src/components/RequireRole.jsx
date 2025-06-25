import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireRole = ({ user, allowedRole, children }) => {
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== allowedRole) return <Navigate to="/" replace />;
  return children;
};

export default RequireRole;
