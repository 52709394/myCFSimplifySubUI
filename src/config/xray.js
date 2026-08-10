import { SubConfig } from "./set";
import { getRandomStr, getPublicKeyFromPrivate, getHost } from "./tool";


export function getXrayData(config, modus) {
    const arr = []

    const json = {
        "info": "",
        users_arr: arr
    }

    try {
        const newNotes = {}
        for (const inbound of config.inbounds) {

            const protocol = inbound.protocol

            if (protocol == null ||
                protocol === ""
            ) {
                continue
            }

            const tag = inbound.tag ?? ""
            let isNotes = false
            let users = []
            const newUsers = []
            let autoSelect = "false"
            let isCF = "false"
            let addr = null
            let port = inbound.port ?? null
            let ports
            let network = inbound.streamSettings?.network ?? null;
            if (!network) {
                continue
            }
            const settingKey = `${network}Settings`;
            let model = inbound.protocol
            let path, serviceName
            let sni
            let isInsecure = "false"
            let pbk, sid
            let front = ""
            let back = ""
            let nodes = []

            if (tag != "" && modus === "renew") {
                isNotes = true

                if (typeof SubConfig.users_notes != 'object') {
                    SubConfig["users_notes"] = {}
                }
            }

            if (SubConfig.proxy_model === "xray" && SubConfig.proxy_url != "") {
                addr = getHost(SubConfig.proxy_url)
            }


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
                } else if (typeof SubConfig.users_notes === 'object') {
                    if (SubConfig.users_notes[`${tag}`]?.security === "tls") {
                        model += "+tls"
                    } else {
                        model += "+none"
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

                if (SubConfig.none_atuo_select === "true") {
                    autoSelect = "true"
                }

                // 用户也同时开启
                // if (SubConfig.node_cf === "true") {
                //     isCF = "true"
                // }

                if (SubConfig.all_user.isInsecure === "true") {
                    isInsecure = "true"
                }

                if (SubConfig.all_user.addr != null) {
                    addr = SubConfig.all_user.addr
                }

                if (SubConfig.all_user.port != null) {
                    port = SubConfig.all_user.port
                }

                ports = SubConfig.all_user.ports

                if (SubConfig.all_user.sni != null) {
                    sni = SubConfig.all_user.sni
                }

                nodes = SubConfig.all_user.nodes
            }


            if (isNotes &&
                typeof SubConfig.users_notes[`${tag}`] === 'object') {

                if (SubConfig.users_notes[`${tag}`].none_atuo_select === "true") {
                    autoSelect = "true"
                }

                if (SubConfig.users_notes[`${tag}`].node_cf === "true") {
                    isCF = "true"
                }

                if (SubConfig.users_notes[`${tag}`].addr != null) {
                    addr = SubConfig.users_notes[`${tag}`].addr
                }
                if (SubConfig.users_notes[`${tag}`].port != null) {
                    port = SubConfig.users_notes[`${tag}`].port
                }
                if (SubConfig.users_notes[`${tag}`].ports != null) {
                    ports = SubConfig.users_notes[`${tag}`].ports
                }
                if (SubConfig.users_notes[`${tag}`].sni != null) {
                    sni = SubConfig.users_notes[`${tag}`].sni
                }

                if (SubConfig.users_notes[`${tag}`].isInsecure === "true") {
                    isInsecure = "true"
                }


                users = SubConfig.users_notes[`${tag}`].users

                newNotes[`${tag}`] = SubConfig.users_notes[`${tag}`]

            } else if (isNotes &&
                typeof SubConfig.users_notes[`${tag}`] != 'object') {

                newNotes[`${tag}`] = {
                    "none_atuo_select": null,
                    "node_cf": null,
                    "addr": null,
                    "port": null,
                    "ports": null,
                    "sni": null,
                    "isInsecure": null,
                    "security": null,
                    "users": []
                }

            }


            if (SubConfig.none_front != null) {
                front = SubConfig.none_front
            }

            if (SubConfig.none_back != null) {
                back = SubConfig.none_back
            }

            if (!Array.isArray(inbound.settings.clients)) {
                continue
            }

            for (const user of inbound.settings.clients) {
                let name = user.email;
                let sub_url
                const uuid = user.id
                const password = user.password

                sub_url = `/${getRandomStr(16)}/${name}\.`

                if (name === "" ||
                    name == null
                ) {
                    name = getRandomStr(6)
                    sub_url = `/${getRandomStr(16)}/${name}\.`
                } else if (isNotes) {

                    for (const user of users) {
                        if (user.name === name) {
                            const re = new RegExp("^\/[a-zA-Z0-9\/]{6,}\/" + user.name + "\.$");
                            if (re.test(user.sub_url)) {

                                if (Array.isArray(user.nodes)) {
                                    if (user.nodes.length) {
                                        nodes = user.nodes
                                    }
                                }

                                sub_url = user.sub_url
                                break;
                            }
                        }
                    }

                    newUsers.push({
                        "name": name,
                        "nodes": nodes,
                        "sub_url": sub_url
                    })

                }


                arr.push(
                    {
                        "name": name,
                        "enable": null,
                        "up": "暂无",
                        "down": "暂无",
                        "sub_url": sub_url,
                        "none_atuo_select": autoSelect,
                        "node_cf": isCF,
                        "addr": addr,
                        "port": port,
                        "ports": ports,
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
                        "none": `${front}${name}${back}`,
                        "nodes": nodes
                    }
                )
            }

            if (isNotes) {
                newNotes[`${tag}`]["users"] = newUsers
            }


        }

        if (Object.keys(newNotes).length != 0) {
            SubConfig.users_notes = newNotes
        }



    } catch (e) {

        json.info = `"xray json"错误:\n`
        json.info += e.message
    }

    if (arr.length === 0 &&
        json.info === ""
    ) {
        json.info = `"xray json"错误:\n无法提取有效数据`
    }

    //console.log(arr);

    return json

}