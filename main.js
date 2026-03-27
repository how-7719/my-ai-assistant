// 使用你最新產生的 API Key
const API_KEY = "AIzaSyCfHAZTmRhq-S4D86jY2gUdYgUOn2HXQlw"; 

// 修正：在 2026 年，v1beta 正式支援 gemini-3-flash-preview
// 這個模型名稱必須跟你在 AI Studio 右上角看到的一模一樣
const MODEL_NAME = "gemini-3-flash-preview";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

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
    aiMessageDiv.innerText = '正在連線 Gemini 3 核心...';
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

        // 如果報 404，代表模型名稱還是不對，我們直接顯示回傳的所有錯誤資訊
        if (data.error) {
            console.error('API Error Response:', data);
            throw new Error(`代碼 ${data.error.code}: ${data.error.message}`);
        }

        const aiText = data.candidates[0].content.parts[0].text;
        aiMessageDiv.innerText = aiText;
    } catch (error) {
        aiMessageDiv.innerText = '連線失敗：' + error.message;
        console.error('Fetch Error:', error);
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
