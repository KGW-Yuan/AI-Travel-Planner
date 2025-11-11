import React, { useState, useEffect } from 'react';
import { List, Card, Typography, Spin, message, Empty } from 'antd';
import axios from 'axios';
import MainLayout from '../components/MainLayout';

const { Title, Paragraph } = Typography;

const HistoryPage = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // 注意：这里的 userId 是一个临时占位符。
                const response = await axios.get('/api/history', {
                    params: { userId: 'temp-user-01' } // 占位符用户ID
                });
                setConversations(response.data);
            } catch (error) {
                console.error('获取历史记录失败:', error);
                message.error('获取历史记录失败');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return (
        <MainLayout>
            <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>对话历史</Title>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                    <Spin size="large" />
                </div>
            ) : conversations.length > 0 ? (
                <List
                    grid={{ gutter: 16, column: 1 }}
                    dataSource={conversations}
                    renderItem={item => (
                        <List.Item>
                            <Card title={`提问于: ${new Date(item.createdAt).toLocaleString()}`}>
                                <Title level={5}>你的问题：</Title>
                                <Paragraph>
                                    <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontFamily: 'inherit', margin: 0 }}>
                                        {item.question}
                                    </pre>
                                </Paragraph>
                                <Title level={5} style={{ marginTop: '16px' }}>AI 的回答：</Title>
                                <Paragraph>
                                    <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontFamily: 'inherit', margin: 0 }}>
                                        {item.answer}
                                    </pre>
                                </Paragraph>
                            </Card>
                        </List.Item>
                    )}
                />
            ) : (
                <Empty description="暂无历史记录" />
            )}
        </MainLayout>
    );
};

export default HistoryPage;