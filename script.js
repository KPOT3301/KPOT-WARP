// ======================== КОНФИГУРАЦИЯ ========================
// Список проверенных публичных API (работают на момент написания)
const API_LIST = [
  'https://getwarp.netlify.app/generate',   // часто работает, поддерживает CORS
  'https://warply.vercel.app/generate',     // запасной
  'https://topor-warp.vercel.app/generate'  // ещё один
];

// Публичный CORS-прокси (не требует регистрации)
const PROXY = 'https://corsproxy.io/?';

// Выберите API из списка (просто замените индекс 0 на 1 или 2)
let selectedAPI = API_LIST[0]; // попробуйте getwarp

// Если выбранный API не поддерживает CORS, используйте прокси (поставьте true)
const USE_PROXY = true;   // попробуйте сначала true, если не работает – false

// Итоговый URL для запроса
const API_URL = USE_PROXY ? PROXY + encodeURIComponent(selectedAPI) : selectedAPI;

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

        currentConfig = configText;
        currentType = type;
        configPreview.textContent = configText;
        downloadBtn.disabled = false;

    } catch (error) {
        console.error('Ошибка генерации:', error);
        configPreview.textContent = `❌ Ошибка: ${error.message}\n\nПопробуйте сменить API (измените индекс в API_LIST) или выключить прокси (USE_PROXY = false).`;
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
