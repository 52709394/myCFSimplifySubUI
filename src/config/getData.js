import { SubConfig, setConfig } from './set.js';
import { _3xuiConfig } from './3x-ui.js';
import { manualConfig } from './manual.js';
import { getXrayData } from './xray.js';
import { getSingBoxData } from './singbox.js';

export async function getUsersData(env) {

	if (SubConfig.proxy_model === "3x-ui") {
		return await _3xuiConfig(env)
	} else if (SubConfig.proxy_model === "xray" ||
		SubConfig.proxy_model === "sing-box") {

		const origData = await fetchData()

		if (origData.info != "") {
			return origData.info 
		}

		let resultObj

		if (SubConfig.proxy_model === "xray") {
			resultObj = getXrayData(origData.config, "renew")
		} else {
			resultObj = getSingBoxData(origData.config, "renew")
		}

		if (resultObj.info != "") {
			return resultObj.info
		}

		let newConfig = SubConfig

		if (!Object.hasOwn(newConfig, "users_arr")) {
			newConfig["users_arr"] = []
		} else if (!Array.isArray(newConfig.users_arr)) {
			newConfig.users_arr = []
		}

		newConfig.users_arr = resultObj.users_arr

		setConfig(newConfig)

		await manualConfig(env)

		return ""

	} else {
		await manualConfig(env)

		return ""
	}

}

async function fetchData() {

	const obj = {}

	const proxyData = {
		"info": "",
		config: obj
	}
	// 服务端配置（需与 config.json 一致）
	const SERVER_URL = SubConfig.proxy_url;
	const PASSWORD = SubConfig.proxy_key;

	try {
		// 1. 获取加密数据（Base64）
		const response = await fetch(SERVER_URL);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const base64Encrypted = await response.text();

		// 2. 从密码派生密钥 (SHA-256)
		const encoder = new TextEncoder();
		const passwordData = encoder.encode(PASSWORD);
		const keyBuffer = await crypto.subtle.digest('SHA-256', passwordData);
		const cryptoKey = await crypto.subtle.importKey(
			'raw',
			keyBuffer,
			{ name: 'AES-GCM' },
			false,
			['decrypt']
		);

		// 3. 解码 Base64 得到 Uint8Array
		const encryptedBytes = Uint8Array.from(atob(base64Encrypted), c => c.charCodeAt(0));

		// 4. 提取 nonce (前 12 字节) 和密文 (剩余部分)
		const nonceSize = 12; // AES-GCM 通常为 12 字节
		const nonce = encryptedBytes.slice(0, nonceSize);
		const ciphertext = encryptedBytes.slice(nonceSize);

		// 5. 解密
		const decryptedBuffer = await crypto.subtle.decrypt(
			{
				name: 'AES-GCM',
				iv: nonce,
			},
			cryptoKey,
			ciphertext
		);

		// 6. 解析 JSON
		const decryptedText = new TextDecoder().decode(decryptedBuffer);
		proxyData.config = JSON.parse(decryptedText);

		return proxyData;
	} catch (e) {
		proxyData.info = `远程配置错误:\n`
		proxyData.info += `${e.message}`
		return proxyData
	}
}



