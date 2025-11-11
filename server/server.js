import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './src/api/authRoutes.js';
import llmRoutes from './src/api/llmRoutes.js';
import planRoutes from './src/api/planRoutes.js';
import voiceRoutes from './src/api/voiceRoutes.js';
import configRoutes from './src/api/configRoutes.js';
import historyRoutes from './src/api/historyRoutes.js'; // 导入新路由

const app = express();
const port = process.env.PORT || 5001;

// 更强大的 CORS 设置
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: "Content-Type,Authorization",
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// 增加 JSON 请求体的大小限制
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API 路由
app.use('/api/config', configRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/plan', planRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/llm', llmRoutes);
app.use('/api/history', historyRoutes); // 注册新路由

// 处理预检请求
app.options('*', cors(corsOptions));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});