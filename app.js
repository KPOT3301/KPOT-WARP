// Генерация случайного base64 ключа WireGuard
function generateKey(length = 43) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let key = '';
    for (let i = 0; i < length; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
}

// Генерация конфигурации Amnezia WG
function generateConfig() {
    const privateKey = generateKey(); 

    // Данные сервера из твоего .conf файла
    const serverPublicKey = "R/TI2Xm21f8NzO+2ag6PiMTTdpBmDBx5QxQtGQgYghU=";
    const endpoint = "46.243.232.127:51820";

    // Случайный IP для клиента из диапазона 10.66.66.2-254
    const clientIP = `10.66.66.${Math.floor(Math.random() * 200 + 2)}/32`;

    const config = `
[Interface]
PrivateKey = ${privateKey}
Address = ${clientIP}
DNS = 1.1.1.1

[Peer]
PublicKey = ${serverPublicKey}
AllowedIPs = 0.0.0.0/0, ::/0
Endpoint = ${endpoint}
PersistentKeepalive = 25
    `;
    return config.trim();
}

// Генерация QR-кода
function generateQRCode(text) {
    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = '';
    new QRCode(qrContainer, {
        text: text,
        width: 200,
        height: 200
    });
}

// Обработчик кнопки
document.getElementById('generateBtn').addEventListener('click', () => {
    const config = generateConfig();
    document.getElementById('configOutput').value = config;
    generateQRCode(config);
});
