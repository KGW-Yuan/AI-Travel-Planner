import React from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
    const navigate = useNavigate();

    const titleStyle = {
        fontSize: '48px',
        fontWeight: 'bold',
        color: 'transparent',
        background: 'linear-gradient(45deg, #fff, #f0f, #0ff)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        textAlign: 'center',
        textShadow: '0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.3)',
        marginBottom: '24px',
    };

    const onFinish = async (values) => {
        try {
            const response = await axios.post('http://localhost:5001/api/auth/login', values);
            if (response.data.success) {
                message.success('登录成功');
                localStorage.setItem('userInfo', JSON.stringify(response.data.user));
                navigate('/home');
            } else {
                message.error(response.data.message || '登录失败');
            }
        } catch (error) {
            message.error(error.response?.data?.message || '登录时发生错误');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h1 style={titleStyle}>
                AI 旅行规划师
            </h1>
            <Card style={{
                width: '350px',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
            }}>
                <Form
                    name="login"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: '请输入您的用户名!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="用户名" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: '请输入您的密码!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="密码" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                            登录
                        </Button>
                    </Form.Item>
                    <div style={{ textAlign: 'center' }}>
                        还没有账户？ <Link to="/register">立即注册</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default LoginPage;