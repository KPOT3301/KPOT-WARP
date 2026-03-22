// ============================================================
// ЛОКАЛЬНЫЙ ГЕНЕРАТОР КОНФИГУРАЦИЙ ДЛЯ AmneziaWG 1.5
// Без внешних API — просто выдаёт шаблон, как в вашем примере
// ============================================================

// Шаблон конфигурации для AmneziaWG (с обфускацией)
// Основан на предоставленном вами файле WARPm3_54.conf
const TEMPLATE_AMNEZIAWG = `[Interface]
PrivateKey = CAqUoKEarELZHZgfbIpiGIYws1X0GlsUtiIGqBhpXl8=
Address = 172.16.0.2, 2606:4700:110:8edc:f1a4:9c95:f8ac:1b7c
DNS = 1.1.1.1, 1.0.0.1, 2606:4700:4700::1111, 2606:4700:4700::1001
MTU = 1280
S1 = 0
S2 = 0
Jc = 4
Jmin = 40
Jmax = 70
H1 = 1
H2 = 2
H3 = 3
H4 = 4
I1 = <b 0x494e56495445207369703a626f624062696c6f78692e636f6d205349502f322e300d0a5669613a205349502f322e302f55445020706333332e61746c616e74612e636f6d3b6272616e63683d7a39684734624b3737366173646864730d0a4d61782d466f7277617264733a2037300d0a546f3a20426f62203c7369703a626f624062696c6f78692e636f6d3e0d0a46726f6d3a20416c696365203c7369703a616c6963654061746c616e74612e636f6d3e3b7461673d313932383330313737340d0a43616c6c2d49443a20613834623463373665363637313040706333332e61746c616e74612e636f6d0d0a435365713a2033313431353920494e564954450d0a436f6e746163743a203c7369703a616c69636540706333332e61746c616e74612e636f6d3e0d0a436f6e74656e742d547970653a206170706c69636174696f6e2f7364700d0a436f6e74656e742d4c656e6774683a20300d0a0d0a>
I2 = <b 0x5349502f322e302031303020547279696e670d0a5669613a205349502f322e302f55445020706333332e61746c616e74612e636f6d3b6272616e63683d7a39684734624b3737366173646864730d0a546f3a20426f62203c7369703a626f624062696c6f78692e636f6d3e0d0a46726f6d3a20416c696365203c7369703a616c6963654061746c616e74612e636f6d3e3b7461673d313932383330313737340d0a43616c6c2d49443a20613834623463373665363637313040706333332e61746c616e74612e636f6d0d0a435365713a2033313431353920494e564954450d0a436f6e74656e742d4c656e6774683a20300d0a0d0a>

[Peer]
PublicKey = bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo=
AllowedIPs = 0.0.0.0/0, ::/0
Endpoint = de.tribukvy.ltd:880`;

// Для Clash и WireSock убираем обфускационные поля (оставляем только базовые)
function getConfigForType(type) {
    if (type === 'amneziawg') {
        return TEMPLATE_AMNEZIAWG;
    }
    // Для Clash и WireSock удаляем строки с обфускацией (S1, S2, Jc, Jmin, Jmax, H1-H4, I1, I2)
    let cleaned = TEMPLATE_AMNEZIAWG
        .replace(/\nS1 = .*/, '')
        .replace(/\nS2 = .*/, '')
        .replace(/\nJc = .*/, '')
        .replace(/\nJmin = .*/, '')
        .replace(/\nJmax = .*/, '')
        .replace(/\nH1 = .*/, '')
        .replace(/\nH2 = .*/, '')
        .replace(/\nH3 = .*/, '')
        .replace(/\nH4 = .*/, '')
        .replace(/\nI1 = .*/, '')
        .replace(/\nI2 = .*/, '')
        .replace(/\n\n+/g, '\n\n') // убираем лишние пустые строки
        .trim();
    return cleaned;
}

// ======================== ВЗАИМОДЕЙСТВИЕ С ИНТЕРФЕЙСОМ ========================
let currentConfig = null;
let currentType = null;

const telegramWarning = document.getElementById('telegramWarning');
const configPreview = document.getElementById('configPreview');
const downloadBtn = document.getElementById('downloadBtn');
const configBtns = document.querySelectorAll('.config-btn');

// Проверка на встроенный браузер Telegram
function isTelegramWebView() {
    const ua = navigator.userAgent.toLowerCase();
    return ua.includes('telegram') || ua.includes('tw看');
}
if (isTelegramWebView()) {
    telegramWarning.style.display = 'block';
}

// Генерация конфига (локально)
function generateConfig(type) {
    try {
        const config = getConfigForType(type);
        return config;
    } catch (error) {
        throw new Error('Не удалось сформировать конфигурацию');
    }
}

// Обработчик нажатия на кнопку типа
async function fetchConfig(type) {
    configPreview.textContent = '⏳ Генерация конфигурации...';
    downloadBtn.disabled = true;
    currentConfig = null;

    try {
        // Эмулируем небольшую задержку для реализма
        await new Promise(resolve => setTimeout(resolve, 200));
        const config = generateConfig(type);
        if (!config) throw new Error('Пустой конфиг');
        currentConfig = config;
        currentType = type;
        configPreview.textContent = config;
        downloadBtn.disabled = false;
    } catch (error) {
        console.error(error);
        configPreview.textContent = `❌ Ошибка: ${error.message}`;
        downloadBtn.disabled = true;
    }
}

configBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-type');
        fetchConfig(type);
    });
});

// Скачивание файла
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
