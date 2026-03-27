import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// ⚠️ 請在下方雙引號內貼上你的 API Key (AIza... 開頭的那串)
const API_KEY = "AIzaSyCXkyrtW3rC_8-pqAVUv2zYbUtB8BnHR_A"; 

const genAI = new GoogleGenerativeAI(API_KEY);
// 使用最穩定的模型名稱
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const chatWindow = document.getElementById('chat-window');
const inputField = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// 處理發送訊息的邏輯
async function sendMessage() {
    const text = inputField.value.trim();
    if (!text) return;

    // 1. 顯示使用者訊息
    addMessage(text, 'user');
    inputField.value = '';

    // 2. 顯示 AI 正在思考
    const aiMessageDiv = document.createElement('div');
    aiMessageDiv.className = 'message ai';
    aiMessageDiv.innerText = '正在思考中...';
    chatWindow.appendChild(aiMessageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    try {
        // 3. 呼叫 Gemini API
        const result = await model.generateContent(text);
        const response = await result.response;
        const aiText = response.text();
        
        // 4. 將「正在思考」換成真正的回覆
        aiMessageDiv.innerText = aiText;
    } catch (error) {
        aiMessageDiv.innerText = '發生錯誤：' + error.message;
        console.error('API Error:', error);
    }
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// 輔助函式：新增訊息泡泡
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
