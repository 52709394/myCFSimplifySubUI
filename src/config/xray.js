import { SubConfig } from "./set";
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
            let addr = inbound.listen ?? null
            let port = inbound.port
            let network = inbound.streamSettings?.network ?? null;
            if (!network) {
                continue
            }
            const settingKey = `${network}Settings`;
            let model = inbound.protocol
            let path, serviceName
            let sni
            let isInsecure = null
            let pbk, sid
            let nodes = []

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
                } else if (SubConfig.all_user?.manual_write === "true" &&
                    SubConfig.all_user?.security === "tls") {
                    model += "+tls"
                } else {
                    model += "+none"
                }

            } else if (protocol != "hysteria") {
                continue
            }

            if (SubConfig.all_user?.manual_write === "true") {
                addr = SubConfig.all_user?.addr
                port = SubConfig.all_user?.port
                sni = SubConfig.all_user?.sni
                isInsecure = SubConfig.all_user?.isInsecure
                nodes = SubConfig.all_user?.nodes
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
                        "isInsecure": isInsecure,
                        "fp": null,
                        "none": name,
                        "nodes": []
                    }
                )
            }
        }
    } catch (e) {

        json.info = `无法提取"sing-box json" 配置数据`
    }


    console.log(arr);

    return json

}