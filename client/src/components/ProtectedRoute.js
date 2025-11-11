import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const userInfo = localStorage.getItem('userInfo');

  if (!userInfo) {
    // 如果用户未登录，则重定向到登录页面
    return <Navigate to="/login" replace />;
  }

  // 如果用户已登录，则显示子组件（即受保护的页面）
  return children;
};

export default ProtectedRoute;