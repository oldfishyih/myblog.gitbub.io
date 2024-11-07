// 轮播图功能
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.carousel-inner img');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const indicators = document.querySelectorAll('.indicator');
    let currentIndex = 0;

    // 确保至少有一张图片
    if (images.length === 0) {
        console.error('No images found in carousel');
        return;
    }

    function showImage(index) {
        images.forEach(img => {
            img.classList.remove('active');
            img.style.transform = 'translateX(100%)';
        });
        images[index].classList.add('active');
        images[index].style.transform = 'translateX(0)';
        
        // 更新指示器状态
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    });

    // 自动轮播
    setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    }, 5000);

    // 初始显示第一张图片
    showImage(0);

    // 为每个指示器添加点击事件
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            showImage(currentIndex);
        });
    });

    const header = document.querySelector('.header');
    const headerTitle = header.querySelector('h1');
    
    // 设置标题文本属性用于发光效果
    headerTitle.setAttribute('data-text', headerTitle.textContent);
    
    // 添加入场动画类
    setTimeout(() => {
        header.style.opacity = '1';
        header.style.transform = 'scale(1)';
    }, 100);

    // 监听滚动事件
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // 根据滚动位置计算标题透明度和缩放
        if (scrollPosition > windowHeight * 0.3) {
            header.classList.add('fade-out');
        } else {
            header.classList.remove('fade-out');
            
            // 视差滚动效果
            const opacity = 1 - (scrollPosition / (windowHeight * 0.3));
            const scale = 1 - (scrollPosition / (windowHeight * 0.3)) * 0.2;
            const blur = scrollPosition / 30;
            
            header.style.opacity = opacity;
            header.style.transform = `scale(${scale})`;
            headerTitle.style.filter = `blur(${blur}px)`;
        }
    });

    // 修改小人互动功能
    const mascot = document.querySelector('.mascot');
    const mascotImages = document.querySelectorAll('.mascot img');
    const speechBubble = document.getElementById('speech-bubble');
    const mascotText = document.getElementById('mascot-text');

    // 互动文本和对应的表情
    const interactions = [
        { text: "你好呀~", expression: "dragon-wave.png" },
        { text: "要不要一起玩呢？", expression: "dragon-happy.png" },
        { text: "摸摸头~", expression: "dragon-happy.png" },
        { text: "今天天气真好呢！", expression: "dragon-normal.png" },
        { text: "要吃小饼干吗？", expression: "dragon-happy.png" },
        { text: "让我陪你聊天吧~", expression: "dragon-wave.png" },
        { text: "喜欢这个网站吗？", expression: "dragon-happy.png" },
        { text: "我要睡觉了~", expression: "dragon-sleep.png" }
    ];

    function changeExpression(expressionFile) {
        mascotImages.forEach(img => {
            if (img.src.includes(expressionFile)) {
                img.classList.add('active');
            } else {
                img.classList.remove('active');
            }
        });
    }

    // 其他代码保持不变...
});

// AI 对话功能
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// 添加示例消息
function addExampleMessage() {
    appendMessage('bot', '你好！我是AI助手，有什么可以帮你的吗？');
}

function appendMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.style.padding = '10px';
    messageDiv.style.margin = '5px';
    messageDiv.style.borderRadius = '5px';
    
    if (sender === 'user') {
        messageDiv.style.backgroundColor = '#007bff';
        messageDiv.style.color = 'white';
        messageDiv.style.marginLeft = 'auto';
        messageDiv.style.maxWidth = '70%';
    } else {
        messageDiv.style.backgroundColor = '#e9ecef';
        messageDiv.style.color = 'black';
        messageDiv.style.marginRight = 'auto';
        messageDiv.style.maxWidth = '70%';
    }
    
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 修改 sendMessage 函数
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // 显示用户消息
    appendMessage('user', message);
    userInput.value = '';

    try {
        // 调用 Kimi API
        const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer sk-FvFvBVdxcQiTVprO4D8SeftDPE7IvKNZYWQJDKviE0rs6k4x'
            },
            body: JSON.stringify({
                model: "moonshot-v1-8k",
                messages: [{
                    role: "user",
                    content: message
                }],
                temperature: 0.7
            })
        });

        const data = await response.json();
        
        if (data.choices && data.choices[0] && data.choices[0].message) {
            appendMessage('bot', data.choices[0].message.content);
        } else {
            appendMessage('bot', '抱歉，我现在无法正确理解您的问题。');
        }
    } catch (error) {
        console.error('Error:', error);
        appendMessage('bot', '抱歉，发生了一些错误，请稍后再试。');
    }
}

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// 页面加载时添加示例消息
document.addEventListener('DOMContentLoaded', addExampleMessage);

// 滚动效果
document.addEventListener('DOMContentLoaded', function() {
    const chatContainer = document.querySelector('.chat-container');
    const carouselContainer = document.querySelector('.carousel-container');

    window.addEventListener('scroll', function() {
        // 获取元素的位置信息
        const chatRect = chatContainer.getBoundingClientRect();
        const carouselRect = carouselContainer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // 当元素底部接触到视口底部时添加消失动画
        if (chatRect.bottom >= windowHeight && !chatContainer.classList.contains('fade-out')) {
            chatContainer.classList.add('fade-out');
        } else if (chatRect.bottom < windowHeight) {
            chatContainer.classList.remove('fade-out');
        }
        
        if (carouselRect.bottom >= windowHeight && !carouselContainer.classList.contains('fade-out')) {
            carouselContainer.classList.add('fade-out');
        } else if (carouselRect.bottom < windowHeight) {
            carouselContainer.classList.remove('fade-out');
        }
    });
});

// 修改交叉观察器配置
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // 简化动画逻辑
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, entry.target.classList.contains('chat-container') ? 200 : 400);
        }
    });
}, {
    threshold: 0.1  // 降低阈值，使动画更容易触发
});

// 观察元素
document.querySelectorAll('.chat-container, .carousel-container').forEach(el => {
    observer.observe(el);
});

// 在现有代码后添加
document.addEventListener('DOMContentLoaded', function() {
    const changeBackgroundBtn = document.getElementById('changeBackgroundBtn');
    const videoBackground = document.querySelector('.video-background');
    let isVideoBackground = true;

    changeBackgroundBtn.addEventListener('click', function() {
        if (isVideoBackground) {
            // 切换到图片背景
            videoBackground.innerHTML = `
                <img src="image_venom/unstoppable-venom-the-last-dance-kv.jpg" 
                     style="width: 100%; height: 100%; object-fit: cover;">
            `;
            changeBackgroundBtn.textContent = '切换回视频';
        } else {
            // 切换回视频背景
            videoBackground.innerHTML = `
                <video autoplay muted loop id="myVideo">
                    <source src="ved/ab98a976bbe985899054db56040ba9f9.mp4" type="video/mp4">
                </video>
            `;
            const video = document.getElementById('myVideo');
            video.style.width = '100%';
            video.style.height = '100%';
            video.style.objectFit = 'cover';
            changeBackgroundBtn.textContent = '切换背景';
        }
        isVideoBackground = !isVideoBackground;
    });
});