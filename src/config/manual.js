
import { SubConfig } from './set.js';
import { getIpsStr, heightIps } from "./ip_list.js"

export async function manualConfig(env) {

    const usersOdj = { "users": [] }

    let isCF = false
    let ips = []


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


    for (const user of SubConfig.users_arr) {

        const name = user.name
        let enable = true
        const sub_url = user.sub_url
        let model = user.model
        let autoSelect = false
        let isBase64 = true
        let addr = user.addr
        let port = user.port
        const ports = user.ports
        const uuid = user.uuid
        const password = user.password
        const tuicCC = user.tuicCC
        const path = user.path
        const serviceName = user.serviceName
        const sni = user.sni
        const fp = user.fp
        let isInsecure = false
        const pbk = user.pbk
        const sid = user.sid
        const none = user.none
        let nodes = user.nodes



        if (user.enable === "false") {
            enable = false
        }

        if (user.proxurl_not_base64 === "true") {
            isBase64 = false
        }

        if (Array.isArray(nodes)) {
            if ((user.none_atuo_select === "true" ||
                SubConfig.none_atuo_select === "true") &&
                nodes.length
            ) {
                autoSelect = true
            }
        }



        if (user.isInsecure === "true") {
            isInsecure = true
        }

        if (user.isInsecure === "true") {
            isInsecure = true
        }


        let l = ""

        if (isCF &&
            model.endsWith("ws+tls") &&
            user.node_cf === "true"
        ) {
            l = "-0"
            autoSelect = true
            model = "cf+" + model
            addr = ips[0].addr
            port = ips[0].port
            nodes = []
            if (ips.length > 1) {
                for (let i = 1; i < ips.length; i++) {
                    nodes.push({
                        "addr": ips[i].addr,
                        "port": ips[i].port,
                        "sni": sni,
                        "none": `${user.none}-${i}`
                    })
                }
            }
        }


        usersOdj.users.push({
            "name": name,
            "enable": enable,
            "up": "暂无",
            "down": "暂无",
            "sub_url": sub_url,
            "autoSelect": autoSelect,
            "isCF": isCF,
            "isBase64":isBase64,
            "addr": addr,
            "port": port,
            "ports": ports,
            "model": model,
            "uuid": uuid,
            "password": password,
            "tuicCC": tuicCC,
            "path": path,
            "serviceName": serviceName,
            "sni": sni,
            "pbk": pbk,
            "sid": sid,
            "isInsecure": isInsecure,
            "fp": fp,
            "none": `${none}${l}`,
            "nodes": nodes
        });

    }

    const configStr = JSON.stringify(SubConfig)
    const usersStr = JSON.stringify(usersOdj)

    await env.sub_data.put("subCofig", configStr)
    await env.sub_data.put("usersData", usersStr)


}