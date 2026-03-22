function generateKey(length = 43) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let key = '';
    for (let i = 0; i < length; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
}

function generateConfig() {
    const privateKey = generateKey();
    const serverPublicKey = "R/TI2Xm21f8NzO+2ag6PiMTTdpBmDBx5QxQtGQgYghU=";
    const endpoint = "46.243.232.127:51820";
    const ipBase = document.getElementById("ipRange").value || "10.66.66";
    const clientIP = `${ipBase}.${Math.floor(Math.random()*200 + 2)}/32`;
    const dns = document.getElementById("dns").value || "1.1.1.1";

    return `[Interface]
PrivateKey = ${privateKey}
Address = ${clientIP}
DNS = ${dns}

[Peer]
PublicKey = ${serverPublicKey}
AllowedIPs = 0.0.0.0/0, ::/0
Endpoint = ${endpoint}
PersistentKeepalive = 25`;
}

function generateQRCode(text) {
    const qrContainer = document.getElementById("qrcode");
    qrContainer.innerHTML = "";
    new QRCode(qrContainer, { text, width: 200, height: 200 });
}

document.getElementById("generateBtn").addEventListener("click", () => {
    const config = generateConfig();
    document.getElementById("configOutput").value = config;
    generateQRCode(config);
});
