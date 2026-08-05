import { x25519 } from '@noble/curves/ed25519.js'; // 需根据具体版本引入x25519支持



export function getHost(str) {
    str = str.trim();

    // 没有协议时，补一个，方便 URL 解析
    if (!/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(str)) {
        str = "http://" + str;
    }

    try {
        let host = new URL(str).hostname;

        // URL 对 IPv6 会带 []
        if (host.startsWith("[") && host.endsWith("]")) {
            host = host.slice(1, -1);
        }

        return host;
    } catch {
        return "";
    }
}

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