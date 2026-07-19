export function tcp(proxy) {
    return `
            {
                "type": "vmess",
                "tag": "${proxy.none}",
                "server": "${proxy.addr}",
                "server_port": ${proxy.port},
                "uuid": "${proxy.uuid}",
                "security": "auto",
                "alter_id": 0,
                "packet_encoding": "packetaddr"
            },
`
}

export function ws(proxy) {

    return `
            {
                "type": "vmess",
                "tag": "${proxy.none}",
                "server": "${proxy.addr}",
                "server_port": ${proxy.port},
                "uuid": "${proxy.uuid}",
                "security": "auto",
                "alter_id": 0,
                "packet_encoding": "packetaddr",
                "transport": {
                    "type": "ws",
                    "path": "${proxy.path}",
                    "max_early_data": 2048,
                    "early_data_header_name": "Sec-WebSocket-Protocol"
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
                "type": "vmess",
                "tag": "${proxy.none}",
                "server": "${proxy.addr}",
                "server_port": ${proxy.port},
                "uuid": "${proxy.uuid}",
                "security": "auto",
                "alter_id": 0,
                "packet_encoding": "packetaddr",
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
                "type": "vmess",
                "tag": "${proxy.none}",
                "server": "${proxy.addr}",
                "server_port": ${proxy.port},
                "uuid": "${proxy.uuid}",
                "security": "auto",
                "alter_id": 0,
                "packet_encoding": "packetaddr",
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
                }                              
            },
`
}