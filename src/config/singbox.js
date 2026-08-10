import { SubConfig } from "./set";
import { getRandomStr, getPublicKeyFromPrivate, getHost } from "./tool";


export function getSingBoxData(config, modus) {
    const arr = []

    const json = {
        "info": "",
        users_arr: arr
    }

    try {
        const newNotes = {}
        for (const inbound of config.inbounds) {

            const protocol = inbound.type

            if (protocol == null ||
                protocol === ""
            ) {
                continue
            }

            const tag = inbound.tag
            let isNotes = false
            let users = []
            const newUsers = []
            let autoSelect = "false"
            let isCF = "false"
            let addr = null
            let port = inbound.listen_port
            let ports
            let snell_psk
            let model = inbound.type
            let path, serviceName
            let tuicCC
            let sni
            let isInsecure = "false"
            let pbk, sid
            let front = ""
            let back = ""
            let nodes = []


            if (tag != "" &&
                tag != null &&
                modus === "renew") {
                isNotes = true

                if (typeof SubConfig.users_notes != 'object') {
                    SubConfig["users_notes"] = {}
                }
            }

            if (SubConfig.proxy_model === "sing-box" && SubConfig.proxy_url != "") {
                addr = getHost(SubConfig.proxy_url)
            }

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
                    }

                    sid = inbound.tls.reality.short_id

                } else if (inbound.tls?.enabled) {
                    model += "+tls"
                    sni = inbound.tls.serverName
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

            } else if (protocol === "hysteria2") {
                model = "hysteria"
            } else if (protocol === "tuic") {
                tuicCC = inbound.congestion_control
            } else if (protocol === "snell") {
                snell_psk = inbound.psk
            } else if (!(protocol === "anytls" ||
                protocol === "naive"
            )) {
                continue
            }

            if (SubConfig.all_user?.manual_write === "true") {

                if (SubConfig.autoSelect === "true") {
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
                    "node_cf": "null",
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

            if (!Array.isArray(inbound.users)) {
                continue
            }

            for (const user of inbound.users) {
                let name = user.name;
                let sub_url
                let uuid = user.uuid
                let password
                let notBase64 = "false"

                if (protocol === "naive") {
                    name = user.username
                } else {
                    name = user.name
                }

                if (protocol === "snell") {
                    password = user.userkey
                } else {
                    password = user.password
                }

                sub_url = `/${getRandomStr(16)}/${name}\.`

                if (name === "" ||
                    name == null) {
                    name = getRandomStr(6)
                    sub_url = `/${getRandomStr(16)}/${name}\.`
                } else if (isNotes) {

                    for (const user of users) {
                        if (user.name === name) {
                            if (user.proxurl_not_base64 === "true") {
                                notBase64 = "true"
                            }

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
                        "proxurl_not_base64": notBase64,
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
                        "proxurl_not_base64": notBase64,
                        "addr": addr,
                        "port": port,
                        "ports": ports,
                        "model": model,
                        "uuid": uuid,
                        "password": password,
                        "tuicCC": tuicCC,
                        "snell_psk": snell_psk,
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

        json.info = `"sing-box json"错误:\n`
        json.info += e.message
    }


    if (arr.length === 0 &&
        json.info === ""
    ) {
        json.info = `"sing-box json"错误:\n无法提取有效数据`
    }



    return json


}