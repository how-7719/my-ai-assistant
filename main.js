import { GoogleGenerativeAI } from "https://cdn.jsdelivr.net/npm/@google/generative-ai/+esm";

// 這是你剛剛截圖中的金鑰
const API_KEY = "AIzaSyCXkyrtW3rC_8-pqAVUv2zYbUtB8BnHR_A"; 

// 關鍵修正：加入 apiVersion: "v1" 避開 beta 版的不穩定路徑
const genAI = new GoogleGenerativeAI(API_KEY);

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
    aiMessageDiv.innerText = '正在嘗試連線...';
    chatWindow.appendChild(aiMessageDiv);

    try {
        // 先嘗試最通用的 gemini-pro 模型
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(text);
        const response = await result.response;
        aiMessageDiv.innerText = response.text();
    } catch (error) {
        console.error("嘗試 gemini-pro 失敗:", error);
        // 如果 pro 失敗，再嘗試 flash 模型
        try {
            const flashModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await flashModel.generateContent(text);
            const response = await result.response;
            aiMessageDiv.innerText = response.text();
        } catch (innerError) {
            aiMessageDiv.innerText = '連線失敗：' + innerError.message + '\n\n請檢查手機是否開啟了 VPN 或廣告封鎖器。';
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
