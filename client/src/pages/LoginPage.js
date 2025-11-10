import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      // 后端API端点稍后也会一并修改
      const response = await axios.post('http://localhost:5001/api/auth/login', values);
      console.log('登录成功:', response.data);
      // 在本地存储中保存用户信息和token
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      navigate('/');
    } catch (error) {
      message.error(error.response?.data?.message || '登录失败！');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card title="登录" style={{ width: 400 }}>
        <Form name="login" onFinish={onFinish}>
          <Form.Item name="username" rules={[{ required: true, message: '请输入您的用户名!' }]}>
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入您的密码!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              登录
            </Button>
            或 <a href="/register">立即注册!</a>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;