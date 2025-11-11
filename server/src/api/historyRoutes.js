import express from 'express';
import { saveConversation, getConversations } from '../controllers/historyController.js';

const router = express.Router();

// 保存对话
router.post('/', saveConversation);

// 获取对话历史
router.get('/', getConversations);

export default router;