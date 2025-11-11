import React from 'react';
import { Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // 清除本地存储中的用户信息
        localStorage.removeItem('userInfo');
        // 跳转回登录页面
        navigate('/login');
    };

    const mainItems = [
        {
            label: <Link to="/home">主页</Link>,
            key: 'home',
        },
        {
            label: <Link to="/voice">语音交互</Link>,
            key: 'voice',
        },
        {
            label: <Link to="/map">地图</Link>,
            key: 'map',
        },
        {
            label: <Link to="/history">历史记录</Link>,
            key: 'history',
        },
    ];

    const logoutItem = [
        {
            label: '退出登录',
            key: 'logout',
            onClick: handleLogout,
        }
    ];

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Menu mode="horizontal" items={mainItems} style={{ borderBottom: 'none', flex: 1 }} />
            <Menu mode="horizontal" items={logoutItem} style={{ borderBottom: 'none' }} />
        </div>
    );
};

export default Navbar;