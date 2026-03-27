import { GoogleGenerativeAI } from "https://cdn.jsdelivr.net/npm/@google/generative-ai/+esm";

// 這是你的金鑰
const API_KEY = "AIzaSyCXkyrtW3rC_8-pqAVUv2zYbUtB8BnHR_A"; 

const genAI = new GoogleGenerativeAI(API_KEY);

// 【關鍵修正 1】我們嘗試多種模型名稱，直到有一個成功為止
const modelNames = ["gemini-1.5-flash", "gemini-pro", "gemini-1.0-pro"];
let currentModelIndex = 0;

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
    aiMessageDiv.innerText = '正在嘗試與 Google AI 連線...';
    chatWindow.appendChild(aiMessageDiv);

    // 【關鍵修正 2】遞迴嘗試所有可能的模型路徑
    async function tryGenerate(index) {
        if (index >= modelNames.length) {
            aiMessageDiv.innerText = "抱歉，目前所有 Google 模型路徑都無法連線 (404)。請確認你的 Google 帳號是否位於支援地區。";
            return;
        }

        try {
            console.log(`正在嘗試模型: ${modelNames[index]}`);
            const model = genAI.getGenerativeModel({ model: modelNames[index] });
            const result = await model.generateContent(text);
            const response = await result.response;
            aiMessageDiv.innerText = response.text();
        } catch (error) {
            console.error(`模型 ${modelNames[index]} 失敗:`, error);
            // 如果報 404，立刻嘗試下一個模型
            if (error.message.includes('404')) {
                aiMessageDiv.innerText = `模型 ${modelNames[index]} 找不到，正在切換...`;
                await tryGenerate(index + 1);
            } else {
                aiMessageDiv.innerText = "連線發生錯誤: " + error.message;
            }
        }
    }

    await tryGenerate(0);
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
