export function tcpTls(proxy) {

    let sniStr = ""
    let fp = "chrome"

    if (proxy.sni != "" && proxy.sni != null) {
        sniStr = `"server_name": "${proxy.sni}",`
    }

    if (proxy.fp != "" && proxy.fp != null) {
        fp = proxy.fp
    }

    return `
            {
                "type": "vless",
                "tag": "${proxy.none}",
                "server": "${proxy.addr}",
                "server_port": ${proxy.port},
                "uuid": "${proxy.uuid}",
                "flow": "xtls-rprx-vision",
                "packet_encoding": "xudp",
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

export function wsTls(proxy) {

    let sniStr = ""
    let fp = "chrome"

    if (proxy.sni != "" && proxy.sni != null) {
        sniStr = `"server_name": "${proxy.sni}",`
    }

    if (proxy.fp != "" && proxy.fp != null) {
        fp = proxy.fp
    }

    return `
            {
                "type": "vless",
                "tag": "${proxy.none}",
                "server": "${proxy.addr}",
                "server_port": ${proxy.port},
                "uuid": "${proxy.uuid}",
                "packet_encoding": "xudp",
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

    if (proxy.sni != "" && proxy.sni != null) {
        sniStr = `"server_name": "${proxy.sni}",`
    }

    if (proxy.fp != "" && proxy.fp != null) {
        fp = proxy.fp
    }

    return `
            {
                "type": "vless",
                "tag": "${proxy.none}",
                "server": "${proxy.addr}",
                "server_port": ${proxy.port},
                "uuid": "${proxy.uuid}",
                "packet_encoding": "xudp",
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

export function grpcTls(proxy) {

    let sniStr = ""
    let fp = "chrome"

    if (proxy.sni != "" && proxy.sni != null) {
        sniStr = `"server_name": "${proxy.sni}",`
    }

    if (proxy.fp != "" && proxy.fp != null) {
        fp = proxy.fp
    }

    return `
            {
                "type": "vless",
                "tag": "${proxy.none}",
                "server": "${proxy.addr}",
                "server_port": ${proxy.port},
                "uuid": "${proxy.uuid}",
                "packet_encoding": "xudp",
                "transport": {
                    "type": "grpc",
                    "service_name": "${proxy.serviceName}"
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


export function tcpReality(proxy) {

    let fp = "chrome"

    if (proxy.fp != "" && proxy.fp != null) {
        fp = proxy.fp
    }

    return `
			{
				"type": "vless",
				"tag": "${proxy.none}",
				"server": "${proxy.addr}",
				"server_port": ${proxy.port},
				"uuid": "${proxy.uuid}",
				"flow": "xtls-rprx-vision",
				"packet_encoding": "xudp",
				"tls": {
					"enabled": true,
					"server_name": "${proxy.sni}",
					"insecure": false,
					"utls": {
						"enabled": true,
						"fingerprint": "${fp}"
					},
					"reality": {
						"enabled": true,
						"public_key": "${proxy.pbk}",
						"short_id": "${proxy.sid}"
					}
				}
			},
`
}


export function grpcReality(proxy) {

    let fp = "chrome"

    if (proxy.fp != "" && proxy.fp != null) {
        fp = proxy.fp
    }

    return `
			{
				"type": "vless",
				"tag": "${proxy.none}",
				"server": "${proxy.addr}",
				"server_port": ${proxy.port},
				"uuid": "${proxy.uuid}",
				"packet_encoding": "xudp",
                "transport": {
                    "type": "grpc",
                    "service_name": "${proxy.serviceName}" 
                },
				"tls": {
					"enabled": true,
					"server_name": "${proxy.sni}",
					"insecure": false,
					"utls": {
						"enabled": true,
						"fingerprint": "${fp}"
					},
					"reality": {
						"enabled": true,
						"public_key": "${proxy.pbk}",
						"short_id": "${proxy.sid}"
					}
				}
			},
`
}