export function html(proxy) {
    const addr = proxy.addr
    const name = proxy.name
    const password = proxy.password
    const port = proxy.port
    let sni = ""

    const none = encodeURIComponent(proxy.none)

    if (proxy.sni) {
        sni = `&sni=${proxy.sni}`
    }


    return `naive+https://${name}:${password}@${addr}:${port}?security=tls${sni}&allowInsecure=0&type=tcp#${none}\n`

}

export function json(proxy) {

    let sniStr = ""

    if (proxy.sni) {
        sniStr = `"server_name": "${proxy.sni}"`
    }

    return `
		{
			"type": "naive",
			"tag": "${proxy.none}",
			"server": "${proxy.addr}",
            "server_port": ${proxy.port},
            "username": "${proxy.name}",
            "password": "${proxy.password}",
			"tls": {
				"enabled": true
                ${sniStr}
			}
		},
		`
}