export function tcp(proxy) {
    const addr = proxy.addr
    const uuid = proxy.uuid
    const port = proxy.port

    const none = encodeURIComponent(proxy.none)

    return `vmess://${uuid}@${addr}:${port}?encryption=auto&type=tcp&headerType=none#${none}\n`

}

export function ws(proxy) {
    const addr = proxy.addr
    const uuid = proxy.uuid
    const port = proxy.port

    const path = "&path" + encodeURIComponent(proxy.path)

    const none = encodeURIComponent(proxy.none)


    return `vmess://${uuid}@${addr}:${port}?encryption=auto&type=ws${path}#${none}\n`
}


export function tcpTls(proxy) {
    const addr = proxy.addr
    const uuid = proxy.uuid
    const port = proxy.port

    let sni = ""
    let fp = "chrome"

    const none = encodeURIComponent(proxy.none)




    if (proxy.sni) {
        sni = `&sni=${proxy.sni}`
    }

    if (proxy.fp) {
        fp = proxy.fp
    }

    return `vmess://${uuid}@${addr}:${port}?encryption=auto&security=tls${sni}&fp=${fp}&insecure=0${allowInsecure}&type=tcp&headerType=none#${none}\n`

}

export function wsTls(proxy) {
    const addr = proxy.addr
    const uuid = proxy.uuid
    const port = proxy.port

    let sni = ""
    let allowInsecure = ""
    const path = "&path" + encodeURIComponent(proxy.path)
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

    return `vmess://${uuid}@${addr}:${port}?encryption=auto&security=tls${sni}&fp=${fp}&insecure=0${allowInsecure}&type=ws${path}#${none}\n`
}

export function httpupgradeTls(proxy) {
    const addr = proxy.addr
    const uuid = proxy.uuid
    const port = proxy.port

    let sni = ""
    let allowInsecure = ""
    const path = "&path" + encodeURIComponent(proxy.path)
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

    return `vmess://${uuid}@${addr}:${port}?encryption=auto&security=tls${sni}&fp=${fp}&insecure=0${allowInsecure}&type=httpupgrade${path}#${none}\n`
}

export function xhttpTls(proxy) {
    const addr = proxy.addr
    const uuid = proxy.uuid
    const port = proxy.port

    let sni = ""
    let allowInsecure = ""
    const path = "&path" + encodeURIComponent(proxy.path)
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

    return `vmess://${uuid}@${addr}:${port}?encryption=auto&security=tls${sni}&fp=${fp}&insecure=0${allowInsecure}&type=xhttp${path}#${none}\n`
}

export function grpcTls(proxy) {
    const addr = proxy.addr
    const uuid = proxy.uuid
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

    return `vmess://${uuid}@${addr}:${port}?encryption=auto&security=tls${sni}&fp=${fp}&insecure=0${allowInsecure}&type=grpc${serviceName}&mode=gun#${none}\n`
}