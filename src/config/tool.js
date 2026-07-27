import { x25519 } from '@noble/curves/ed25519.js'; // 需根据具体版本引入x25519支持

export function getRandomStr(len) {

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < len; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }

    return result;
}


function base64UrlToBytes(str) {

    // Base64URL 转普通 Base64
    str = str
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    // 补 =
    while (str.length % 4) {
        str += "=";
    }

    const binary = atob(str);

    return Uint8Array.from(
        binary,
        c => c.charCodeAt(0)
    );
}


function bytesToBase64Url(bytes) {

    let binary = "";

    for (const b of bytes) {
        binary += String.fromCharCode(b);
    }

    return btoa(binary)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
}

export function getPublicKeyFromPrivate(privateKey) {

    const priv = base64UrlToBytes(privateKey);

    const pub = x25519.getPublicKey(priv);

    return bytesToBase64Url(pub);
}