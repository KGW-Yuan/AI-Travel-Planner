import axios from 'axios';

export const chatWithModel = async (req, res) => {
    const { text, apiKey } = req.body;

    if (!text || !apiKey) {
        return res.status(400).json({ error: 'Missing text or API key' });
    }

    try {
        const response = await axios.post(
            'https://api.deepseek.com/chat/completions',
            {
                model: 'deepseek-chat',
                messages: [
                    {
                        content: 'You are a helpful assistant.',
                        role: 'system'
                    },
                    {
                        content: text,
                        role: 'user'
                    }
                ],
                stream: false // We'll use non-streaming for simplicity
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                }
            }
        );

        const reply = response.data.choices[0]?.message?.content;

        if (reply) {
            res.json({ reply });
        } else {
            res.status(500).json({ error: 'Failed to get a valid response from the model.' });
        }

    } catch (error) {
        console.error('Error communicating with DeepSeek API:', error.response ? error.response.data : error.message);
        const errorMessage = error.response?.data?.error?.message || 'An unknown error occurred.';
        res.status(error.response?.status || 500).json({ error: errorMessage });
    }
};