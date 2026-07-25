export function html(proxy) {
    const addr = proxy.addr
    const password = proxy.password
    const port = proxy.port

    let ports = ""
    let sni = ""
    let allowInsecure = ""
    const none = encodeURIComponent(proxy.none)

    if (proxy.ports) {
        ports = encodeURIComponent(proxy.ports)
        ports = `&mport=${ports}`
    }

    if (proxy.sni) {
        sni = `&sni=${proxy.sni}`
    }

    if (proxy.isInsecure) {
        allowInsecure = `&allowInsecure=1`
    }

    return `hysteria2://${password}@${addr}:${port}?${sni}&alpn=h3${allowInsecure}${ports}#${none}\n`

}

export function json(proxy) {
    let ports = ""
    let sniStr = ""

    if (proxy.sni) {
        sniStr = `"server_name": "${proxy.sni}",`
    }

    if (proxy.ports) {
        let str = ""
        if (proxy.ports.includes(",")) {
            for (const p of proxy.ports.split(",")) {
                if (str != "") {

                    str += ","
                }
                str += `"${p}"`
            }
        } else {
            str = `"${proxy.ports}"`
        }

        ports = `"server_ports": [${str}],`
    }

    return `
		{
			"type": "hysteria2",
			"tag": "${proxy.none}",
			"server": "${proxy.addr}",
            "server_port": ${proxy.port},
			${ports}
            "password": "${proxy.password}",
			"hop_interval": "30s",
			"up_mbps": 100,
			"down_mbps": 100,
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
    let ports = ""
    let sniStr = ""

    if (proxy.sni) {
        sniStr = `sni: ${proxy.sni}`
    }

    if (proxy.ports) {
        proxy.ports = proxy.ports.replaceAll(":", "-")
        ports = `ports: ${proxy.ports}`
    }

    return `
  - name: "${proxy.none}"
    type: hysteria2
    server: "${proxy.addr}"
    port: ${proxy.port}
    ${ports}
    password: ${proxy.password}    
    hop-interval: 30
    up: "30 Mbps"
    down: "100 Mbps"
    ${sniStr}
    skip-cert-verify: ${proxy.isInsecure}
    tls: true
    udp: true
    alpn:
      - h3
		`

}