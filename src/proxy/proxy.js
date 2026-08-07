import { newSingboxJson } from './singbox.js'
import { clashYaml } from './clash.js'
import { nginx, responseURL } from '../html.js';

export async function htmlProxy(node, backup) {

    if (!node.enable) {
        return fetch(backup.html, {
            method: backup.method,
            headers: backup.headers,
            body: backup.body,
            redirect: "follow"
        });
    }

    if (isIPv6(node.addr)) {
        node.addr = `[${node.addr}]`
    }

    let proxyFun

    if (node.model.startsWith("vmess")) {
        const vmess = await import("./vmess/html");
        switch (node.model) {
            case "vmess+tcp+none":
                proxyFun = vmess.tcp
                break;
            case "vmess+ws+none":
                proxyFun = vmess.ws
                break;
            case "vmess+tcp+tls":
                proxyFun = vmess.tcpTls
                break;
            case "vmess+ws+tls":
                proxyFun = vmess.wsTls
                break;
            case "vmess+httpupgrade+tls":
                proxyFun = vmess.httpupgradeTls
                break;
            case "vmess+xhttp+tls":
                proxyFun = vmess.xhttpTls
                break;
            case "vmess+grpc+tls":
                proxyFun = vmess.grpcTls
                break;
            default:
                return nginx()
        }
    } else if (node.model.startsWith("vless")) {
        const vless = await import("./vless/html");
        switch (node.model) {
            case "vless+tcp+tls":
                proxyFun = vless.tcpTls
                break;
            case "vless+ws+tls":
                proxyFun = vless.wsTls
                break;
            case "vless+httpupgrade+tls":
                proxyFun = vless.httpupgradeTls
                break;
            case "vless+xhttp+tls":
                proxyFun = vless.xhttpTls
                break;
            case "vless+grpc+tls":
                proxyFun = vless.grpcTls
                break;
            case "vless+tcp+reality":
                proxyFun = vless.tcpReality
                break;
            case "vless+grpc+reality":
                proxyFun = vless.grpcReality
                break;
            case "vless+xhttp+reality":
                proxyFun = vless.xhttpReality
                break;
            default:
                return nginx()
        }

    } else if (node.model.startsWith("trojan")) {
        const trojan = await import("./trojan/html");

        switch (node.model) {
            case "trojan+tcp+tls":
                proxyFun = trojan.tcpTls
                break;
            case "trojan+ws+tls":
                proxyFun = trojan.wsTls
                break;
            case "trojan+httpupgrade+tls":
                proxyFun = trojan.httpupgradeTls
                break;
            case "trojan+xhttp+tls":
                proxyFun = trojan.xhttpTls
                break;
            default:
                return nginx()
        }

    } else if (node.model === "hysteria") {
        const { html } = await import("./hysteria2");
        proxyFun = html
    } else if (node.model === "anytls") {
        const { html } = await import("./anytls.js");
        proxyFun = html
    } else if (node.model === "tuic") {
        const { html } = await import("./tuic.js");
        proxyFun = html
    } else if (node.model.startsWith("cf")) {
        const cf = await import("./cf/html");

        switch (node.model) {
            case "cf+vmess+ws+tls":
                proxyFun = cf.vmessWsTls
                break;
            case "cf+vless+ws+tls":
                proxyFun = cf.vlessWSTls
                break;
            case "cf+trojan+ws+tls":
                proxyFun = cf.trojanWSTls
                break;
            default:
                return nginx()
        }
    } else {
        return nginx()
    }

    let req_data = ""
    let url = ""

    url = proxyFun(node);

    for (const n of node.nodes) {

        if (n.addr === null || n.addr === "") {
            continue;
        }

        if (isIPv6(n.addr)) {
            node.addr = `[${n.addr}]`
        } else {
            node.addr = n.addr
        }

        if (node.isCF) {
            node.port = n.port
        }
        node.sni = n.sni
        node.none = n.none
        url += proxyFun(node);
    }

    if (node.isBase64) {
        req_data = base64EncodeUnicode(url);
    } else {
        req_data = url
    }


    return responseURL(req_data);

}


export async function jsonProxy(node, backup) {

    if (!node.enable) {
        return fetch(backup.json, {
            method: backup.method,
            headers: backup.headers,
            body: backup.body,
            redirect: "follow"
        });
    }

    let proxyFun

    if (node.model.startsWith("vmess")) {
        const vmess = await import("./vmess/json");
        switch (node.model) {
            case "vmess+tcp+none":
                proxyFun = vmess.tcp
                break;
            case "vmess+ws+none":
                proxyFun = vmess.ws
                break;
            case "vmess+tcp+tls":
                proxyFun = vmess.tcpTls
                break;
            case "vmess+ws+tls":
                proxyFun = vmess.wsTls
                break;
            case "vmess+httpupgrade+tls":
                proxyFun = vmess.httpupgradeTls
                break;
            case "vmess+grpc+tls":
                proxyFun = vmess.grpcTls
                break;
            default:
                return nginx()
        }
    } else if (node.model.startsWith("vless")) {
        const vless = await import("./vless/json");
        switch (node.model) {
            case "vless+tcp+tls":
                proxyFun = vless.tcpTls
                break;
            case "vless+ws+tls":
                proxyFun = vless.wsTls
                break;
            case "vless+httpupgrade+tls":
                proxyFun = vless.httpupgradeTls
                break;
            case "vless+grpc+tls":
                proxyFun = vless.grpcTls
                break;
            case "vless+tcp+reality":
                proxyFun = vless.tcpReality
                break;
            case "vless+grpc+reality":
                proxyFun = vless.grpcReality
                break;
            default:
                return nginx()
        }

    } else if (node.model.startsWith("trojan")) {
        const trojan = await import("./trojan/json");

        switch (node.model) {
            case "trojan+tcp+tls":
                proxyFun = trojan.tcpTls
                break;
            case "trojan+ws+tls":
                proxyFun = trojan.wsTls
                break;
            case "trojan+httpupgrade+tls":
                proxyFun = trojan.httpupgradeTls
                break;
            default:
                return nginx()
        }

    } else if (node.model == "hysteria") {
        const { json } = await import("./hysteria2");
        proxyFun = json
    } else if (node.model === "anytls") {
        const { json } = await import("./anytls.js");
        proxyFun = json
    } else if (node.model === "tuic") {
        const { json } = await import("./tuic.js");
        proxyFun = json
    } else if (node.model.startsWith("cf")) {
        const cf = await import("./cf/json");

        switch (node.model) {
            case "cf+vess+ws+tls":
                proxyFun = cf.vmessWsTls
                break;
            case "cf+vless+ws+tls":
                proxyFun = cf.vlessWSTls
                break;
            case "cf+trojan+ws+tls":
                proxyFun = cf.trojanWSTls
                break;
            default:
                return nginx()
        }
    } else {
        return nginx()
    }

    function proxySelect(proxys) {
        return `
		{
			"type": "selector",
			"tag": "select",
			"outbounds": [${proxys}]
		},
		`
    }

    function proxyAtuo(tag, proxys, interval) {
        return `
        {
            "type": "urltest",
            "tag": "${tag}",
            "outbounds":[${proxys}],
			"interval": "${interval}",
            "interrupt_exist_connections": true
        },
`
    }

    let groups = ""
    let outbounds = ""
    let proxys = ""



    outbounds = proxyFun(node)
    proxys = `"${node.none}"`


    for (const n of node.nodes) {

        if (n.addr === null || n.addr === "") {
            continue;
        }

        node.addr = n.addr
        if (node.isCF) {
            node.port = n.port
        }
        node.sni = n.sni
        node.none = n.none

        outbounds += proxyFun(node)

        if (proxys != "") {
            proxys += `,`
        }

        proxys += `"${n.none}"`
    }



    if (node.autoSelect) {
        groups = proxySelect(`"auto"`)
        groups += proxyAtuo("auto", proxys, "3m")
    } else {
        groups = proxySelect(proxys)
    }

    return newSingboxJson(groups, outbounds)

}


export async function yamlProxy(node, backup) {

    if (!node.enable) {
        return fetch(backup.yaml, {
            method: backup.method,
            headers: backup.headers,
            body: backup.body,
            redirect: "follow"
        });
    }

    let proxyFun

    if (node.model.startsWith("vmess")) {
        const vmess = await import("./vmess/yaml");
        switch (node.model) {
            case "vmess+tcp+none":
                proxyFun = vmess.tcp
                break;
            case "vmess+ws+none":
                proxyFun = vmess.ws
                break;
            case "vmess+tcp+tls":
                proxyFun = vmess.tcpTls
                break;
            case "vmess+ws+tls":
                proxyFun = vmess.wsTls
                break;
            case "vmess+xhttp+tls":
                proxyFun = vmess.xhttpTls
                break;
            case "vmess+grpc+tls":
                proxyFun = vmess.grpcTls
                break;
            default:
                return nginx()
        }
    } else if (node.model.startsWith("vless")) {
        const vless = await import("./vless/yaml");
        switch (node.model) {
            case "vless+tcp+tls":
                proxyFun = vless.tcpTls
                break;
            case "vless+ws+tls":
                proxyFun = vless.wsTls
                break;
            case "vless+xhttp+tls":
                proxyFun = vless.xhttpTls
                break;
            case "vless+grpc+tls":
                proxyFun = vless.grpcTls
                break;
            case "vless+tcp+reality":
                proxyFun = vless.tcpReality
                break;
            case "vless+grpc+reality":
                proxyFun = vless.grpcReality
                break;
            case "vless+xhttp+reality":
                proxyFun = vless.xhttpReality
                break;
            default:
                return nginx()
        }

    } else if (node.model.startsWith("trojan")) {
        const trojan = await import("./trojan/yaml");

        switch (node.model) {
            case "trojan+tcp+tls":
                proxyFun = trojan.tcpTls
                break;
            case "trojan+ws+tls":
                proxyFun = trojan.wsTls
                break;
            case "trojan+xhttp+tls":
                proxyFun = trojan.xhttpTls
                break;
            case "trojan+grpc+tls":
                proxyFun = trojan.grpcTls
                break;
            default:
                return nginx()
        }

    } else if (node.model === "hysteria") {
        const { yaml } = await import("./hysteria2");
        proxyFun = yaml
    } else if (node.model === "anytls") {
        const { yaml } = await import("./anytls.js");
        proxyFun = yaml
    } else if (node.model === "tuic") {
        const { yaml } = await import("./tuic.js");
        proxyFun = yaml
    } else if (node.model.startsWith("cf")) {
        const cf = await import("./cf/yaml");

        switch (node.model) {
            case "cf+vmess+ws+tls":
                proxyFun = cf.vmessWsTls
                break;
            case "cf+vless+ws+tls":
                proxyFun = cf.vlessWSTls
                break;
            case "cf+trojan+ws+tls":
                proxyFun = cf.trojanWSTls
                break;
            default:
                return nginx()
        }
    } else {
        return nginx()
    }


    function proxySelect(proxys) {
        return `
  - {
    name: select,
    type: select,
    proxies:
      [${proxys}],
    }
	`
    }

    function proxyAtuo(name, proxys, interval) {
        return `
  - {
    name: ${name},
    type: url-test,
    proxies:
      [${proxys}],
    url: 'https://www.gstatic.com/generate_204',
    interval: ${interval},
    }
	`
    }

    let groups = ""
    let proxies = ""
    let proxys = ""

    proxies = proxyFun(node)
    proxys = `"${node.none}"`


    for (const n of node.nodes) {

        if (n.addr === null || n.addr === "") {
            continue;
        }

        node.addr = n.addr
        if (node.isCF) {
            node.port = n.port
        }
        node.sni = n.sni
        node.none = n.none

        proxies += proxyFun(node)

        if (proxys != "") {
            proxys += ","
        }

        proxys += n.none

    }

    if (node.autoSelect) {
        groups = proxySelect("auto")
        groups += proxyAtuo("auto", proxys, "60")
    } else {
        groups = proxySelect(proxys)
    }


    return clashYaml(proxies, groups)

}

function base64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}


function isIPv6(ip) {
    // 标准的 IPv6 或包含压缩格式（::）的正则表达式
    const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|([0-9a-fA-F]{1,4}:){1,}(:[0-9a-fA-F]{1,4}){1,6}|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

    return ipv6Regex.test(ip);
}