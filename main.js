// 使用原生 Fetch API 連線至最新的 Gemini 3 模型
const API_KEY = "AIzaSyB8qw1qVY975f4Iho5MxvtNVG12c9PD28Q"; 
// 使用 v1beta 並指定最新模型 gemini-3-flash-preview
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`;

const chatWindow = document.getElementById('chat-window');
const inputField = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

async function sendMessage() {
    const text = inputField.value.trim();
    if (!text) return;

    // 1. 顯示使用者訊息
    addMessage(text, 'user');
    inputField.value = '';

    // 2. 顯示 AI 正在連線
    const aiMessageDiv = document.createElement('div');
    aiMessageDiv.className = 'message ai';
    aiMessageDiv.innerText = '正在透過 Gemini 3 連線中...';
    chatWindow.appendChild(aiMessageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    try {
        // 3. 發送請求至 Google 伺服器
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: text }] }]
            })
        });

        const data = await response.json();

        // 檢查是否有錯誤回傳
        if (data.error) {
            throw new Error(`代碼 ${data.error.code}: ${data.error.message}`);
        }

        // 4. 解析並顯示 AI 回覆
        const aiText = data.candidates[0].content.parts[0].text;
        aiMessageDiv.innerText = aiText;
    } catch (error) {
        aiMessageDiv.innerText = '連線失敗：' + error.message;
        console.error('API Error:', error);
    }
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// 輔助函式：建立訊息氣泡
function addMessage(text, role) {
    const div = document.createElement('div');
    div.className = `message ${role}`;
    div.innerText = text;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// 綁定點擊與 Enter 鍵
sendBtn.onclick = sendMessage;
inputField.onkeypress = (e) => {
    if (e.key === 'Enter') sendMessage();
};
