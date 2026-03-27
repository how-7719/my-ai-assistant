import { GoogleGenerativeAI } from "https://cdn.jsdelivr.net/npm/@google/generative-ai/+esm";

// ⚠️ 請確保引號內是正確的 AIza... 開頭金鑰
const API_KEY = "AIzaSyCXkyrtW3rC_8-pqAVUv2zYbUtB8BnHR_A"; 

const genAI = new GoogleGenerativeAI(API_KEY);

// 嘗試使用最基礎的模型路徑
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
    aiMessageDiv.innerText = '正在思考中...';
    chatWindow.appendChild(aiMessageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    try {
        // 使用 generateContent 並加上錯誤攔截
        const result = await model.generateContent(text);
        const response = await result.response;
        const aiText = response.text();
        aiMessageDiv.innerText = aiText;
    } catch (error) {
        // 如果還是 404，嘗試改用 gemini-pro (舊版但最穩)
        aiMessageDiv.innerText = '正在切換備用模型...';
        try {
            const backupModel = genAI.getGenerativeModel({ model: "gemini-pro" });
            const backupResult = await backupModel.generateContent(text);
            aiMessageDiv.innerText = backupResult.response.text();
        } catch (innerError) {
            aiMessageDiv.innerText = '連線失敗：' + error.message + '。請確認 API Key 是否已在 Google AI Studio 啟用。';
        }
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
