import React from 'react';
import Navbar from './Navbar';

const MainLayout = ({ children }) => {
    const contentStyle = {
        padding: '20px',
        margin: '0 20px 20px 20px',
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.3)',
    };

    return (
        <div>
            <Navbar />
            <div style={contentStyle}>
                {children}
            </div>
        </div>
    );
};

export default MainLayout;