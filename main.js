// 1. 請在此處貼上「全新」產生的 API Key
// 注意：這裡的 __API_KEY_PLACEHOLDER__ 會被 GitHub 自動替換
const API_KEY = "__API_KEY_PLACEHOLDER__"; 

const MODEL_NAME = "gemini-3-flash-preview"; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

// ... 以下程式碼保持不變，維持你剛才成功的邏輯 ...

// 2. 鎖定 Ming 的專屬正確通道
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
    aiMessageDiv.innerText = 'Ming，正在用新金鑰連線中...';
    chatWindow.appendChild(aiMessageDiv);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ 
                        // 身分指令：讓它記住你叫 Ming
                        text: `(我是 Ming，請親切回答我)\n${text}` 
                    }] 
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            aiMessageDiv.innerText = `❌ 連線失敗\n原因：${data.error.message}`;
            return;
        }

        const aiText = data.candidates[0].content.parts[0].text;
        aiMessageDiv.innerText = aiText;

    } catch (error) {
        aiMessageDiv.innerText = "❌ 網路連線異常。";
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
