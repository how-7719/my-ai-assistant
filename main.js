// 1. 使用 Ming 剛剛提供的新金鑰
const API_KEY = "AIzaSyAZZVLQmfYyJDgjwRDMnGYCxxM5NWKx6jM"; 

// 2. 這是 Ming 之前測試成功、絕對正確的專屬路徑
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
    aiMessageDiv.innerText = 'Ming，請稍等，我正在思考...';
    chatWindow.appendChild(aiMessageDiv);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ 
                        // 這裡直接鎖定 Ming 的身分指令
                        text: `(指令：我是 Ming。請用親切專業的語氣回答我，並偶爾稱呼我為 Ming。)\n${text}` 
                    }] 
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(`代碼 ${data.error.code}: ${data.error.message}`);
        }

        const aiText = data.candidates[0].content.parts[0].text;
        aiMessageDiv.innerText = aiText;
    } catch (error) {
        aiMessageDiv.innerText = '連線失敗：' + error.message;
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
