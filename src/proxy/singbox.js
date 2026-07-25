
import { nginx, responseURL } from '../html.js';


export function newSingboxJson(groups, outbounds) {
    let json = `
        {
            "dns": {
                "servers": [
                    {
                        "type": "https",
                        "tag": "remote",
                        "detour": "select",
                        "server": "1.1.1.1",
                        "server_port": 443,
                        "tls": {
                            "enabled": true,
                            "server_name": "1.1.1.1"
                        }
                    },
                    {
                        "type": "https",
                        "tag": "local",
                        "server": "1.12.12.12",
                        "server_port": 443,
                        "tls": {
                            "enabled": true,
                            "server_name": "1.12.12.12"
                        }
                    }
                ],
                "rules": [
                    {
                        "clash_mode": "direct",
                        "server": "local"
                    },
                    {
                        "clash_mode": "global",
                        "server": "remote"
                    },
                    {
                        "rule_set": "geosite-cn",
                        "strategy": "ipv4_only",
                        "server": "local"
                    }
                ],
                "strategy": "prefer_ipv4"
            },
            "inbounds": [
                {
                    "type": "mixed",
                    "tag": "mixed-in",
                    "listen": "127.0.0.1",
                    "listen_port": 2080
                },
                {
                    "type": "tun",
                    "tag": "tun-in",
                    "mtu": 9000,
                    "address": [
                        "172.19.0.1/30",
                        "fdfe:dcba:9876::1/126"
                    ],
                    "auto_route": true,
                    "strict_route": false,
                    "route_address": [
                        "0.0.0.0/1",
                        "128.0.0.0/1",
                        "::/1",
                        "8000::/1"
                    ],
                    "route_exclude_address": [
                        "192.168.0.0/16",
                        "fc00::/7"
                    ],
                    "stack": "gvisor",
                    "platform": {
                        "http_proxy": {
                            "enabled": true,
                            "server": "127.0.0.1",
                            "server_port": 2080
                        }
                    }
                }
            ],
            "outbounds": [
                ${groups}
                ${outbounds}
                {
                    "type": "direct",
                    "tag": "direct"
                }
            ],
            "route": {
                "default_domain_resolver": "local",
                "rules": [
                    {
                        "action": "resolve",
                        "strategy": "prefer_ipv4"
                    },
                    {
                        "inbound": [
                            "mixed-in",
                            "tun-in"
                        ],
                        "action": "sniff"
                    },
                    {
                        "protocol": "dns",
                        "action": "hijack-dns"
                    },
                    {
                        "network": "udp",
                        "port": 443,
                        "action": "reject"
                    },
                    {
                        "clash_mode": "direct",
                        "outbound": "direct"
                    },
                    {
                        "clash_mode": "global",
                        "outbound": "select"
                    },
                    {
                        "rule_set": "geosite-cn",
                        "outbound": "direct"
                    },
                    {
                        "rule_set": "geoip-cn",
                        "outbound": "direct"
                    }
                ],
                "rule_set": [
                    {
                        "tag": "geosite-cn",
                        "type": "remote",
                        "format": "binary",
                        "url": "https://app.ifxxku.dpdns.org/ZhongGitHub/https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-cn.srs",
                        "download_detour": "direct"
                    },
                    {
                        "tag": "geoip-cn",
                        "type": "remote",
                        "format": "binary",
                        "url": "https://app.ifxxku.dpdns.org/ZhongGitHub/https://raw.githubusercontent.com/SagerNet/sing-geoip/rule-set/geoip-cn.srs",
                        "download_detour": "direct"
                    }
                ],
                "auto_detect_interface": true
            },
            "experimental": {
                "cache_file": {
                    "enabled": true
                },
                "clash_api": {
                    "external_controller": "127.0.0.1:9090",
                    "external_ui": "ui",
                    "secret": "",
                    "external_ui_download_url": "",
                    "external_ui_download_detour": "select",
                    "default_mode": "rule"
                }
            }
        }
        `
    //console.log(json);
    try {

        let jsonStr = JSON.parse(json);

        let formattedJson = JSON.stringify(jsonStr, null, 2);

        return responseURL(formattedJson, "application/json");
    } catch (e) {
        return nginx();
    }
}

export async function singboxJson(groups, outbounds) {
    let json = `
        {
            "dns": {
                "servers": [
                    {
                        "tag": "cloudflare",
                        "address": "https://1.1.1.1/dns-query"
                    },
                    {
                        "tag": "local",
                        "address": "https://1.12.12.12/dns-query",
                        "detour": "direct"
                    }
                ],
                "rules": [
                    {
                        "outbound": "any",
                        "server": "local"
                    },
                    {
                        "clash_mode": "direct",
                        "server": "local"
                    },
                    {
                        "clash_mode": "global",
                        "server": "cloudflare"
                    },
                    {
                        "rule_set": "geosite-cn",
                        "server": "local"
                    }
                ],
                "strategy": "ipv4_only"
            },
            "inbounds": [
                {
                    "type": "mixed",
                    "tag": "mixed-in",
                    "listen": "127.0.0.1",
                    "listen_port": 2080
                },
                {
                    "type": "tun",
                    "tag": "tun-in",
                    "mtu": 9000,
                    "address": "172.19.0.1/30",
                    "auto_route": true,
                    "strict_route": true,
                    "route_address": [
                        "0.0.0.0/1",
                        "128.0.0.0/1",
                        "198.18.0.0/15"
                    ],
                    "endpoint_independent_nat": false,
                    "stack": "gvisor",
                    "platform": {
                        "http_proxy": {
                            "enabled": true,
                            "server": "127.0.0.1",
                            "server_port": 2080
                        }
                    }
                }
            ],
            "outbounds": [
                ${groups}
                ${outbounds}
                {
                    "type": "direct",
                    "tag": "direct"
                }
            ],
            "route": {
                "rules": [
                    {
                        "inbound": [
                            "mixed-in",
                            "tun-in"
                        ],
                        "action": "resolve",
                        "strategy": "prefer_ipv4"
                    },
                    {
                        "inbound": [
                            "mixed-in",
                            "tun-in"
                        ],
                        "action": "sniff"
                    },
                    {
                        "protocol": "dns",
                        "action": "hijack-dns"
                    },
                    {
                        "network": "udp",
                        "port": 443,
                        "action": "reject"
                    },
                    {
                        "clash_mode": "direct",
                        "outbound": "direct"
                    },
                    {
                        "clash_mode": "global",
                        "outbound": "select"
                    },
                    {
                        "rule_set": "geosite-cn",
                        "outbound": "direct"
                    },
                    {
                        "rule_set": "geoip-cn",
                        "outbound": "direct"
                    }
                ],
                "rule_set": [
                    {
                        "tag": "geosite-cn",
                        "type": "remote",
                        "format": "binary",
                        "url": "https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-cn.srs",
                        "download_detour": "select"
                    },
                    {
                        "tag": "geoip-cn",
                        "type": "remote",
                        "format": "binary",
                        "url": "https://raw.githubusercontent.com/SagerNet/sing-geoip/rule-set/geoip-cn.srs",
                        "download_detour": "select"
                    }
                ],
                "auto_detect_interface": true
            },
            "experimental": {
                "cache_file": {
                    "enabled": true
                },
                "clash_api": {
                    "external_controller": "127.0.0.1:9090",
                    "external_ui": "ui",
                    "secret": "",
                    "external_ui_download_url": "",
                    "external_ui_download_detour": "select",
                    "default_mode": "rule"
                }
            }
        }
        `

    try {

        let jsonStr = JSON.parse(json);

        let formattedJson = JSON.stringify(jsonStr, null, 2);

        return responseURL(formattedJson, "application/json");
    } catch (e) {
        return nginx();
    }
}