// 使用你最新的 API Key
const API_KEY = "AIzaSyCfHAZTmRhq-S4D86jY2gUdYgUOn2HXQlw"; 

// 修正 1：改用 v1 正式版路徑，這比 v1beta 更穩定
// 修正 2：模型名稱加上 -latest 確保抓到目前可用的最新版
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const chatWindow = document.getElementById('chat-window');
const inputField = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

async function sendMessage() {
    const text = inputField.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    inputField.value = '';

    const aiMessageDiv = document.createElement('div');
    aiMessageDiv.className = 'message ai';
    aiMessageDiv.innerText = '正在連線正式版模型...';
    chatWindow.appendChild(aiMessageDiv);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: text }] }]
            })
        });

        const data = await response.json();

        // 這裡會抓到最細節的 404 原因
        if (data.error) {
            console.error('詳細錯誤資訊:', data.error);
            throw new Error(`代碼 ${data.error.code}: ${data.error.message}`);
        }

        const aiText = data.candidates[0].content.parts[0].text;
        aiMessageDiv.innerText = aiText;
    } catch (error) {
        aiMessageDiv.innerText = '連線失敗：' + error.message;
    }
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function addMessage(text, role) {
    const div = document.createElement('div');
    div.className = `message ${role}`;
    div.innerText = text;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

sendBtn.onclick = sendMessage;
inputField.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };
