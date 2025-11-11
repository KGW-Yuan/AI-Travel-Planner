import { db } from '../config/cloudbase.js';

// 保存对话
export const saveConversation = async (req, res) => {
  try {
    const { question, answer, userId } = req.body;
    if (!question || !answer || !userId) {
      return res.status(400).json({ message: '缺少必要参数' });
    }

    const conversation = {
      userId,
      question,
      answer,
      createdAt: new Date(),
    };

    await db.collection('conversations').add(conversation);
    res.status(201).json({ message: '对话保存成功' });
  } catch (error) {
    console.error('保存对话失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 获取对话历史
export const getConversations = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: '缺少 userId' });
    }

    const result = await db.collection('conversations')
      .where({ userId })
      .orderBy('createdAt', 'desc')
      .get();

    res.status(200).json(result.data);
  } catch (error) {
    console.error('获取对话历史失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};