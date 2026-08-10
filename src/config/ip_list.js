import { SubConfig } from "./set";

export async function getIpsStr(env) {

    const url = SubConfig.cf_ips_url;
  
    const resp = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });
  
    if (!resp.ok) {
      return "";
    }
  
    const data = await resp.text();
    await env.sub_data.put("ipData", data)
  
  }
  
  export function heightIps(text) {
  
    const ipRe = /(\d+\.\d+\.\d+\.\d+)\s*(?:\,|\:|)\s*(\d+)/;
  
    let ips = []
  
    const str = (text + "\n").split("\n")
  
    for (const ip of str) {
  
      if (ip === "") {
        continue
      }
  
      const match = ip.match(ipRe)
  
      if (match) {
        ips.push({ "addr": match[1], "port": match[2] })
      }
    }
  
    return ips
  
  }