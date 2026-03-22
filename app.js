function generateKey(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < length; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
}

function generateConfig() {
    const privateKey = generateKey(43);
    const publicKey = generateKey(43);
    const endpoint = '162.159.193.10:2408';

    const config = `
[Interface]
PrivateKey = ${privateKey}
Address = 172.16.0.2/32
DNS = 1.1.1.1

[Peer]
PublicKey = ${publicKey}
AllowedIPs = 0.0.0.0/0, ::/0
Endpoint = ${endpoint}
    `;
    return config.trim();
}

function generateQRCode(text) {
    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = '';
    new QRCode(qrContainer, {
        text: text,
        width: 200,
        height: 200
    });
}

document.getElementById('generateBtn').addEventListener('click', () => {
    const config = generateConfig();
    document.getElementById('configOutput').value = config;
    generateQRCode(config);
});
