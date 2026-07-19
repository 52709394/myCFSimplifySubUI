export function tcpTls(proxy) {

    let sniStr = ""
 let fp = "chrome"

    if (proxy.sni) {
        sniStr = `"server_name": "${proxy.sni}",`
    }

    if (proxy.fp) {
        fp = proxy.fp
    }

    return `
            {
                "type": "trojan",
                "tag": "${proxy.none}",
                "server": "${proxy.addr}",
                "server_port": ${proxy.port},
                "password": "${proxy.password}",
                "tls": {
                    "enabled": true,
                    ${sniStr}
                    "insecure": ${proxy.isInsecure},
                    "utls": {
                        "enabled": true,
                        "fingerprint": "${fp}"
                    }
                },
                "multiplex": {
                    "enabled": true
                }  
            },   

`
}

export function wsTls(proxy) {

    let sniStr = ""
 let fp = "chrome"

    if (proxy.sni) {
        sniStr = `"server_name": "${proxy.sni}",`
    }

    if (proxy.fp) {
        fp = proxy.fp
    }

    return `
            {
                "type": "trojan",
                "tag": "${proxy.none}",
                "server": "${proxy.addr}",
                "server_port": ${proxy.port},
                "password": "${proxy.password}",
                 "transport": {
                    "type": "ws",
                    "path": "${proxy.path}",
                    "max_early_data": 2048,
                    "early_data_header_name": "Sec-WebSocket-Protocol"
                },                
                "tls": {
                    "enabled": true,
                    ${sniStr}
                    "insecure": ${proxy.isInsecure},
                    "utls": {
                        "enabled": true,
                        "fingerprint": "${fp}"
                    }
                },               
                "multiplex": {
                    "enabled": true
                }  
            },   

`
}

export function httpupgradeTls(proxy) {

    let sniStr = ""
 let fp = "chrome"

    if (proxy.sni) {
        sniStr = `"server_name": "${proxy.sni}",`
    }

    if (proxy.fp) {
        fp = proxy.fp
    }

    return `
            {
                "type": "trojan",
                "tag": "${proxy.none}",
                "server": "${proxy.addr}",
                "server_port": ${proxy.port},
                "password": "${proxy.password}",
                 "transport": {
                    "type": "httpupgrade",
                    "path": "${proxy.path}"
                },                
                "tls": {
                    "enabled": true,
                    ${sniStr}
                    "insecure": ${proxy.isInsecure},
                    "utls": {
                        "enabled": true,
                        "fingerprint": "${fp}"
                    }
                },               
                "multiplex": {
                    "enabled": true
                }  
            },   

`
}