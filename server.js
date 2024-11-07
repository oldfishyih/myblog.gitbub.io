const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

app.use(cors());
app.use(express.json());

const KIMI_API_KEY = 'sk-FvFvBVdxcQiTVprO4D8SeftDPE7IvKNZYWQJDKviE0rs6k4x';

app.post('/api/chat', async (req, res) => {
    try {
        const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${KIMI_API_KEY}`
            },
            body: JSON.stringify({
                model: "moonshot-v1-8k",
                messages: req.body.messages,
                temperature: 0.7
            })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
}); 