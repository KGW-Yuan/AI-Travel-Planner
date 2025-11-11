import React, { useState, useRef } from 'react';
import { Button, Typography, Spin, Alert, Input } from 'antd';
import axios from 'axios';
import MainLayout from '../components/MainLayout';

const { Title, Paragraph } = Typography;

const VoiceRecognitionPage = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);

    // New states for DeepSeek integration
    const [apiKey, setApiKey] = useState('');
    const [llmResponse, setLlmResponse] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [llmError, setLlmError] = useState('');

    const handleToggleRecording = () => {
        if (isRecording) {
            mediaRecorder.current.stop();
            setIsRecording(false);
        } else {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    mediaRecorder.current = new MediaRecorder(stream);
                    mediaRecorder.current.ondataavailable = (event) => {
                        audioChunks.current.push(event.data);
                    };
                    mediaRecorder.current.onstop = () => {
                        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
                        audioChunks.current = [];
                        sendAudioToServer(audioBlob);
                    };
                    mediaRecorder.current.start();
                    setIsRecording(true);
                    setTranscription('');
                    setError('');
                    setLlmResponse(''); // Clear previous LLM response
                    setLlmError('');    // Clear previous LLM error
                })
                .catch(err => {
                    console.error("Error accessing microphone:", err);
                    setError('无法访问麦克风，请检查您的设备权限。');
                });
        }
    };

    const sendAudioToServer = (audioBlob) => {
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
            const base64Audio = reader.result.split(',')[1];
            setLoading(true);
            setError('');
            axios.post('http://localhost:5001/api/voice/recognize', { audio: base64Audio })
                .then(response => {
                    setTranscription(response.data.text);
                })
                .catch(err => {
                    console.error("Error sending audio to server:", err);
                    const serverError = err.response && err.response.data ? err.response.data.error : '语音识别服务出现未知错误。';
                    setError(`请求失败: ${serverError}`);
                })
                .finally(() => {
                    setLoading(false);
                });
        };
    };

    // Function to send transcription to the large model
    const handleSendToModel = () => {
        if (!transcription || !apiKey) {
            setLlmError('API Key 和识别结果不能为空。');
            return;
        }
        setIsSending(true);
        setLlmError('');
        setLlmResponse('');

        // This will call a new backend endpoint that we need to create
        axios.post('http://localhost:5001/api/llm/chat', {
            text: transcription,
            apiKey: apiKey
        })
        .then(response => {
            setLlmResponse(response.data.reply);
        })
        .catch(err => {
            console.error("Error sending to LLM:", err);
            const serverError = err.response && err.response.data ? err.response.data.error : '与大模型通信时出现未知错误。';
            setLlmError(`请求失败: ${serverError}`);
        })
        .finally(() => {
            setIsSending(false);
        });
    };

    return (
        <MainLayout>
            <div style={{ maxWidth: '800px', margin: 'auto' }}>
                <Spin spinning={loading || isSending} tip={loading ? "正在识别中..." : "正在与大模型通信..."} size="large">
                    <div style={{ textAlign: 'center', minHeight: '300px' }}>
                        <Title level={2}>语音交互</Title>
                    <Paragraph>
                        点击“开始录音”按钮进行说话，结束后系统将识别您的语音。然后输入您的DeepSeek API Key，点击“生成旅行计划”按钮进行对话。
                    </Paragraph>
                    
                    <Button
                        type="primary"
                        danger={isRecording}
                        onClick={handleToggleRecording}
                        style={{ marginBottom: '20px' }}
                        disabled={loading || isSending}
                    >
                        {isRecording ? '停止录音' : '开始录音'}
                    </Button>

                    <Title level={4} style={{ marginTop: '20px', textAlign: 'left' }}>DeepSeek API Key</Title>
                    <Input.Password
                        placeholder="请输入您的 DeepSeek API Key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        style={{ marginBottom: '20px' }}
                    />

                    {error && <Alert message={error} type="error" showIcon style={{ marginTop: '20px' }} />}

                    {transcription && (
                        <div style={{ marginTop: '20px', textAlign: 'left' }}>
                            <Title level={4}>识别结果：</Title>
                            <Paragraph style={{ background: '#f0f2f5', padding: '15px', borderRadius: '4px' }}>
                                {transcription}
                            </Paragraph>
                            <Button
                                type="primary"
                                onClick={handleSendToModel}
                                loading={isSending}
                                disabled={!apiKey || !transcription}
                                style={{ marginTop: '10px' }}
                            >
                                生成旅行计划
                            </Button>
                        </div>
                    )}

                    {llmError && <Alert message={llmError} type="error" showIcon style={{ marginTop: '20px' }} />}

                    {llmResponse && (
                        <div style={{ marginTop: '20px', textAlign: 'left' }}>
                            <Title level={4}>大模型回复：</Title>
                            <Paragraph style={{ background: '#e6f7ff', padding: '15px', borderRadius: '4px' }}>
                                {llmResponse}
                            </Paragraph>
                        </div>
                    )}
                </div>
            </Spin>
        </div>
        </MainLayout>
    );
};

export default VoiceRecognitionPage;