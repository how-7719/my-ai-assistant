// 使用你最新的 2026 Gemini 3 API Key
const API_KEY = "AIzaSyBnSKr6hZpUFukLfy-QlzQPcplzQCpzDQw"; 
// 這是目前最穩定的 Gemini 3 Flash 連線路徑
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

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
    aiMessageDiv.innerText = '助理正在接收訊號...';
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

        // 如果 Google 回傳錯誤訊息
        if (data.error) {
            throw new Error(`代碼 ${data.error.code}: ${data.error.message}`);
        }

        // 解析回覆內容
        const aiText = data.candidates[0].content.parts[0].text;
        aiMessageDiv.innerText = aiText;
    } catch (error) {
        aiMessageDiv.innerText = '連線失敗：' + error.message;
        console.error('連線錯誤詳情:', error);
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
