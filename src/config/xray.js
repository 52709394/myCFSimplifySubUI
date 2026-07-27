import { getRandomStr, getPublicKeyFromPrivate } from "./tool";


export function getXrayData(config) {
    const arr = []

    const json = {
        "info": "",
        users_arr: arr
    }

    try {
        for (const inbound of config.inbounds) {

            const protocol = inbound.protocol
            const addr = inbound.listen ?? null
            const port = inbound.port
            let network = inbound.streamSettings?.network ?? null;
            if (!network) {
                continue
            }
            const settingKey = `${network}Settings`;
            let model = inbound.protocol
            let path, serviceName
            let sni
            let pbk, sid

            if (protocol === "vmess" ||
                protocol === "vless" ||
                protocol === "trojan"
            ) {
                if (network === "ws" ||
                    network === "httpupgrade" ||
                    network === "xhttp" ||
                    network === "grpc"
                ) {

                    model += `+${network}`

                    if (inbound.streamSettings[`${settingKey}`].path) {
                        path = inbound.streamSettings[`${settingKey}`].path
                    }

                    if (inbound.streamSettings[`${settingKey}`].serviceName) {
                        serviceName = inbound.streamSettings[`${settingKey}`].serviceName
                    }

                } else if (network === "raw" ||
                    network === "tcp"
                ) {
                    model += "+tcp"
                } else {
                    continue
                }

                if (protocol === "vless" && inbound.streamSettings.security === "reality") {
                    model += "+reality"
                    sni = inbound.streamSettings.realitySettings.serverNames[0]
                    try {
                        pbk = getPublicKeyFromPrivate(inbound.streamSettings.realitySettings.privateKey)
                    } catch (e) {
                        pbk = null
                    }
                    sid = inbound.streamSettings.realitySettings.shortIds[0]

                } else if (inbound.streamSettings.security === "tls") {
                    model += "+tls"
                    if (inbound.streamSettings.tlsSettings.serverName) {
                        sni = inbound.streamSettings.tlsSettings.serverName
                    }
                } else {
                    model += "+none"
                }

            } else if (protocol != "hysteria") {
                continue
            }


            if (!Array.isArray(inbound.settings.clients)) {
                continue
            }

            for (const user of inbound.settings.clients) {
                let name = user.email ?? "";
                let sub_url
                const uuid = user.id
                const password = user.password

                if (name === "") {
                    name = getRandomStr(6)
                }

                sub_url = `/${getRandomStr(16)}/${name}\.`

                arr.push(
                    {
                        "name": name,
                        "enable": null,
                        "up": "暂无",
                        "down": "暂无",
                        "sub_url": sub_url,
                        "autoSelect": null,
                        "isCF": null,
                        "addr": addr,
                        "port": port,
                        "ports": null,
                        "model": model,
                        "uuid": uuid,
                        "password": password,
                        "tuicCC": null,
                        "path": path,
                        "serviceName": serviceName,
                        "sni": sni,
                        "pbk": pbk,
                        "sid": sid,
                        "isInsecure": null,
                        "fp": null,
                        "none": name,
                        "nodes": []
                    }
                )
            }
        }
    } catch (e) {
    json.info = `无法提取"xray json" 配置数据`
    }

    console.log(arr);

    return json

}