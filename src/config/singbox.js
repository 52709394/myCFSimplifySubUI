import { getRandomStr, getPublicKeyFromPrivate } from "./tool";


export function getSingBoxData(config) {
    const arr = []

    const json = {
        "info": "",
        users_arr: arr
    }

    try {
        for (const inbound of config.inbounds) {

            const protocol = inbound.type
            const addr = inbound.listen ?? null
            const port = inbound.listen_port
            let model = inbound.type
            let path, serviceName
            let tuicCC
            let sni
            let pbk, sid

            if (protocol === "vmess" ||
                protocol === "vless" ||
                protocol === "trojan"
            ) {
                if (inbound.transport?.type) {
                    if (inbound.transport?.type === "ws" ||
                        inbound.transport?.type === "httpupgrade" ||
                        inbound.transport?.type === "grpc"
                    ) {
                        model += `+${inbound.transport?.type}`

                        if (inbound.transport?.path) {
                            path = inbound.transport.path
                        }

                        if (inbound.transport?.service_name) {
                            serviceName = inbound.transport.service_name
                        }
                    } else {
                        model += "+tcp"
                    }

                } else if (inbound.transport?.type === "http") {
                    continue
                } else {
                    model += "+tcp"
                }

                if (protocol === "vless" && inbound.tls?.reality?.enabled) {
                    model += "+reality"
                    sni = inbound.tls.server_name
                    try {
                        pbk = getPublicKeyFromPrivate(inbound.tls.reality.private_key)
                    } catch (e) {
                        pbk = null
                        console.log(inbound.tls.reality.private_key);
                    }



                    sid = inbound.tls.reality.short_id

                } else if (inbound.tls?.enabled) {
                    model += "+tls"
                    sni = inbound.tls.serverName
                } else {
                    model += "+none"
                }

            } else if (protocol === "hysteria2") {
                model = "hysteria"
            } else if (protocol === "tuic") {
                tuicCC = inbound.congestion_control
            } else if (protocol != "anytls") {
                continue
            }


            if (!Array.isArray(inbound.users)) {
                continue
            }

            for (const user of inbound.users) {
                let name = user.name ?? "";
                let sub_url
                const uuid = user.uuid
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
                        "tuicCC": tuicCC,
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

        json.info = `无法提取"sing-box json" 配置数据`
    }

    console.log(arr);

    return json


}