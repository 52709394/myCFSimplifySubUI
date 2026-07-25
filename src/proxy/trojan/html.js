export function tcpTls(proxy) {
    const addr = proxy.addr
    const password = proxy.password
    const port = proxy.port

    let sni = ""
    let fp = "chrome"

    if (proxy.fp) {
        fp = proxy.fp
    }

    const none = encodeURIComponent(proxy.none)

    if (proxy.sni) {
        sni = `&sni=${proxy.sni}`
    }

    return `trojan://${password}@${addr}:${port}?security=tls${sni}&fp=${fp}&insecure=0${allowInsecure}&type=tcp&headerType=none#${none}\n`

}

export function wsTls(proxy) {
    const addr = proxy.addr
    const password = proxy.password
    const port = proxy.port

    let sni = ""
    let allowInsecure = ""
    const path = encodeURIComponent(proxy.path)
    let fp = "chrome"
    const none = encodeURIComponent(proxy.none)

    if (proxy.sni) {
        sni = `&sni=${proxy.sni}`
    }

    if (proxy.isInsecure) {
        allowInsecure = `&allowInsecure=1`
    }

    if (proxy.fp) {
        fp = proxy.fp
    }


    return `trojan://${password}@${addr}:${port}?security=tls${sni}&fp=${fp}&insecure=0${allowInsecure}&type=ws&path=${path}#${none}\n`
}

export function httpupgradeTls(proxy) {
    const addr = proxy.addr
    const password = proxy.password
    const port = proxy.port

    let sni = ""
    let allowInsecure = ""
    const path = encodeURIComponent(proxy.path)
    let fp = "chrome"
    const none = encodeURIComponent(proxy.none)


    if (proxy.sni) {
        sni = `&sni=${proxy.sni}`
    }

    if (proxy.isInsecure) {
        allowInsecure = `&allowInsecure=1`
    }

    if (proxy.fp) {
        fp = proxy.fp
    }

    return `trojan://${password}@${addr}:${port}?security=tls${sni}&fp=${fp}&insecure=0${allowInsecure}&type=httpupgrade&path=${path}#${none}\n`
}

export function xhttpTls(proxy) {
    const addr = proxy.addr
    const password = proxy.password
    const port = proxy.port

    let sni = ""
    let allowInsecure = ""
    const path = encodeURIComponent(proxy.path)
    let fp = "chrome"
    const none = encodeURIComponent(proxy.none)

    if (proxy.sni) {
        sni = `&sni=${proxy.sni}`
    }

    if (proxy.isInsecure) {
        allowInsecure = `&allowInsecure=1`
    }

    if (proxy.fp) {
        fp = proxy.fp
    }

    return `trojan://${password}@${addr}:${port}?security=tls${sni}&fp=${fp}&insecure=0${allowInsecure}&type=xhttp&path=${path}#${none}\n`
}

export function grpcTls(proxy) {
    const addr = proxy.addr
    const password = proxy.password
    const port = proxy.port
    const serviceName = `&serviceName=${proxy.serviceName}`
    let sni = ""
    let allowInsecure = ""
    let fp = "chrome"
    const none = encodeURIComponent(proxy.none)

    if (proxy.sni) {
        sni = `&sni=${proxy.sni}`
    }

    if (proxy.isInsecure) {
        allowInsecure = `&allowInsecure=1`
    }

    if (proxy.fp) {
        fp = proxy.fp
    }

    return `trojan://${password}@${addr}:${port}?security=tls${sni}&fp=${fp}&insecure=0${allowInsecure}&type=grpc${serviceName}&mode=gun#${none}\n`
}
