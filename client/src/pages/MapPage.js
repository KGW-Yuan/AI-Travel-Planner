import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MainLayout from '../components/MainLayout';

const MapPage = () => {
    const [amapKey, setAmapKey] = useState(null);

    useEffect(() => {
        const fetchAmapKey = async () => {
            try {
                const response = await axios.get('/api/config/amap-key');
                setAmapKey(response.data.amapKey);
            } catch (error) {
                console.error('Error fetching AMap key:', error);
            }
        };

        fetchAmapKey();
    }, []);

    useEffect(() => {
        if (amapKey) {
            const script = document.createElement('script');
            script.src = `https://webapi.amap.com/maps?v=2.0&key=${amapKey}`;
            script.async = true;
            script.onload = () => {
                new window.AMap.Map('container', {
                    zoom: 11,
                    center: [116.397428, 39.90923],
                });
            };
            document.head.appendChild(script);
        }
    }, [amapKey]);

    return (
        <MainLayout>
            <div id="container" style={{ width: '100%', height: 'calc(100vh - 104px)' }}></div>
        </MainLayout>
    );
};

export default MapPage;