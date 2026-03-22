// ======================== КОНФИГУРАЦИЯ ========================
// Укажите правильный URL вашего API (если отличается от предположительного)
// Оригинальный сайт использует warp.llimonix.dev, но точные эндпоинты могут быть иными.
// Рекомендуется открыть оригинальный сайт, нажать F12 → Network и посмотреть,
// какой запрос отправляется при выборе типа конфигурации.
const API_BASE = 'https://warp.llimonix.dev'; // замените при необходимости
// Предполагаемый формат: GET /generate?type=amneziawg (или clash, wiresock)
// Если нужно POST с телом — измените функцию fetchConfig().

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
    // Показываем загрузку в превью
    configPreview.textContent = '⏳ Генерация конфигурации...';
    downloadBtn.disabled = true;
    currentConfig = null;

    try {
        // Пытаемся отправить GET-запрос (как на многих генераторах)
        // Если API требует POST, измените метод и тело запроса.
        const response = await fetch(`${API_BASE}/generate?type=${type}`, {
            method: 'GET',
            headers: {
                'Accept': 'text/plain, application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        // Определяем тип ответа: возможно, это текст или JSON с полем config
        const contentType = response.headers.get('content-type');
        let configText;

        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            // Предположим, что конфиг лежит в поле 'config' или 'data'
            configText = data.config || data.data || JSON.stringify(data, null, 2);
        } else {
            configText = await response.text();
        }

        if (!configText || configText.trim() === '') {
            throw new Error('Пустой ответ от сервера');
        }

        currentConfig = configText;
        currentType = type;
        configPreview.textContent = configText;
        downloadBtn.disabled = false;

    } catch (error) {
        console.error('Ошибка генерации:', error);
        configPreview.textContent = `❌ Ошибка при получении конфигурации.\nПроверьте API URL в script.js.\nДетали: ${error.message}`;
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

// ======================== ДОПОЛНИТЕЛЬНО: ПРОВЕРКА РАБОТОСПОСОБНОСТИ API ========================
// Можно раскомментировать для отладки, но в продакшене убрать
// (async () => {
//     console.log('Testing API availability...');
//     try {
//         const testResp = await fetch(`${API_BASE}/generate?type=amneziawg`, { method: 'HEAD' });
//         console.log('API reachable:', testResp.ok);
//     } catch(e) {
//         console.warn('API unreachable. Check API_BASE in script.js');
//     }
// })();
