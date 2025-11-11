import React from 'react';
import { Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
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

    const navbarStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '20px',
        padding: '0 20px',
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.3)',
    };

    const menuStyle = {
        borderBottom: 'none',
        background: 'transparent',
        flex: 1,
    };

    const logoutMenuStyle = {
        borderBottom: 'none',
        background: 'transparent',
    };

    return (
        <div style={navbarStyle}>
            <Menu mode="horizontal" items={mainItems} style={menuStyle} />
            <Menu mode="horizontal" items={logoutItem} style={logoutMenuStyle} />
        </div>
    );
};

export default Navbar;