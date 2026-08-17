import { setConfig, SubConfig } from './set.js';
import { getIpsStr, heightIps } from "./ip_list.js"
import { getHost } from './tool.js';


export async function _3xuiConfig(env) {
    try {

        const data = await getInbounds(SubConfig.proxy_key);

        if (!data.success) {
            return `"3x-ui"错误:\napi获取数据失败!`
        }

        const usersOdj = { "users": [] }

        const subAddr = getHost(SubConfig.proxy_url)

        const newUsers = {}

        let isCF = false
        let ips = []

       console.log( JSON.stringify(data));
       

        if (SubConfig.node_cf === "true") {
            let cached = await env.sub_data.get("ipData");

            if (!cached) {
                await getIpsStr(env)
                cached = await env.sub_data.get("ipData");
            }

            if (cached) {
                ips = heightIps(cached)
            }

            if (ips.length) {
                isCF = true
            }
        }

        if (typeof SubConfig.users_obj != 'object') {
            SubConfig["users_obj"] = {}
        }


        for (const obj of data.obj) {
            const stats = {}
            let enable = true
            let addr = subAddr
            let autoSelect = false
            let port = 0
            let ports
            let nodes = []
            let network = obj.streamSettings.network;
            const settingKey = `${network}Settings`;
            let path, serviceName
            let isInsecure = "false"
            let security
            let front = ""
            let back = ""


            if (SubConfig.backup?.enable === "true") {
                enable = false
            }

            if (network === "ws" ||
                network === "httpupgrade" ||
                network === "xhttp"
            ) {
                path = obj.streamSettings[`${settingKey}`]?.path ?? "";
            } else if (network === "grpc") {
                serviceName = obj.streamSettings[`${settingKey}`]?.serviceName ?? "";
            } else if (network === "raw") {
                network = "tcp"
            }

            if (SubConfig.all_user?.addr != null) {
                addr = SubConfig.all_user.addr
            }

            if (SubConfig.all_user?.port != null) {
                port = SubConfig.all_user.port
            } else {
                port = obj.port
            }

            security = obj.streamSettings.security

            if (security === "none" &&
                SubConfig.all_user?.security === "tls"
            ) {
                security = "tls"
            }

            let sni, pbk, sid
            let fp

            if (security === "reality") {
                sni = obj.streamSettings.realitySettings.serverNames[0]
                pbk = obj.streamSettings.realitySettings.settings.publicKey
                sid = obj.streamSettings.realitySettings.shortIds[0]

                if (obj.streamSettings.realitySettings.settings.fingerprint) {
                    fp = obj.streamSettings.realitySettings.settings.fingerprint
                }

            } else if (security === "tls" &&
                SubConfig.all_user?.security != "tls"
            ) {
                if (obj.streamSettings.tlsSettings.serverName != "" &&
                    obj.streamSettings.tlsSettings.serverName != null
                ) {
                    sni = obj.streamSettings.tlsSettings.serverName
                }
                if (obj.streamSettings.tlsSettings?.settings.fingerprint != null) {
                    fp = obj.streamSettings.tlsSettings?.settings.fingerprint
                }
            }

            if (Array.isArray(SubConfig.all_user?.nodes) &&
                SubConfig.all_user?.nodes.length) {
                nodes = SubConfig.all_user.nodes
            }

            if (SubConfig.none_atuo_select === "true") {
                autoSelect = true
            }


            if (obj.protocol === "hysteria") {
                if (SubConfig.all_user?.ports) {
                    ports = SubConfig.all_user.ports
                }
            }

            if (SubConfig.none_front != null) {
                front = SubConfig.none_front
            }

            if (SubConfig.none_back != null) {
                back = SubConfig.none_back
            }



            for (const user of obj.clientStats) {
                stats[`${user.email}`] = {
                    "up": user.up,
                    "down": user.down
                }
            }


            for (const user of obj.settings.clients) {

                let proxy

                let uuid, password

                let model = ""

                let isBase64 = true

                const up = formatBytes(stats[`${user.email}`]?.up)

                const down = formatBytes(stats[`${user.email}`]?.down)

                if (SubConfig.users_obj[`${user.email}`]?.proxurl_not_base64 === "true") {
                    isBase64 = false
                }

                if (SubConfig.users_obj[`${user.email}`]?.addr != null) {
                    addr = SubConfig.users_obj[`${user.email}`].addr
                } else if (SubConfig.all_user?.addr) {
                    addr = SubConfig.all_user.addr
                }

                if (SubConfig.users_obj[`${user.email}`]?.port != null) {
                    port = SubConfig.users_obj[`${user.email}`].port
                } else if (SubConfig.all_user?.port) {
                    port = SubConfig.all_user.port
                }

                if (security === "none" &&
                    SubConfig.users_obj[`${user.email}`]?.security === "tls"
                ) {
                    security = "tls"
                }

                if (security === "tls") {
                    if (SubConfig.users_obj[`${user.email}`]?.sni != "" &&
                        SubConfig.users_obj[`${user.email}`]?.sni != null
                    ) {
                        sni = SubConfig.users_obj[`${user.email}`].sni
                    }
                }

                if (obj.protocol === "vmess" ||
                    obj.protocol === "vless" ||
                    obj.protocol === "trojan"
                ) {
                    model = `${obj.protocol}\+${network}\+${security}`
                } else {
                    model = obj.protocol
                }


                if (obj.protocol === "vmess" ||
                    obj.protocol === "vless"
                ) {
                    uuid = user.id
                } else {
                    password = user.password
                }


                if (SubConfig.users_obj[`${user.email}`]?.enable === "false" ||
                    SubConfig.backup?.enable === "true") {
                    enable = false
                }


                if (Array.isArray(SubConfig.users_obj[`${user.email}`]?.nodes) &&
                    SubConfig.users_obj[`${user.email}`]?.nodes.length) {
                    nodes = SubConfig.users_obj[`${user.email}`].nodes
                } else if (Array.isArray(SubConfig.all_user?.nodes) &&
                    SubConfig.all_user?.nodes) {
                    nodes = SubConfig.all_user.nodes
                } else {
                    nodes = []
                }

                if (SubConfig.users_obj[`${user.email}`]?.none_atuo_select === "true" &&
                    nodes.length
                ) {
                    autoSelect = true
                } else if (SubConfig.none_atuo_select === "true" &&
                    SubConfig.users_obj[`${user.email}`]?.none_atuo_select != "true" &&
                    nodes.length
                ) {
                    autoSelect = true
                } else {
                    autoSelect = false
                }


                if (obj.protocol === "hysteria") {
                    if (SubConfig.users_obj[`${user.email}`]?.ports != null) {
                        ports = SubConfig.users_obj[`${user.email}`].ports
                    } else if (SubConfig.all_user?.ports != null) {
                        ports = SubConfig.all_user.ports
                    }
                    password = user.auth
                }

                if (SubConfig.users_obj[`${user.email}`]?.isInsecure === "true") {
                    isInsecure = "true"
                } else if (SubConfig.all_user?.isInsecure === "true") {
                    isInsecure = "true"
                } else {
                    isInsecure = "false"
                }

                // if (SubConfig.users_obj[`${user.email}`]?.none_front != null) {
                //     front = SubConfig.users_obj[`${user.email}`].none_front
                // } else if (SubConfig.none_front != null) {
                //     front = SubConfig.none_front
                // }

                // if (SubConfig.users_obj[`${user.email}`]?.none_back != null) {
                //     back = SubConfig.users_obj[`${user.email}`].none_back;
                // } else if (SubConfig.none_back != null) {
                //     back = SubConfig.none_back;
                // }


                if (typeof SubConfig.users_obj[`${user.email}`] === 'object' &&
                    SubConfig.users_obj[`${user.email}`] != null
                ) {
                    newUsers[`${user.email}`] = SubConfig.users_obj[`${user.email}`]
                } else {
                    newUsers[`${user.email}`] = {
                        "enable": null,
                        "none_atuo_select": null,
                        "proxurl_not_base64": null,
                        "node_cf": null,
                        "addr": null,
                        "port": null,
                        "ports": null,
                        "security": null,
                        "sni": null,
                        "isInsecure": null,
                        "nodes": []
                    }
                }

                if (security === "reality") {

                    proxy = {
                        "name": user.email,
                        "up": up,
                        "down": down,
                        "enable": enable,
                        "autoSelect": autoSelect,
                        "isBase64": isBase64,
                        "addr": addr,
                        "port": port,
                        "sub_url": `/${obj.port}/${user.subId}/${user.email}\.`,
                        "model": model,
                        "uuid": uuid,
                        "password": password,
                        "path": path,
                        "serviceName": serviceName,
                        "sni": sni,
                        "pbk": pbk,
                        "sid": sid,
                        "fp": fp,
                        "none": `${front}${user.email}${back}`,
                        "nodes": nodes
                    }

                } else {

                    let l = ""
                    let _isCF = false

                    if (isCF &&
                        model.endsWith("ws+tls") &&
                        SubConfig.users_obj[`${user.email}`]?.node_cf === "true"
                    ) {
                        l = "-0"
                        autoSelect = true
                        addr = ips[0].addr
                        port = ips[0].port
                        model = "cf+" + model
                        nodes = []
                        if (ips.length > 1) {
                            for (let i = 1; i < ips.length; i++) {
                                nodes.push({
                                    "addr": ips[i].addr,
                                    "port": ips[i].port,
                                    "sni": sni,
                                    "none": `${front}${user.email}${back}-${i}`
                                })
                            }
                        }
                        _isCF = isCF
                    }

                    proxy = {
                        "name": user.email,
                        "up": up,
                        "down": down,
                        "enable": enable,
                        "autoSelect": autoSelect,
                        "isCF": _isCF,
                        "isBase64": isBase64,
                        "addr": addr,
                        "port": port,
                        "ports": ports,
                        "sub_url": `/${obj.port}/${user.subId}/${user.email}\.`,
                        "model": model,
                        "uuid": uuid,
                        "password": password,
                        "path": path,
                        "serviceName": serviceName,
                        "sni": sni,
                        "isInsecure": isInsecure,
                        "fp": fp,
                        "none": `${front}${user.email}${back}${l}`,
                        "nodes": nodes
                    }
                }
                usersOdj.users.push(proxy)
            }
        }

        let newConfig = SubConfig

        newConfig.users_obj = newUsers

        setConfig(newConfig)

        const configStr = JSON.stringify(SubConfig)
        const usersStr = JSON.stringify(usersOdj)

        //console.log(usersStr);

        await env.sub_data.put("subCofig", configStr)
        await env.sub_data.put("usersData", usersStr)

    } catch (e) {
        return `"3x-ui"错误:\n${e.message}`
    }

    return ""
}


async function getInbounds(token) {
    const res = await fetch(`${SubConfig.proxy_url}/panel/api/inbounds/list`, {
        headers: {
            "Accept": "application/json",
            Authorization: `Bearer ${token}`
        }
    });

    return await res.json();
}

export async function updateGeofile(token) {

    const geositeRes = await fetch(`${SubConfig.proxy_url}/panel/api/server/updateGeofile/geosite.dat`, {
        headers: {
            "Accept": "application/json",
            Authorization: `Bearer ${token}`
        }
    });

    await geositeRes.json();

    const geoipRes = await fetch(`${SubConfig.proxy_url}/panel/api/server/updateGeofile/geoip.dat`, {
        headers: {
            "Accept": "application/json",
            Authorization: `Bearer ${token}`
        }
    });

    await geoipRes.json();

}


function formatBytes(bytes, decimals = 2) {
    if (!bytes) return "0 B";

    const units = ["B", "KB", "MB", "GB", "TB", "PB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return (bytes / Math.pow(1024, i)).toFixed(decimals) + " " + units[i];
}