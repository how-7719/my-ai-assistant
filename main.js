// 使用你最新的 2026 Gemini 3 API Key
const API_KEY = "AIzaSyBnSKr6hZpUFukLfy-QlzQPcplzQCpzDQw"; 
// 關鍵修正：路徑改為 gemini-3-flash-preview (這是你截圖中顯示的模型)
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`;

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
    aiMessageDiv.innerText = '正在連線最新的 Gemini 3 伺服器...';
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

        // 如果連 Gemini 3 也報 404，這裡會捕捉到並提醒
        if (data.error) {
            throw new Error(`代碼 ${data.error.code}: ${data.error.message}`);
        }

        const aiText = data.candidates[0].content.parts[0].text;
        aiMessageDiv.innerText = aiText;
    } catch (error) {
        aiMessageDiv.innerText = '連線失敗：' + error.message + '\n\n提示：請確認您的 Google AI Studio 介面右上角顯示的模型名稱是否為 gemini-3-flash-preview。';
        console.error('API Error:', error);
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
