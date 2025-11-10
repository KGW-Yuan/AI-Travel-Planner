const { db } = require('../config/cloudbase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const usersCollection = db.collection('users');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.register = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 检查用户名是否已存在
    const userExistsResult = await usersCollection.where({ username }).get();
    if (userExistsResult.data.length > 0) {
      return res.status(400).json({ message: '用户名已存在' });
    }

    // 哈希密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 创建新用户
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
      res.status(400).json({ message: '无效的用户数据' });
    }
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userResult = await usersCollection.where({ username }).get();

    if (userResult.data.length === 0) {
      return res.status(401).json({ message: '无效的用户名或密码' });
    }

    const user = userResult.data[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: '无效的用户名或密码' });
    }
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};