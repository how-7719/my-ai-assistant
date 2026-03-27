// 1. 使用 Ming 最新的 API Key
const API_KEY = "AIzaSyAZZVLQmfYyJDgjwRDMnGYCxxM5NWKx6jM"; 

// 2. 關鍵修正：將模型名稱對齊你帳號權限內的 Gemini 3
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
    aiMessageDiv.innerText = 'Ming，正在透過 Gemini 3 通道連線...';
    chatWindow.appendChild(aiMessageDiv);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ 
                        // 身分指令：確保它叫你 Ming
                        text: `(我是 Ming，請親切回答我)\n${text}` 
                    }] 
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            // 診斷：如果還是失敗，顯示最底層的原因
            aiMessageDiv.innerText = `❌ 權限對接失敗\n代碼：${data.error.code}\n原因：${data.error.message}`;
            return;
        }

        const aiText = data.candidates[0].content.parts[0].text;
        aiMessageDiv.innerText = aiText;

    } catch (error) {
        aiMessageDiv.innerText = "❌ 網路異常，請確認金鑰狀態。";
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
