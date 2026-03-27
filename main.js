import { GoogleGenerativeAI } from "https://cdn.jsdelivr.net/npm/@google/generative-ai/+esm";

// ⚠️ 請確保這串 AIza... 貼在引號內，且前後沒有空白
const API_KEY = "AIzaSyCXkyrtW3rC_8-pqAVUv2zYbUtB8BnHR_A"; 

const genAI = new GoogleGenerativeAI(API_KEY);

// 核心修正：改用 gemini-pro，這是目前最穩定的路徑名稱
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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
    aiMessageDiv.innerText = '助理連線中...';
    chatWindow.appendChild(aiMessageDiv);

    try {
        // 直接調用 generateContent
        const result = await model.generateContent(text);
        const response = await result.response;
        aiMessageDiv.innerText = response.text();
    } catch (error) {
        aiMessageDiv.innerText = '連線還是失敗了：' + error.message;
        console.error(error);
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
