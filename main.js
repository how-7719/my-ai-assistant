// 1. 使用 Ming 最新的 API Key
const API_KEY = "AIzaSyAZZVLQmfYyJDgjwRDMnGYCxxM5NWKx6jM"; 

// 2. 定義所有可能的模型名稱清單 (依優先順序排列)
const MODEL_LIST = [
    "gemini-3-flash-preview", // 優先嘗試 Ming 的 Gemini 3
    "gemini-1.5-flash",        // 備援 1：穩定版 1.5
    "gemini-1.5-flash-latest", // 備援 2：最新 Flash
    "gemini-1.5-pro",          // 備援 3：專業版
    "gemini-pro"               // 備援 4：舊版 Pro
];

// 儲存目前測試成功的模型名稱
let activeModel = "";

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
    aiMessageDiv.innerText = activeModel ? `Ming，助理(${activeModel})正在思考...` : "正在尋找可用的連線路徑...";
    chatWindow.appendChild(aiMessageDiv);

    // 如果還沒有確定的模型，就啟動「自動偵測」模式
    if (!activeModel) {
        for (const model of MODEL_LIST) {
            console.log(`正在測試模型: ${model}`);
            const testUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
            
            try {
                const response = await fetch(testUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: "ping" }] }]
                    })
                });
                const data = await response.json();
                
                if (!data.error) {
                    activeModel = model; // 抓到能動的模型了！
                    console.log(`✅ 成功連線到: ${activeModel}`);
                    break;
                }
            } catch (e) { continue; }
        }
    }

    // 確定有模型可用後，發送正式請求
    if (activeModel) {
        const finalUrl = `https://generativelanguage.googleapis.com/v1beta/models/${activeModel}:generateContent?key=${API_KEY}`;
        try {
            const response = await fetch(finalUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ 
                        parts: [{ text: `(指令：我是 Ming。請親切回答我並稱呼我為 Ming。)\n${text}` }] 
                    }]
                })
            });
            const data = await response.json();
            aiMessageDiv.innerText = data.candidates[0].content.parts[0].text;
        } catch (error) {
            aiMessageDiv.innerText = "連線發生錯誤，請稍後再試。";
        }
    } else {
        aiMessageDiv.innerText = "抱歉 Ming，所有已知模型路徑都回報 404，請確認 API Key 權限已開啟。";
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
