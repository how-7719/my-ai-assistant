// 1. 使用你最新產生的 API Key
const API_KEY = "AIzaSyCfHAZTmRhq-S4D86jY2gUdYgUOn2HXQlw"; 

// 2. 設定多個可能的模型名稱 (2026 最新清單)
const MODELS = [
    "gemini-3-flash-preview", 
    "gemini-1.5-flash", 
    "gemini-pro"
];

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
    aiMessageDiv.innerText = '正在尋找可用的模型路徑...';
    chatWindow.appendChild(aiMessageDiv);

    // 自動嘗試所有模型路徑
    for (const modelName of MODELS) {
        try {
            // 嘗試 v1beta 版本路徑
            const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: text }] }]
                })
            });

            const data = await response.json();

            if (!data.error) {
                const aiText = data.candidates[0].content.parts[0].text;
                aiMessageDiv.innerText = aiText;
                return; // 成功連線，直接跳出迴圈
            } else {
                console.warn(`嘗試 ${modelName} 失敗: ${data.error.message}`);
            }
        } catch (e) {
            console.error(`連線 ${modelName} 發生錯誤`);
        }
    }

    aiMessageDiv.innerText = '連線失敗：所有模型路徑皆回報 404。請確認您的 Google 帳號是否具備 Gemini API 使用權限。';
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
