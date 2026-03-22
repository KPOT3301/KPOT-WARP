function generateConfig() {
    const privateKey = generateKey(43); // base64 приватный ключ клиента
    const serverPublicKey = "ТУТ_ВСТАВЬ_PUBLIC_KEY_СЕРВЕРА"; // PublicKey сервера
    const endpoint = "SERVER_IP:51820"; // IP:порт сервера

    // Случайный IP для клиента
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
