import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VoiceRecognitionPage from './pages/VoiceRecognitionPage';
import MapPage from './pages/MapPage';
import HistoryPage from './pages/HistoryPage';
import ProtectedRoute from './components/ProtectedRoute'; // 1. 导入 ProtectedRoute 组件

function App() {
  return (
    <ConfigProvider>
      <Router>
        <div>
          <Routes>
            {/* 公共路由：任何人都可以访问 */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* 受保护的路由：只有登录用户才能访问 */}
            <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/voice" element={<ProtectedRoute><VoiceRecognitionPage /></ProtectedRoute>} />
            <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App;