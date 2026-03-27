// 1. 確認金鑰 (請檢查是否有空格)
const API_KEY = "AIzaSyAZZVLQmfYyJDgjwRDMnGYCxxM5NWKx6jM"; 

// 2. 這是 2026 目前最穩定的 Gemini 3 預覽路徑
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
    aiMessageDiv.innerText = 'Ming，正在連線中...';
    chatWindow.appendChild(aiMessageDiv);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        // 強制要求 AI 認得 Ming
                        text: `(我是 Ming，請親切稱呼我)\n${text}`
                    }]
                }]
            })
        });

        const data = await response.json();

        // 核心錯誤檢查
        if (data.error) {
            aiMessageDiv.innerText = `❌ 錯誤：${data.error.status}\n原因：${data.error.message}`;
            return;
        }

        if (data.candidates && data.candidates[0].content) {
            aiMessageDiv.innerText = data.candidates[0].content.parts[0].text;
        } else {
            aiMessageDiv.innerText = "收到空回應，請再試一次。";
        }

    } catch (error) {
        aiMessageDiv.innerText = "網路連線異常，請檢查金鑰或稍後再試。";
        console.error("Ming，詳細錯誤回報：", error);
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
