// 1. 使用你最新的 API Key
const API_KEY = "AIzaSyD3AhHNmYiRrRWCHFgD0ImARhLas_oUX6A"; 

// 2. 使用 2026 年最相容的 v1beta 路徑
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
    aiMessageDiv.innerText = 'Ming，請稍等，我正在思考...';
    chatWindow.appendChild(aiMessageDiv);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [{ 
                            // 這裡直接設定身分指令，確保它記得你是 Ming
                            text: `指令：你是 Ming 的個人助理。請用親切、聰明且專業的語氣說話。在適當的時候請稱呼使用者為 Ming。\n\n目前訊息：${text}` 
                        }]
                    }
                ]
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(`代碼 ${data.error.code}: ${data.error.message}`);
        }

        const aiText = data.candidates[0].content.parts[0].text;
        aiMessageDiv.innerText = aiText;
    } catch (error) {
        // 如果依然 404，這裡會提供 Ming 明確的除錯建議
        aiMessageDiv.innerText = '連線失敗：' + error.message + '\n\n提示：Ming，如果看到 404，代表網頁讀取到舊快取，請務必按 Ctrl+F5 刷新！';
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
