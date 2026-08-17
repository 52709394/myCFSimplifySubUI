export function vmessWsTls(proxy) {

    let fp = "chrome"

    if (proxy.fp != "" && proxy.fp != null) {
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
                    "headers": {
						"Host": "${proxy.sni}"
					}			
                    "max_early_data": 2048,
                    "early_data_header_name": "Sec-WebSocket-Protocol"
                },
                "tls": {
                    "enabled": true,
                    "server_name": "${proxy.sni}",
                    "utls": {
                        "enabled": true,
                        "fingerprint": "${fp}"
                    }
                }                              
            },
`
}

export function vlessWSTls(proxy) {

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
					"type": "ws",
					"path": "${proxy.path}",
					"headers": {
						"Host": "${proxy.sni}"
					}					
				},				
				"tls": {
					"enabled": true,
					"server_name": "${proxy.sni}",
					"insecure": false,
					"utls": {
						"enabled": true,
						"fingerprint": "${fp}"
					}
				}
			},
`

}

export function trojanWSTls(proxy) {

    let fp = "chrome"

    if (proxy.fp != "" && proxy.fp != null) {
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
					"headers": {
						"Host": "${proxy.sni}"
					}					
				},				
				"tls": {
					"enabled": true,
					"server_name": "${proxy.sni}",
					"insecure": false,
					"utls": {
						"enabled": true,
						"fingerprint": "${fp}"
					}
				}
			},
`

}

