export function html(proxy) {
    const addr = proxy.addr
    const uuid = proxy.uuid
    const tuicCC = proxy.tuicCC
    const password = proxy.password
    const port = proxy.port

    let sni = ""
    let allowInsecure = ""
    const none = encodeURIComponent(proxy.none)


    if (proxy.sni) {
        sni = `&sni=${proxy.sni}`
    }

    if (proxy.isInsecure) {
        allowInsecure = `&allowInsecure=1`
    }

    return `tuic://${uuid}%3A${password}@${addr}:${port}?${sni}&alpn=h3${allowInsecure}&congestion_control=${tuicCC}#${none}\n`

}

export function json(proxy) {

    let sniStr = ""

    if (proxy.sni) {
        sniStr = `"server_name": "${proxy.sni}",`
    }

    return `
		{
			"type": "tuic",
			"tag": "${proxy.none}",
			"server": "${proxy.addr}",
            "server_port": ${proxy.port},
            "password": "${proxy.password}",
            "uuid": "${proxy.uuid}",
            "congestion_control": "${proxy.tuicCC}",
			"tls": {
				"enabled": true,
                ${sniStr}
                "insecure": ${proxy.isInsecure},
                "alpn": [
                    "h3"
                ]
			}
		},
		`
}


export function yaml(proxy) {

    let sniStr = ""

    if (proxy.sni) {
        sniStr = `servername: ${proxy.sni}`
    }


    return `
  - name: "${proxy.none}"
    type: tuic
    server: "${proxy.addr}"
    uuid: ${proxy.uuid}
    password: ${proxy.password}
    congestion-controller: ${proxy.tuicCC}
    ${sniStr}
    skip-cert-verify: ${proxy.isInsecure}
    tls: true
    udp: true
    alpn:
      - h3
		`

}