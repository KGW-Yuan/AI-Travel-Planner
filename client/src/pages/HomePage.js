import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, InputNumber, Select, Card, Spin, message, Typography } from 'antd';
import axios from 'axios';
import MainLayout from '../components/MainLayout'; // 1. 引入 MainLayout 组件

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
// Removed unused TextArea import

const HomePage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [travelPlan, setTravelPlan] = useState('');

    const onFinish = async (values) => {
        setLoading(true);
        setTravelPlan('');

        try {
            const [startDate, endDate] = values.dateRange;
            const duration = endDate.diff(startDate, 'days') + 1;

            const submissionData = {
                destination: values.destination,
                duration: duration,
                travelers: values.travelers,
                budget: values.budget,
                travelStyle: values.travelStyle,
                interests: values.interests || [],
                deepseek_api_key: values.deepseek_api_key,
            };

            const response = await axios.post('/api/plan/generate', submissionData);

            if (response.data && response.data.plan) {
                const plan = response.data.plan;
                setTravelPlan(plan);
                message.success('成功生成旅行计划！');

                // --- 开始：保存对话到历史记录 ---
                const travelStyleMap = {
                    budget: '穷游',
                    balanced: '均衡',
                    luxury: '奢侈',
                };

                const question = `我的旅行需求如下：
- 目的地: ${values.destination}
- 时长: ${duration} 天
- 人数: ${values.travelers} 人
- 预算: ${values.budget} 人民币
- 风格: ${travelStyleMap[values.travelStyle] || '均衡'}
- 兴趣: ${(values.interests || []).join('，')}
请为我生成一份详尽的旅行计划。`;

                try {
                    // 注意：这里的 userId 是一个临时占位符。
                    // 在一个完整的应用中，您应该从用户认证状态中获取当前用户的ID。
                    await axios.post('/api/history', {
                        question: question,
                        answer: plan,
                        userId: 'temp-user-01' // 占位符用户ID
                    });
                } catch (historyError) {
                    console.error('保存历史记录失败:', historyError);
                    // 即便历史记录保存失败，也不影响主流程，仅给出提示
                    message.error('保存历史记录失败，但计划已生成。');
                }
                // --- 结束：保存对话到历史记录 ---

            } else {
                throw new Error('AI返回的数据格式不正确');
            }
        } catch (error) {
            console.error('生成旅行计划失败:', error);
            const errorMessage = error.response ?
                (error.response.data.message || '发生未知错误') :
                '网络请求失败';
            message.error(`生成失败: ${errorMessage}`);
            // Display the raw error object for debugging
            setTravelPlan(error);
        } finally {
            setLoading(false);
        }
    };

    const renderTravelPlan = () => {
        if (loading) {
            return <Spin size="large" />;
        }

        if (!travelPlan) {
            return <p>请填写左侧表单以生成您的专属旅行计划。</p>;
        }

        // Safely render the travel plan, whether it's a string or an object
        const planContent = typeof travelPlan === 'string' ?
            travelPlan :
            JSON.stringify(travelPlan, null, 2);

        return <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{planContent}</pre>;
    };


    return (
        <MainLayout>
            <Title level={2} className="title" style={{ textAlign: 'center', marginBottom: '20px' }}>AI 旅行计划生成器</Title>
            <div className="main-content" style={{ display: 'flex', gap: '20px' }}>
                <div className="form-section" style={{ flex: 1 }}>
                    <Card title="输入您的旅行信息">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            initialValues={{
                                travelStyle: 'balanced',
                                interests: [],
                            }}
                        >
                            <Form.Item name="destination" label="目的地" rules={[{ required: true, message: '请输入目的地' }]}>
                                <Input placeholder="例如：北京" />
                            </Form.Item>

                            <Form.Item name="dateRange" label="旅行日期" rules={[{ required: true, message: '请选择旅行日期' }]}>
                                <RangePicker style={{ width: '100%' }} />
                            </Form.Item>

                            <Form.Item name="travelers" label="旅行人数" rules={[{ required: true, message: '请输入旅行人数' }]}>
                                <InputNumber min={1} style={{ width: '100%' }} placeholder="例如：2" />
                            </Form.Item>

                            <Form.Item name="budget" label="预算（元）" rules={[{ required: true, message: '请输入预算' }]}>
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="例如：5000" />
                            </Form.Item>

                            <Form.Item name="travelStyle" label="旅行风格">
                                <Select>
                                    <Option value="budget">穷游</Option>
                                    <Option value="balanced">均衡</Option>
                                    <Option value="luxury">奢侈</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item name="interests" label="兴趣点 (回车确认)">
                                <Select mode="tags" style={{ width: '100%' }} placeholder="例如：购物、美食、历史" tokenSeparators={[',', '\n']} />
                            </Form.Item>

                            <Form.Item name="deepseek_api_key" label="DeepSeek API Key" rules={[{ required: true, message: '请输入你的DeepSeek API Key' }]}>
                                <Input.Password placeholder="请输入你的DeepSeek API Key" />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading} block>
                                    生成计划
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
                <div className="plan-section" style={{ flex: 1 }}>
                    <Card title="您的专属旅行计划">
                        {renderTravelPlan()}
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
};

export default HomePage;