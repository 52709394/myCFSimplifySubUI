export function json(proxy) {

    return `
		{
			"type": "snell",
			"tag": "${proxy.none}",
			"server": "${proxy.addr}",
            "server_port": ${proxy.port},
            "psk": "${proxy.snellPsk}",
            "userkey": "${proxy.password}",
            "version": 4,
            "obfs_mode": "http"
		},
		`
}


export function yaml(proxy) {

    return `
  - name: "${proxy.none}"
    type: snell
    server: "${proxy.addr}"
    psk: ${proxy.snellPsk}
    version: 5
    udp: true
    obfs-opts:
      mode: http
      password: ${proxy.password}   
		`
}