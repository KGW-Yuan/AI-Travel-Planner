import 'dotenv/config';

export const getAmapKey = (req, res) => {
    res.json({
        amapKey: process.env.AMAP_KEY,
        amapSecret: process.env.AMAP_SECRET
    });
};