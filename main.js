const API_KEY = "__API_KEY_PLACEHOLDER__"; 
const MODEL_NAME = "gemini-3-flash-preview"; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

const chatWindow = document.getElementById('chat-window');
const inputField = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// 💡 頁面載入時：讀取 localStorage
window.onload = () => {
    const savedChat = localStorage.getItem('ming_chat_history');
    if (savedChat) {
        chatWindow.innerHTML = savedChat;
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
};

// 儲存對話到瀏覽器記憶體
function saveChat() {
    localStorage.setItem('ming_chat_history', chatWindow.innerHTML);
}

// 處理 Markdown 加粗 (將 **文字** 轉為 <b>文字</b>)
function mdToHtml(text) {
    return text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
}

async function sendMessage() {
    const text = inputField.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    inputField.value = '';

    const aiMessageDiv = document.createElement('div');
    aiMessageDiv.className = 'message ai';
    aiMessageDiv.innerText = '正在思考中...';
    chatWindow.appendChild(aiMessageDiv);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ text: `(我是 Ming，請親切回答我並稱呼我為 Ming。)\n${text}` }] 
                }]
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);

        const aiRawText = data.candidates[0].content.parts[0].text;
        
        // 渲染 Markdown 並存檔
        aiMessageDiv.innerHTML = mdToHtml(aiRawText);
        saveChat();

    } catch (error) {
        aiMessageDiv.innerText = "抱歉，連線失敗：" + error.message;
    }
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function addMessage(text, role) {
    const div = document.createElement('div');
    div.className = `message ${role}`;
    div.innerHTML = mdToHtml(text);
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    saveChat();
}

sendBtn.onclick = sendMessage;
inputField.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };
