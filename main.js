import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// ⚠️ 注意：這是在前端環境，正式發布建議使用後端中轉。
// 目前為了讓你快速測試，請先填入你的 API Key。
const API_KEY = "AIzaSyCXkyrtW3rC_8-pqAVUv2zYbUtB8BnHR_A"; 
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const chatWindow = document.getElementById('chat-window');
const inputField = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

async function getAIResponse(prompt) {
    const chat = model.startChat({ history: [] });
    const result = await chat.sendMessage(prompt);
    return result.response.text();
}

function addMessage(text, role) {
    const div = document.createElement('div');
    div.className = `message ${role}`;
    div.innerText = text;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

sendBtn.onclick = async () => {
    const text = inputField.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    inputField.value = '';

    // 顯示「正在思考...」的狀態
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message ai';
    loadingDiv.innerText = '正在思考中...';
    chatWindow.appendChild(loadingDiv);

    try {
        const response = await getAIResponse(text);
        loadingDiv.innerText = response;
    } catch (error) {
        loadingDiv.innerText = '發生錯誤：' + error.message;
    }
};
