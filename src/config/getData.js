import { SubConfig } from './set.js';
import { getIpsStr, heightIps } from "./ip_list.js"

export async function getUsersData(env) {

	if (SubConfig.manual_model != "true") {
		await autoConfig(env)
	} else {
		await manualConfig(env)
	}
}

async function autoConfig(env) {
	try {

		const data = await getInbounds(SubConfig.xui_token);

		if (!data.success) {
			return
		}

		const usersOdj = { "users": [] }

		const subAddr = getHost(SubConfig.xui_url)

		const newUsers = {}

		let isCF = false
		let ips = []


		if (SubConfig.node_cf === "true") {
			let cached = await env.sub_data.get("ipData");

			if (!cached) {
				await getIpsStr(env)
				cached = await env.sub_data.get("ipData");
			}

			if (cached) {
				ips = heightIps(cached)
			}

			if (ips.length) {
				isCF = true
			}
		}

		if (typeof SubConfig.users_obj != 'object') {
			SubConfig["users_obj"] = {}
		}


		for (const obj of data.obj) {
			const stats = {}
			let enable = true
			let addr = subAddr
			let autoSelect = false
			let port = 0
			let ports
			let nodes = []
			let network = obj.streamSettings.network;
			const settingKey = `${network}Settings`;
			let path, serviceName
			let isInsecure = false
			let security
			let front = ""
			let Back = ""


			if (SubConfig.backup?.enable === "true") {
				enable = false
			}

			if (network === "ws" ||
				network === "httpupgrade" ||
				network === "xhttp"
			) {
				path = obj.streamSettings[`${settingKey}`]?.path ?? "";
			} else if (network === "grpc") {
				serviceName = obj.streamSettings[`${settingKey}`]?.serviceName ?? "";
			} else if (network === "raw") {
				network = "tcp"
			}

			if (SubConfig.all_user?.addr) {
				addr = SubConfig.all_user.addr
			}

			if (SubConfig.all_user?.port) {
				port = SubConfig.all_user.port
			} else {
				port = obj.port
			}

			security = obj.streamSettings.security

			if (security === "none" &&
				SubConfig.all_user?.security === "tls"
			) {
				security = "tls"
			}

			let sni, pbk, sid
			let fp

			if (security === "reality") {
				sni = obj.streamSettings.realitySettings.serverNames[0]
				pbk = obj.streamSettings.realitySettings.settings.publicKey
				sid = obj.streamSettings.realitySettings.shortIds[0]

				if (obj.streamSettings.realitySettings.settings.fingerprint) {
					fp = obj.streamSettings.realitySettings.settings.fingerprint
				}

			} else if (security === "tls" &&
				SubConfig.all_user?.security != "tls"
			) {
				if (obj.streamSettings.tlsSettings.serverName != "") {
					sni = obj.streamSettings.tlsSettings.serverName
				}
				if (obj.streamSettings.tlsSettings?.settings.fingerprint) {
					fp = obj.streamSettings.tlsSettings?.settings.fingerprint
				}
			}

			if (Array.isArray(SubConfig.all_user?.nodes) &&
				SubConfig.all_user?.nodes.length) {
				nodes = SubConfig.all_user.nodes
			}

			if (SubConfig.none_atuo_select === "true") {
				autoSelect = true
			}


			if (obj.protocol === "hysteria") {
				if (SubConfig.all_user?.ports) {
					ports = SubConfig.all_user.ports
				}
			}

			if (SubConfig.none_front) {
				front = SubConfig.none_front
			}

			if (SubConfig.none_back) {
				Back = SubConfig.none_back
			}



			for (const user of obj.clientStats) {
				stats[`${user.email}`] = {
					"up": user.up,
					"down": user.down
				}
			}


			for (const user of obj.settings.clients) {

				let proxy

				let uuid, password

				let model = ""

				const up = formatBytes(stats[`${user.email}`]?.up)

				const down = formatBytes(stats[`${user.email}`]?.down)

				if (SubConfig.users_obj[`${user.email}`]?.addr) {
					addr = SubConfig.users_obj[`${user.email}`].addr
				} else if (SubConfig.all_user?.addr) {
					addr = SubConfig.all_user.addr
				}

				if (SubConfig.users_obj[`${user.email}`]?.port) {
					port = SubConfig.users_obj[`${user.email}`].port
				} else if (SubConfig.all_user?.port) {
					port = SubConfig.all_user.port
				}

				if (security === "none" &&
					SubConfig.users_obj[`${user.email}`]?.security === "tls"
				) {
					security = "tls"
				}

				if (security === "tls") {
					if (SubConfig.users_obj[`${user.email}`]?.sni != "" &&
						SubConfig.users_obj[`${user.email}`]?.sni != null
					) {
						sni = SubConfig.users_obj[`${user.email}`].sni
					}
				}

				if (obj.protocol === "vmess" ||
					obj.protocol === "vless" ||
					obj.protocol === "trojan"
				) {
					model = `${obj.protocol}\+${network}\+${security}`
				} else {
					model = obj.protocol
				}


				if (obj.protocol === "vmess" ||
					obj.protocol === "vless"
				) {
					uuid = user.id
				} else {
					password = user.password
				}


				if (SubConfig.users_obj[`${user.email}`]?.enable === "false" ||
					SubConfig.backup?.enable === "true") {
					enable = false
				}


				if (Array.isArray(SubConfig.users_obj[`${user.email}`]?.nodes) &&
					SubConfig.users_obj[`${user.email}`]?.nodes.length) {
					nodes = SubConfig.users_obj[`${user.email}`].nodes
				} else if (Array.isArray(SubConfig.all_user?.nodes) &&
					SubConfig.all_user?.nodes) {
					nodes = SubConfig.all_user.nodes
				} else {
					nodes = []
				}

				if (SubConfig.users_obj[`${user.email}`]?.none_atuo_select === "true" &&
					nodes.length
				) {
					autoSelect = true
				} else if (SubConfig.none_atuo_select === "true" &&
					!SubConfig.users_obj[`${user.email}`]?.none_atuo_select &&
					nodes.length
				) {
					autoSelect = true
				} else {
					autoSelect = false
				}


				if (obj.protocol === "hysteria") {
					if (SubConfig.users_obj[`${user.email}`]?.ports) {
						ports = SubConfig.users_obj[`${user.email}`].ports
					} else if (SubConfig.all_user?.ports) {
						ports = SubConfig.all_user.ports
					}
				}

				if (SubConfig.users_obj[`${user.email}`]?.isInsecure === "true") {
					isInsecure = SubConfig.users_obj[`${user.email}`].isInsecure
				} else if (SubConfig.all_user?.isInsecure) {
					isInsecure = SubConfig.all_user.isInsecure
				}

				if (SubConfig.users_obj[`${user.email}`]?.none_front) {
					front = SubConfig.users_obj[`${user.email}`].none_front
				} else if (SubConfig.all_user?.front) {
					front = SubConfig.all_user.front
				}

				if (SubConfig.users_obj[`${user.email}`]?.none_back) {
					front = SubConfig.users_obj[`${user.email}`].none_back;
				} else if (SubConfig.all_user?.none_back) {
					front = SubConfig.all_user.backup;
				}

				if (SubConfig.users_obj[`${user.email}`]) {
					newUsers[`${user.email}`] = SubConfig.users_obj[`${user.email}`]
				} else {
					newUsers[`${user.email}`] = {
						"enable": null,
						"none_atuo_select": null,
						"node_cf": null,
						"addr": null,
						"port": null,
						"ports": null,
						"security": null,
						"sni": null,
						"isInsecure": null,
						"nodes": []
					}
				}

				if (security === "reality") {

					proxy = {
						"name": user.email,
						"up": up,
						"down": down,
						"enable": enable,
						"autoSelect": autoSelect,
						"addr": addr,
						"port": port,
						"sub_url": `/${obj.port}/${user.subId}/${user.email}\.`,
						"model": model,
						"uuid": uuid,
						"password": password,
						"path": path,
						"serviceName": serviceName,
						"sni": sni,
						"pbk": pbk,
						"sid": sid,
						"fp": fp,
						"none": `${front}${user.email}${Back}`,
						"nodes": nodes
					}

				} else {

					let l = ""

					if (isCF &&
						model.endsWith("ws+tls") &&
						SubConfig.users_obj[`${user.email}`]?.node_cf === "true"
					) {
						l = "-0"
						autoSelect = true
						addr = ips[0].addr
						port = ips[0].port
						model = "cf+" + model
						nodes = []
						if (ips.length > 1) {
							for (let i = 1; i < ips.length; i++) {
								nodes.push({
									"addr": ips[i].addr,
									"port": ips[i].port,
									"sni": sni,
									"none": `${front}${user.email}${Back}-${i}`
								})
							}
						}
					}

					proxy = {
						"name": user.email,
						"up": up,
						"down": down,
						"enable": enable,
						"autoSelect": autoSelect,
						"isCF": isCF,
						"addr": addr,
						"port": port,
						"ports": ports,
						"sub_url": `/${obj.port}/${user.subId}/${user.email}\.`,
						"model": model,
						"uuid": uuid,
						"password": password,
						"path": path,
						"serviceName": serviceName,
						"sni": sni,
						"isInsecure": isInsecure,
						"fp": fp,
						"none": `${front}${user.email}${Back}${l}`,
						"nodes": nodes
					}
				}
				usersOdj.users.push(proxy)
			}
		}



		SubConfig.users_obj = newUsers

		const configStr = JSON.stringify(SubConfig)
		const usersStr = JSON.stringify(usersOdj)

		//console.log(usersStr);

		await env.sub_data.put("subCofig", configStr)
		await env.sub_data.put("usersData", usersStr)

	} catch (e) {
		return new Response(e.message, {
			status: 500
		});
	}
}


async function getInbounds(token) {
	const res = await fetch(`${SubConfig.xui_url}/panel/api/inbounds/list`, {
		headers: {
			"Accept": "application/json",
			Authorization: `Bearer ${token}`
		}
	});

	return await res.json();
}

export async function updateGeofile(token) {

	const geositeRes = await fetch(`${SubConfig.xui_url}/panel/api/server/updateGeofile/geosite.dat`, {
		headers: {
			"Accept": "application/json",
			Authorization: `Bearer ${token}`
		}
	});

	await geositeRes.json();

	const geoipRes = await fetch(`${SubConfig.xui_url}/panel/api/server/updateGeofile/geoip.dat`, {
		headers: {
			"Accept": "application/json",
			Authorization: `Bearer ${token}`
		}
	});

	await geoipRes.json();

}

function getHost(str) {
	str = str.trim();

	// 没有协议时，补一个，方便 URL 解析
	if (!/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(str)) {
		str = "http://" + str;
	}

	try {
		let host = new URL(str).hostname;

		// URL 对 IPv6 会带 []
		if (host.startsWith("[") && host.endsWith("]")) {
			host = host.slice(1, -1);
		}

		return host;
	} catch {
		return "";
	}
}

async function manualConfig(env) {

	const usersOdj = { "users": [] }

	let isCF = false
	let ips = []


	if (SubConfig.node_cf === "true") {
		let cached = await env.sub_data.get("ipData");

		if (!cached) {
			await getIpsStr(env)
			cached = await env.sub_data.get("ipData");
		}

		if (cached) {
			ips = heightIps(cached)
		}

		if (ips.length) {
			isCF = true
		}
	}


	for (const user of SubConfig.users_arr) {

		const name = user.name
		let enable = true
		const sub_url = user.sub_url
		let model = user.model
		let autoSelect = false
		let addr = user.addr
		let port = user.port
		const ports = user.ports
		const uuid = user.uuid
		const password = user.password
		const tuicCC = user.tuicCC
		const path = user.path
		const serviceName = user.serverName
		const sni = user.sni
		const fp = user.fp
		let isInsecure = false
		const pbk = user.pbk
		const sid = user.sid
		const none = user.none
		let nodes = user.nodes



		if (user.enable === "false") {
			enable = false
		}

		if (Array.isArray(nodes)) {
			if ((user.none_atuo_select === "true" ||
				SubConfig.none_atuo_select === "true") &&
				nodes.length
			) {
				autoSelect = true
			}
		}



		if (user.isInsecure === "true") {
			isInsecure = true
		}

		if (user.isInsecure === "true") {
			isInsecure = true
		}


		let l = ""

		if (isCF &&
			model.endsWith("ws+tls") &&
			user.node_cf === "true"
		) {
			l = "-0"
			autoSelect = true
			model = "cf+" + model
			addr = ips[0].addr
			port = ips[0].port
			nodes = []
			if (ips.length > 1) {
				for (let i = 1; i < ips.length; i++) {
					nodes.push({
						"addr": ips[i].addr,
						"port": ips[i].port,
						"sni": sni,
						"none": `${user.none}-${i}`
					})
				}
			}
		}


		usersOdj.users.push({
			"name": name,
			"enable": enable,
			"up": "暂无",
			"down": "暂无",
			"sub_url": sub_url,
			"autoSelect": autoSelect,
			"isCF": isCF,
			"addr": addr,
			"port": port,
			"ports": ports,
			"model": model,
			"uuid": uuid,
			"password": password,
			"tuicCC": tuicCC,
			"path": path,
			"serviceName": serviceName,
			"sni": sni,
			"pbk": pbk,
			"sid": sid,
			"isInsecure": isInsecure,
			"fp": fp,
			"none": `${none}${l}`,
			"nodes": nodes
		});

	}

	const usersStr = JSON.stringify(usersOdj)
	await env.sub_data.put("usersData", usersStr)


}

function formatBytes(bytes, decimals = 2) {
	if (!bytes) return "0 B";

	const units = ["B", "KB", "MB", "GB", "TB", "PB"];
	const i = Math.floor(Math.log(bytes) / Math.log(1024));

	return (bytes / Math.pow(1024, i)).toFixed(decimals) + " " + units[i];
}


