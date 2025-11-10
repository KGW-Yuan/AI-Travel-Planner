import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      // 后端API端点稍后也会一并修改
      const response = await axios.post('http://localhost:5001/api/auth/register', values);
      console.log('注册成功:', response.data);
      message.success('注册成功！请登录。');
      navigate('/login');
    } catch (error) {
      message.error(error.response?.data?.message || '注册失败！');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card title="注册" style={{ width: 400 }}>
        <Form name="register" onFinish={onFinish}>
          <Form.Item name="username" rules={[{ required: true, message: '请输入您的用户名!' }]}>
            <Input placeholder="用户名" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入您的密码!' }]}>
            <Input.Password placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              注册
            </Button>
            已有账户？ <a href="/login">立即登录</a>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;