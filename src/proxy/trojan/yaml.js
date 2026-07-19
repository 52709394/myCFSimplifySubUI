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
    type: trojan
    server: ${proxy.addr}
    port: ${proxy.port}
    password: ${proxy.password}
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
  if (proxy.sni) {
    sniStr = `servername: ${proxy.sni}`
  }

  if (proxy.fp) {
    fp = proxy.fp
  }

  return `
  - name: "${proxy.none}"
    type: trojan
    server: ${proxy.addr}
    port: ${proxy.port}
    password: ${proxy.password}
    network: ws
    ws-opts:
      path: ${proxy.path}
      headers:
        Host: ${proxy.host}
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
    type: trojan
    server: ${proxy.addr}
    port: ${proxy.port}
    password: ${proxy.password}
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

  if (proxy.sni) {
    sniStr = `servername: ${proxy.sni}`
  }

  if (proxy.fp) {
    fp = proxy.fp
  }

  return `
  - name: "${proxy.none}"
    type: trojan
    server: ${proxy.addr}
    port: ${proxy.port}
    password: ${proxy.password}
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