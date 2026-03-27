const API_KEY = "AIzaSyCfHAZTmRhq-S4D86jY2gUdYgUOn2HXQlw"; 

// 診斷用的 API 路徑：列出所有可用模型
const DIAGNOSE_URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

const chatWindow = document.getElementById('chat-window');

async function diagnoseAPI() {
    addMessage("正在為 Ming 診斷 API 權限與可用模型...", 'ai');

    try {
        const response = await fetch(DIAGNOSE_URL);
        const data = await response.json();

        if (data.error) {
            addMessage(`❌ 診斷失敗：代碼 ${data.error.code} - ${data.error.message}`, 'ai');
            if (data.error.status === "PERMISSION_DENIED") {
                addMessage("💡 解決方案：請到 AI Studio 重新建立一個『New Project』的金鑰，目前的專案權限未開啟。", 'ai');
            }
            return;
        }

        // 如果成功抓到清單，列出前幾個模型名稱
        const models = data.models.map(m => m.name.replace('models/', ''));
        addMessage(`✅ 診斷成功！Ming，你的 Key 目前支援以下模型：\n${models.join('\n')}`, 'ai');
        addMessage("👉 請複製其中一個名稱（例如 gemini-1.5-flash-8b），我們下次就填那個！", 'ai');

    } catch (error) {
        addMessage(`❌ 網路連線錯誤：${error.message}`, 'ai');
    }
}

function addMessage(text, role) {
    const div = document.createElement('div');
    div.className = `message ${role}`;
    div.innerText = text;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// 網頁一打開就自動診斷
window.onload = diagnoseAPI;
