import express from 'express';
import { recognizeAudio } from '../controllers/voiceController.js';

const router = express.Router();

// 定义语音识别的 API 路由
// 当接收到 POST 请求到 /api/voice/recognize 时，调用 voiceController 中的 recognizeAudio 函数
router.post('/recognize', recognizeAudio);

export default router;