export function tcp(proxy) {

  return `
  - name: "${proxy.none}"
    type: vmess
    server: ${proxy.addr}
    port: ${proxy.port}
    uuid: ${proxy.uuid}
    alterId: 0
    cipher: auto
    packet-encoding: packetaddr
    network: tcp
    udp: true
`
}

export function ws(proxy) {

  return `
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
    udp: true
`
}



export function tcpTls(proxy) {

  let sniStr = ""
  let fp = "chrome"
  if (proxy.sni != "" && proxy.sni != null) {
    sniStr = `sni: ${proxy.sni}`
  }

  if (proxy.fp != "" && proxy.fp != null) {
    fp = proxy.fp
  }

  return `
  - name: "${proxy.none}"
    type: vmess
    server: ${proxy.addr}
    port: ${proxy.port}
    uuid: ${proxy.uuid}
    alterId: 0
    cipher: auto
    packet-encoding: packetaddr
    network: tcp
    tls: true
    udp: true
    ${sniStr}
    skip-cert-verify: ${proxy.isInsecure}
    client-fingerprint: ${fp}     
`
}

export function wsTls(proxy) {

  let sniStr = ""
  let fp = "chrome"
  if (proxy.sni != "" && proxy.sni != null) {
    sniStr = `sni: ${proxy.sni}`
  }

  if (proxy.fp != "" && proxy.fp != null) {
    fp = proxy.fp
  }

  return `
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
    tls: true
    udp: true
    ${sniStr}
    skip-cert-verify: ${proxy.isInsecure}
    client-fingerprint: ${fp} 
`
}

export function grpcTls(proxy) {

  let sniStr = ""
  let fp = "chrome"
  if (proxy.sni != "" && proxy.sni != null) {
    sniStr = `sni: ${proxy.sni}`
  }

  if (proxy.fp != "" && proxy.fp != null) {
    fp = proxy.fp
  }

  return `
  - name: "${proxy.none}"
    type: vmess
    server: ${proxy.addr}
    port: ${proxy.port}
    uuid: ${proxy.uuid}
     alterId: 0
    cipher: auto
    packet-encoding: packetaddr   
    network: grpc
    grpc-opts:
      grpc-service-name: ${proxy.serviceName}
    tls: true
    udp: true
    ${sniStr}
    skip-cert-verify: ${proxy.isInsecure}
    client-fingerprint: ${fp} 
`
}

export function xhttpTls(proxy) {

  let sniStr = ""
  let fp = "chrome"
  if (proxy.sni != "" && proxy.sni != null) {
    sniStr = `sni: ${proxy.sni}`
  }

  if (proxy.fp != "" && proxy.fp != null) {
    fp = proxy.fp
  }

  return `
  - name: "${proxy.none}"
    type: vmess
    server: ${proxy.addr}
    port: ${proxy.port}
    uuid: ${proxy.uuid}
    alterId: 0
    cipher: auto
    packet-encoding: packetaddr    
    network: xhttp
    xhttp-opts:
      path: ${proxy.path}  
    tls: true
    udp: true
    ${sniStr}
    skip-cert-verify: ${proxy.isInsecure}    
    client-fingerprint: ${fp}  
`
}