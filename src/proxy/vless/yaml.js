export function tcpTls(proxy) {

  let sniStr = ""
  let fp = "chrome"

  if (proxy.sni) {
    sniStr = `servername: ${proxy.sni}`
  }

  if (proxy.fp) {
    fp = proxy.fp
  }

  return `
  - name: "${proxy.none}"
    type: vless
    server: ${proxy.addr}
    port: ${proxy.port}
    uuid: ${proxy.uuid}
    network: tcp
    tls: true
    udp: true
    flow: xtls-rprx-vision
    ${sniStr}
    skip-cert-verify: ${proxy.isInsecure}
    client-fingerprint: ${fp}     
`
}

export function wsTls(proxy) {

  let sniStr = ""
  let fp = "chrome"

  if (proxy.sni) {
    sniStr = `servername: ${proxy.sni}`
  }

  if (proxy.fp) {
    fp = proxy.fp
  }

  return `
  - name: "${proxy.none}"
    type: vless
    server: ${proxy.addr}
    port: ${proxy.port}
    uuid: ${proxy.uuid}
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

  if (proxy.sni) {
    sniStr = `servername: ${proxy.sni}`
  }

  if (proxy.fp) {
    fp = proxy.fp
  }

  return `
  - name: "${proxy.none}"
    type: vless
    server: ${proxy.addr}
    port: ${proxy.port}
    uuid: ${proxy.uuid}
    network: grpc
    grpc-opts:
      grpc-service-name: ${proxy.serviceName}
    tls: true
    udp: true
    servername: ${proxy.sni}
    client-fingerprint: ${fp} 
`
}

export function xhttpTls(proxy) {

  let sniStr = ""
  let fp = "chrome"

  if (proxy.sni) {
    sniStr = `servername: ${proxy.sni}`
  }

  if (proxy.fp) {
    fp = proxy.fp
  }

  return `
  - name: "${proxy.none}"
    type: vless
    server: ${proxy.addr}
    port: ${proxy.port}
    uuid: ${proxy.uuid}
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


export function tcpReality(proxy) {

  let fp = "chrome"

  if (proxy.fp) {
    fp = proxy.fp
  }

  return `
  - name: "${proxy.none}"
    type: vless
    server: ${proxy.addr}
    port: ${proxy.port}
    uuid: ${proxy.uuid}
    network: tcp
    tls: true
    udp: true
    flow: xtls-rprx-vision
    servername: ${proxy.sni}
    reality-opts:
      public-key: ${proxy.pbk}
      short-id: ${proxy.sid}
    client-fingerprint: ${fp}     
`
}

export function xhttpReality(proxy) {

  let fp = "chrome"

  if (proxy.fp) {
    fp = proxy.fp
  }

  return `
  - name: "${proxy.none}"
    type: vless
    server: ${proxy.addr}
    port: ${proxy.port}
    uuid: ${proxy.uuid}
    network: xhttp
    xhttp-opts:
      path: ${proxy.path}  
    tls: true
    udp: true
    servername: ${proxy.sni}
    reality-opts:
      public-key: ${proxy.pbk}
      short-id: ${proxy.sid}
    client-fingerprint: ${fp}  
`
}


export function grpcReality(proxy) {

  let fp = "chrome"

  if (proxy.fp) {
    fp = proxy.fp
  }

  return `
  - name: "${proxy.none}"
    type: vless
    server: ${proxy.addr}
    port: ${proxy.port}
    uuid: ${proxy.uuid}
    network: grpc
    grpc-opts:
      grpc-service-name: ${proxy.serviceName}
    tls: true
    udp: true
    servername: ${proxy.sni}
    reality-opts:
      public-key: ${proxy.pbk}
      short-id: ${proxy.sid}
    client-fingerprint: ${fp}  
`
}