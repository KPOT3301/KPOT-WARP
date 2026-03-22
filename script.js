// ======================== КОНФИГУРАЦИЯ ========================
// Оригинальный API (проверено: POST /generate с JSON {"type": "..."})
const API_URL = 'https://warp.llimonix.dev/generate';

// Если API возвращает ошибку CORS, используйте публичный прокси:
// const PROXY = 'https://cors-anywhere.herokuapp.com/';
// const API_URL = PROXY + 'https://warp.llimonix.dev/generate';

// ======================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ========================
let currentConfig = null;
let currentType = null;

// Элементы DOM
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

// ======================== ФУНКЦИЯ ЗАПРОСА К API ========================
async function fetchConfig(type) {
    // Показываем загрузку
    configPreview.textContent = '⏳ Генерация конфигурации...';
    downloadBtn.disabled = true;
    currentConfig = null;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type: type })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }

        // Ответ приходит в виде текста конфигурации
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
        configPreview.textContent = `❌ Ошибка при получении конфигурации.\nДетали: ${error.message}\n\nЕсли ошибка связана с CORS, попробуйте раскомментировать строку с прокси в script.js.`;
        downloadBtn.disabled = true;
        currentConfig = null;
    }
}

// ======================== ОБРАБОТЧИКИ КНОПОК ========================
configBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-type');
        fetchConfig(type);
    });
});

// ======================== СКАЧИВАНИЕ ФАЙЛА ========================
downloadBtn.addEventListener('click', () => {
    if (!currentConfig) return;

    // Определяем расширение файла в зависимости от типа
    let extension = '.conf';
    if (currentType === 'clash') extension = '.yaml';
    if (currentType === 'amneziawg') extension = '.conf';
    if (currentType === 'wiresock') extension = '.conf';

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
