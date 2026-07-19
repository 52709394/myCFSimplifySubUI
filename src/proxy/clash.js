
import yaml from 'js-yaml';
import { nginx, responseURL } from '../html.js';


export function clashYaml(proxies, groups) {

  const YamlStr = `
mixed-port: 7890
ipv6: true
allow-lan: true
unified-delay: false
tcp-concurrent: true
external-controller: 127.0.0.1:9090

external-ui: ui
external-ui-url: "https://app.ifxxku.dpdns.org/ZhongGitHub/https://github.com/MetaCubeX/metacubexd/archive/refs/heads/gh-pages.zip"


geodata-mode: true

geox-url:
  geoip: "https://app.ifxxku.dpdns.org/ZhongGitHub/https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geoip-lite.dat"
  geosite: "https://app.ifxxku.dpdns.org/ZhongGitHub/https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geosite.dat"
  mmdb: "https://app.ifxxku.dpdns.org/ZhongGitHub/https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/country-lite.mmdb"
  asn: "https://app.ifxxku.dpdns.org/ZhongGitHub/https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/GeoLite2-ASN.mmdb"

find-process-mode: strict
global-client-fingerprint: chrome

profile:
  store-selected: true
  store-fake-ip: true

sniffer:
  enable: true
  sniff:
  HTTP:
    ports: [80, 8080-8880]
    override-destination: true
  TLS:
    ports: [443, 8443]
  QUIC:
    ports: [443, 8443]
  skip-domain:
  - "Mijia Cloud"
  - "+.push.apple.com"

tun:
  enable: true
  stack: mixed
  dns-hijack:
  - "any:53"
  - "tcp://any:53"
  auto-route: true
  auto-redirect: true
  auto-detect-interface: true

dns:
  enable: true
  ipv6: true
  enhanced-mode: fake-ip
  fake-ip-filter:
  - "*"
  - "+.lan"
  - "+.local"
  - "+.market.xiaomi.com"
  default-nameserver:
  - tls://223.5.5.5
  - tls://223.6.6.6
  nameserver:
  - https://doh.pub/dns-query
  - https://dns.alidns.com/dns-query

proxies:
${proxies}

proxy-groups:
${groups}

rules:
  - GEOSITE,CN,DIRECT
  - GEOIP,CN,DIRECT
  - GEOSITE,steam@cn,DIRECT   
  - GEOSITE,geolocation-!cn,select
  - IP-CIDR,10.0.0.0/8,DIRECT
  - IP-CIDR,172.16.0.0/12,DIRECT
  - IP-CIDR,192.168.0.0/16,DIRECT
  - IP-CIDR,100.64.0.0/10,DIRECT
  - IP-CIDR,127.0.0.0/8,DIRECT
  - MATCH,select
  `

  try {

    const doc = yaml.load(YamlStr);

    const formattedYaml = yaml.dump(doc, {
      indent: 2,
      noArrayIndent: false,
      skipInvalid: true
    });
    return responseURL(formattedYaml, {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return nginx();
  }

}