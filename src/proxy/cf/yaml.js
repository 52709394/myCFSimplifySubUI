export function vmessWsTls(proxy) {

    let fp = "chrome"

    if (proxy.fp) {
        fp = proxy.fp
    }


    return  `
  - name: "${proxy.none}"
    type: vmess
    server: ${proxy.addr}
    port: ${proxy.port}
    uuid: ${proxy.uuid}
    alterId: 0
    cipher: auto
    packet-encoding: packetaddr
    network: ws
    ws-opts:
      path: ${proxy.path}
      headers:
        Host: ${proxy.sni}
    tls: true
    udp: true
    servername: ${proxy.sni}
    client-fingerprint: ${fp} 
    `
}

export function vlessWSTls(proxy) {

    let fp = "chrome"

    if (proxy.fp) {
        fp = proxy.fp
    }
 
    return  `
  - name: "${proxy.none}"
    type: vless
    server: ${proxy.addr}
    port: ${proxy.port}
    uuid: ${proxy.uuid}
    network: ws
    ws-opts:
      path: ${proxy.path}
      headers:
        Host: ${proxy.sni}
    tls: true
    udp: true
    servername: ${proxy.sni}
    client-fingerprint: ${fp} 
    `    



}

export function trojanWSTls(proxy) {

    let fp = "chrome"

    if (proxy.fp) {
        fp = proxy.fp
    }

    return  `
  - name: "${proxy.none}"
    type: trojan
    server: ${proxy.addr}
    port: ${proxy.port}
    password: ${proxy.password}
    network: ws
    ws-opts:
      path: ${proxy.path}
      headers:
        Host: ${proxy.sni}
    tls: true
    udp: true
    servername: ${proxy.sni}
    client-fingerprint: ${fp} 
    `    

}