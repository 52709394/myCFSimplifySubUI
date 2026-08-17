export function vmessWsTls(proxy) {


    const addr = proxy.addr
    const uuid = proxy.uuid
    const port = proxy.port

    const path = encodeURIComponent(proxy.path)
    let fp = "chrome"
    const none = encodeURIComponent(proxy.none)


    let sni = proxy.sni

    if (proxy.fp != "" && proxy.fp != null) {
        fp = proxy.fp
    }

    return `vmess://${uuid}@${addr}:${port}?encryption=auto&security=tls&sni=${sni}&fp=${fp}&insecure=0&host=${sni}&type=ws&path=${path}#${none}\n`

}

export function vlessWSTls(proxy) {

    const addr = proxy.addr
    const uuid = proxy.uuid
    const port = proxy.port

    const path = encodeURIComponent(proxy.path)
    let fp = "chrome"
    const none = encodeURIComponent(proxy.none)


    let sni = proxy.sni

    if (proxy.fp != "" && proxy.fp != null) {
        fp = proxy.fp
    }

    return `vless://${uuid}@${addr}:${port}?encryption=none&security=tls&sni=${sni}&fp=${fp}&insecure=0&host=${sni}&type=ws&path=${path}#${none}\n`

}

export function trojanWSTls(proxy) {

    const addr = proxy.addr
    const password = proxy.password
    const port = proxy.port

    const path = encodeURIComponent(proxy.path)
    let fp = "chrome"
    const none = encodeURIComponent(proxy.none)


    let sni = proxy.sni

    if (proxy.fp != "" && proxy.fp != null) {
        fp = proxy.fp
    }

    return `trojan://${password}@${addr}:${port}?security=tls&sni=${sni}&fp=${fp}&insecure=0&host=${sni}&type=ws&path=${path}#${none}\n`



}