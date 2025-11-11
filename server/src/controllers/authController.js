import { db } from '../config/cloudbase.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const usersCollection = db.collection('users');

const generateToken = (id) => {
  if (!id) {
    throw new Error('用于生成 Token 的 ID 不能为空');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userExistsResult = await usersCollection.where({ username }).get();
    if (userExistsResult.data.length > 0) {
      return res.status(400).json({ message: '用户名已存在' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUserResult = await usersCollection.add({
      username,
      password: hashedPassword,
      createdAt: new Date(),
    });

    if (newUserResult.id) {
      res.status(201).json({
        _id: newUserResult.id,
        username,
        token: generateToken(newUserResult.id),
      });
    } else {
      res.status(400).json({ message: '用户创建失败，无法获取 ID' });
    }
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  console.log(`[AUTH] 登录流程开始，目标用户: ${username}`);

  try {
    console.log('[AUTH] 第1步: 开始执行数据库查询...');
    const queryStartTime = Date.now();

    // 执行数据库查询
    const userResult = await usersCollection.where({ username }).get();

    const queryEndTime = Date.now();
    console.log(`[AUTH] 第2步: 数据库查询完成，耗时: ${queryEndTime - queryStartTime} 毫秒。`);

    if (userResult.data.length === 0) {
      console.log('[AUTH] 诊断: 用户名在数据库中未找到。');
      return res.status(401).json({ message: '无效的用户名或密码' });
    }

    console.log('[AUTH] 诊断: 用户已在数据库中找到。');
    const user = userResult.data[0];
    const userId = user._id;

    if (!userId) {
      console.error('[AUTH] 严重错误: 找到了用户但其 _id 为空！');
      return res.status(500).json({ message: '服务器内部错误：无法获取用户ID' });
    }

    console.log('[AUTH] 第3步: 开始比较密码...');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('[AUTH] 第4步: 密码比较完成。');

    if (isMatch) {
      console.log('[AUTH] 诊断: 密码匹配成功。正在生成Token...');
      res.json({
        _id: userId,
        username: user.username,
        token: generateToken(userId),
      });
      console.log('[AUTH] 登录成功，响应已发送。');
    } else {
      console.log('[AUTH] 诊断: 密码不匹配。');
      res.status(401).json({ message: '无效的用户名或密码' });
    }
  } catch (error) {
    const queryEndTime = Date.now();
    console.error(`[AUTH] 登录流程在第1步和第2步之间出现异常，已耗时 ${queryEndTime - (queryStartTime || 0)} 毫秒。`);
    console.error('[AUTH] 捕获到致命错误:', error);
    
    if (error.message && error.message.includes('longer than 3s')) {
        console.error('[AUTH] 最终诊断: 错误源头是数据库查询超时。这表明数据库处理该查询的性能不足，无法在规定时间内返回结果。');
    }
    
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
};