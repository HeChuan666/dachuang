import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingSpinner />;
  }

  // 检查是否已认证且为管理员
  if (isAuthenticated && user?.role === 'admin') {
    return children;
  }

  // 如果已认证但不是管理员，重定向到首页
  // 否则重定向到登录页
  return isAuthenticated ? <Navigate to="/" /> : <Navigate to="/login" />;
};

export default AdminRoute;