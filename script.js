// ======================== КОНФИГУРАЦИЯ ========================
// Ваш API (предположительно генерирует конфиги с обфускацией)
const API_BASE = 'http://46.243.232.127:5000';
const API_ENDPOINT = '/generate';   // если нужно
const USE_PROXY = true;   // если CORS, оставьте true

const PROXY = 'https://corsproxy.io/?';
const API_URL = USE_PROXY 
    ? PROXY + encodeURIComponent(API_BASE + API_ENDPOINT)
    : API_BASE + API_ENDPOINT;

// ======================== ОСТАЛЬНОЙ КОД ========================
let currentConfig = null;
let currentType = null;

const telegramWarning = document.getElementById('telegramWarning');
const configPreview = document.getElementById('configPreview');
const downloadBtn = document.getElementById('downloadBtn');
const configBtns = document.querySelectorAll('.config-btn');

function isTelegramWebView() {
    const ua = navigator.userAgent.toLowerCase();
    return ua.includes('telegram') || ua.includes('tw看');
}
if (isTelegramWebView()) {
    telegramWarning.style.display = 'block';
}

async function fetchConfig(type) {
    configPreview.textContent = '⏳ Генерация конфигурации...';
    downloadBtn.disabled = true;
    currentConfig = null;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: type })
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const configText = await response.text();
        if (!configText.trim()) throw new Error('Пустой ответ');

        currentConfig = configText;
        currentType = type;
        configPreview.textContent = configText;
        downloadBtn.disabled = false;
    } catch (error) {
        configPreview.textContent = `❌ Ошибка: ${error.message}`;
        downloadBtn.disabled = true;
    }
}

configBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        fetchConfig(btn.getAttribute('data-type'));
    });
});

downloadBtn.addEventListener('click', () => {
    if (!currentConfig) return;
    let ext = currentType === 'clash' ? '.yaml' : '.conf';
    const blob = new Blob([currentConfig], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `warp_${currentType}${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});
