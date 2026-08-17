export function html(proxy) {
    const addr = proxy.addr
    const password = proxy.password
    const port = proxy.port

    let sni = ""
    let allowInsecure = ""
    const none = encodeURIComponent(proxy.none)


    if (proxy.sni != "" && proxy.sni != null) {
        sni = `&sni=${proxy.sni}`
    }

    if (proxy.isInsecure === "true" ) {
        allowInsecure = `&allowInsecure=1`
    }

    return `anytls://${password}@${addr}:${port}?${sni}${allowInsecure}#${none}\n`

}

export function json(proxy) {

    let sniStr = ""

    if (proxy.sni != "" && proxy.sni != null) {
        sniStr = `"server_name": "${proxy.sni}",`
    }


    return `
		{
			"type": "anytls",
			"tag": "${proxy.none}",
			"server": "${proxy.addr}",
            "server_port": ${proxy.port},
            "password": "${proxy.password}",
			"tls": {
				"enabled": true,
                ${sniStr}
                "insecure": ${proxy.isInsecure}
			}
		},
		`
}


export function yaml(proxy) {
    let ports = ""
    let sniStr = ""

    if (proxy.sni != "" && proxy.sni != null) {
        sniStr = `sni: ${proxy.sni}`
    }


    return `
  - name: "${proxy.none}"
    type: anytls
    server: "${proxy.addr}"
    port: ${proxy.port}
    password: ${proxy.password}    
    ${sniStr}
    skip-cert-verify: ${proxy.isInsecure}
    tls: true
    udp: true	
    `
}