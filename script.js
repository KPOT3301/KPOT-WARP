// ======================== КОНФИГУРАЦИЯ ========================
// Адрес вашего API (если путь другой – измените)
const API_BASE = 'http://46.243.232.127:5000';
const API_ENDPOINT = '/generate';   // предположительно

// Публичный CORS-прокси (работает без регистрации)
const PROXY = 'https://corsproxy.io/?';
const USE_PROXY = true;   // если API не отдаёт CORS-заголовки, оставьте true

// Итоговый URL
const API_URL = USE_PROXY 
    ? PROXY + encodeURIComponent(API_BASE + API_ENDPOINT)
    : API_BASE + API_ENDPOINT;

// ======================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ========================
let currentConfig = null;
let currentType = null;

const telegramWarning = document.getElementById('telegramWarning');
const configPreview = document.getElementById('configPreview');
const downloadBtn = document.getElementById('downloadBtn');
const configBtns = document.querySelectorAll('.config-btn');

// ======================== ОПРЕДЕЛЕНИЕ TELEGRAM ========================
function isTelegramWebView() {
    const ua = navigator.userAgent.toLowerCase();
    return ua.includes('telegram') || ua.includes('tw看');
}
if (isTelegramWebView()) {
    telegramWarning.style.display = 'block';
}

// ======================== ЗАПРОС К API ========================
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

        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }

        const configText = await response.text();

        if (!configText || configText.trim() === '') {
            throw new Error('Пустой ответ от сервера');
        }

        // Проверяем, содержит ли конфиг нужные поля для AmneziaWG
        if (type === 'amneziawg' && !configText.includes('Jc')) {
            console.warn('Полученный конфиг может не содержать обфускационных параметров AmneziaWG');
        }

        currentConfig = configText;
        currentType = type;
        configPreview.textContent = configText;
        downloadBtn.disabled = false;

    } catch (error) {
        console.error('Ошибка генерации:', error);
        configPreview.textContent = `❌ Ошибка: ${error.message}\n\nПроверьте доступность API (${API_BASE}). Если API не отвечает, попробуйте сменить адрес в настройках.`;
        downloadBtn.disabled = true;
        currentConfig = null;
    }
}

configBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-type');
        fetchConfig(type);
    });
});

downloadBtn.addEventListener('click', () => {
    if (!currentConfig) return;

    let extension = '.conf';
    if (currentType === 'clash') extension = '.yaml';

    const blob = new Blob([currentConfig], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `warp_${currentType}${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});
