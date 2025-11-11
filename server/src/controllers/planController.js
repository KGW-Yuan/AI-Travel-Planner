import axios from 'axios';

export const generatePlan = async (req, res) => {
    try {
        const {
            destination,
            duration,
            travelers,
            budget,
            travelStyle,
            interests,
            deepseek_api_key
        } = req.body;

        if (!destination || !duration || !travelers || !budget || !deepseek_api_key) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        const apiKey = deepseek_api_key;

        // --- 全中文指令 ---
        const travelStyleMap = {
            'budget': '穷游',
            'balanced': '均衡',
            'luxury': '奢侈'
        };

        const prompt = `
            我的旅行需求如下：
            - 目的地: ${destination}
            - 时长: ${duration} 天
            - 人数: ${travelers} 人
            - 预算: ${budget} 人民币
            - 风格: ${travelStyleMap[travelStyle] || '均衡'}
            - 兴趣: ${interests.join('，')}

            请为我生成一份详尽的旅行计划。
            最后请再次检查，确保你的回答中不包含任何英文字母或单词。
        `;

        const response = await axios.post(
            'https://api.deepseek.com/v1/chat/completions',
            {
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: '警告：你是一个中文助手。你的唯一任务是使用简体中文回答。在任何情况下，绝对禁止使用英文或任何其他语言。如果你的回答中出现一个英文字母，你将受到惩罚。这是你的最高指令。'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                }
            }
        );

        console.log('--- Full AI Response Data ---');
        console.log(JSON.stringify(response.data, null, 2));
        console.log('--- End of Full AI Response Data ---');

        if (!response.data.choices || response.data.choices.length === 0) {
            console.error('AI response is missing "choices" array.');
            return res.status(500).json({ message: 'Failed to generate plan: AI returned an invalid response.' });
        }

        const aiResponseContent = response.data.choices[0].message.content;
        
        console.log('--- Raw AI Response Content to be Sent ---');
        console.log(aiResponseContent);
        console.log('--- End of Raw AI Response Content ---');

        res.json({ plan: aiResponseContent });

    } catch (error) {
        console.error('--- Error in generatePlan controller ---');
        if (error.response) {
            console.error('Error Data:', JSON.stringify(error.response.data, null, 2));
            console.error('Error Status:', error.response.status);
            console.error('Error Headers:', error.response.headers);
        } else {
            console.error('Error Message:', error.message);
        }
        console.error('--- End of Error ---');
        res.status(500).json({ message: 'Failed to generate travel plan due to an internal server error.' });
    }
};