// 1. 確認金鑰為你最新的那把
const API_KEY = "AIzaSyD3AhHNmYiRrRWCHFgD0ImARhLas_oUX6A"; 

// 2. 萬用路徑修正：如果 v1beta 失敗，這組網址是目前最穩定的
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
                // 使用官方建議的系統指令格式
                system_instruction: {
                    parts: [{ text: "你是 Ming 的專屬個人助理。語氣親切專業，並在對話中自然地稱呼使用者為 Ming。" }]
                },
                contents: [
                    {
                        role: "user",
                        parts: [{ text: text }]
                    }
                ]
            })
        });

        const data = await response.json();

        if (data.error) {
            // 如果還是 404，這裡會提供更詳細的偵錯資訊
            throw new Error(`代碼 ${data.error.code}: ${data.error.message}`);
        }

        const aiText = data.candidates[0].content.parts[0].text;
        aiMessageDiv.innerText = aiText;
    } catch (error) {
        aiMessageDiv.innerText = '連線失敗：' + error.message + '\n\n提示：Ming，請檢查 Google AI Studio 是否已將此 API Key 設定為 Enabled。';
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
