// 1. 使用你提供的最新金鑰 (請確認前後沒有多餘空格)
const API_KEY = "AIzaSyAZZVLQmfYyJDgjwRDMnGYCxxM5NWKx6jM"; 

// 2. 這是 2026 年最穩定的標準路徑
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
    aiMessageDiv.innerText = 'Ming，正在與 Google 伺服器通訊...';
    chatWindow.appendChild(aiMessageDiv);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ 
                        // 在訊息中鎖定 Ming 的身分
                        text: `(我是 Ming，請親切回答我)\n${text}` 
                    }] 
                }]
            })
        });

        const data = await response.json();

        // 偵錯模式：如果失敗，直接把原因印在對話框
        if (data.error) {
            aiMessageDiv.innerText = `❌ 連線失敗！\n代碼：${data.error.code}\n狀態：${data.error.status}\n原因：${data.error.message}`;
            return;
        }

        const aiText = data.candidates[0].content.parts[0].text;
        aiMessageDiv.innerText = aiText;

    } catch (error) {
        aiMessageDiv.innerText = "❌ 網路異常：請確認您的 GitHub Pages 是使用 HTTPS 連線。";
        console.error('Ming，錯誤詳情:', error);
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
