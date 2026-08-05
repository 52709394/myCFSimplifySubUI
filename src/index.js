import { SubConfig, getSubConfig, userSubSet, renewConfig, initConfig, originConfig } from './config/set.js';
import { getUsersData } from './config/getData.js'
import { updateGeofile } from './config/3x-ui.js';
import { getSingBoxData } from './config/singbox.js'
import { getXrayData } from './config/xray.js'
import { generateQRCode } from './qr_code.js';
import * as proxy from './proxy/proxy.js';
import { subUrl, nginx, loginText, layoutText } from './html.js';
import { getIpsStr } from './config/ip_list.js';


export default {

	async fetch(request, env) {

		const ua = request.headers.get("user-agent") || "";

		const isWeChat = ua.toLowerCase().includes("micromessenger");

		if (isWeChat) {
			return WeChatWeb()
		}

		if (!env.sub_data) {
			return new Response(
				`
			  KV (变量名称:sub_data) 未配置！
	  
			  请配置：
			  1. 创建 KV 命名为sub_data
			  2. 然后绑定到项目
			  3. 重新部署
			  `,
				{
					status: 500,
					headers: {
						"Content-Type": "text/plain;charset=UTF-8"
					}
				}
			);
		}



		await getSubConfig(env)


		const url = new URL(request.url);

		if (url.pathname.includes(SubConfig.web_url)) {

			if (url.pathname === SubConfig.web_url) {
				url.pathname = SubConfig.web_url + '/home.html'
				return Response.redirect(url.toString(), 301)
			}

			return userSubUrl(request, env)
		};

		let cached = await env.sub_data.get("usersData");

		if (!cached) {
			await getUsersData(env)
			cached = await env.sub_data.get("usersData");
			if (!cached) {
				return new Response("No data cached yet. Please wait for schedule to run.", { status: 503 });
			}
		}

		const users = JSON.parse(cached)


		for (const user of users.users) {

			if (url.pathname.includes(user.sub_url)) {

				const backup = {}

				backup['method'] = request.method
				backup['header'] = request.header
				backup['body'] = request.body
				backup['html'] = SubConfig.backup.html
				backup['json'] = SubConfig.backup.json
				backup['yaml'] = SubConfig.backup.yaml

				if (url.pathname == user.sub_url + "home") {
					return userHomeUrl(request, user.name, user.sub_url, user.up, user.down);
				} else if (url.pathname == user.sub_url + "logout") {
					return userHomeUrl(request, user.name, user.sub_url, user.up, user.down);
				} else if (url.pathname == user.sub_url + "html") {
					return proxy.htmlProxy(user, backup);
				} else if (url.pathname == user.sub_url + "json") {
					return proxy.jsonProxy(user, backup);
				} else if (url.pathname == user.sub_url + "yaml") {
					return proxy.yamlProxy(user, backup);
				} else if (url.pathname == user.sub_url + "HomeQr") {
					const text = `${url.origin}${user.sub_url}home`;
					return generateQRCode({ text })
				} else if (url.pathname == user.sub_url + "Qr") {
					const text = `${url.origin}${user.sub_url}html\#${user.name}`;
					return generateQRCode({ text })
				} else if (url.pathname == user.sub_url + "SbQr") {
					const text = `sing-box://import-remote-profile\?url=${url.origin}${user.sub_url}json\#${user.name}`
					return generateQRCode({ text })
				} else if (url.pathname == user.sub_url + "CMQr") {
					const text = `${url.origin}${user.sub_url}yaml`;
					return generateQRCode({ text })
				} else {
					return nginx();
				}
			}

		}

		return nginx();

	},

	async scheduled(_, env) {

		if (SubConfig.node_cf === "true") {
			await getIpsStr(env)
			await getUsersData(env)
		} else if (SubConfig.proxy_model === "3x-ui" ||
			SubConfig.proxy_model === "xray" ||
			SubConfig.proxy_model === "sing-box"
		) {
			
			await getUsersData(env)

			if (SubConfig.proxy_model === "3x-ui") {
				await updateGeofile()
			}
		}
	}
};



async function userSubUrl(request, env) {
	const url = new URL(request.url);

	// 登录凭证（写死在代码里，实际可用 KV / D1 数据库存储）
	const USERNAME = SubConfig.web_user;
	const PASSWORD = SubConfig.web_password;
	const COOKIE_NAME = SubConfig.cookie_name;
	const COOKIE_VALUE = SubConfig.cookie_value;

	const cookie = request.headers.get("Cookie") || "";
	if (!cookie.includes(`${COOKIE_NAME}=${COOKIE_VALUE}`)) {

		// 登录处理
		if (url.pathname === SubConfig.web_url + "/login" && request.method === "POST") {
			const formData = await request.formData();
			const username = formData.get("username");
			const password = formData.get("password");

			if (username === USERNAME && password === PASSWORD) {
				// 登录成功，设置 Cookie
				return new Response(null, {
					status: 302,
					headers: {
						"Set-Cookie": `${COOKIE_NAME}=${COOKIE_VALUE}; path=${SubConfig.web_url}; HttpOnly; Secure; SameSite=Strict`,
						"Location": SubConfig.web_url + "",
					},
				});
			} else {
				const text = layoutText('logout', `账号或密码错误 <a href='${SubConfig.web_url}/login'>返回</a>`)
				return new Response(text, {
					headers: { "Content-Type": "text/html; charset=utf-8" },
				});
			}
		}

		// 未登录，展示登录页面
		if (url.pathname === SubConfig.web_url + "/login" ||
			url.pathname === SubConfig.web_url + "/home.html" ||
			url.pathname === SubConfig.web_url + "/set.html"
		) {

			const text = loginText(SubConfig.web_url + "/login")

			return new Response(
				text,
				{ headers: { "Content-Type": "text/html; charset=utf-8" } }
			);
		}

		return nginx();

	};

	if (url.pathname === SubConfig.web_url + "/home.html") {

		let output = await userSubHome(url, env)
		return subUrl(output);
	};


	if (url.pathname === SubConfig.web_url + "/set.html") {

		const output = userSubSet()

		return subUrl(output);
	};

	if (url.pathname === SubConfig.web_url + "/update" ||
		url.pathname === SubConfig.web_url + "/setinit" ||
		url.pathname === SubConfig.web_url + "/renew") {

		let _url = ""
		let str = ""

		if (url.pathname === SubConfig.web_url + "/update") {
			_url = SubConfig.web_url + "/home.html"
			str = "用户数据更新成功"
		} else if (url.pathname === SubConfig.web_url + "/setinit") {
			initConfig()
			await env.sub_data.put(
				"subCofig",
				originConfig()
			);

			_url = SubConfig.web_url + "/set.html"


			str = "配置初始化成功"
		} else {
			_url = SubConfig.web_url + "/set.html"
			str = "配置更新成功"
		}

		await getUsersData(env)

		return new Response(`
			<!DOCTYPE html>
			<html>
			<head>
			<meta charset="UTF-8">
			<title>${str}</title>
			</head>
			<body>
			<script>
			alert("${str}!");
			location.href = "${_url}";
			</script>
			</body>
			</html>
			`, {
			headers: {
				"content-type": "text/html; charset=UTF-8",
				"Set-Cookie": `${SubConfig.cookie_name}=${SubConfig.cookie_value}; path=${SubConfig.web_url}; HttpOnly; Secure; SameSite=Strict`,
				"Location": SubConfig.web_url + "",
			}
		});

	}

	const modelList = [
		"/setrenew",
		"/xrenew",
		"/sbrenew",
		"/xupdate",
		"/sbupdate"
	]

	for (const model of modelList) {
		if (url.pathname != SubConfig.web_url + model) {
			continue
		}

		let text = await request.text();

		try {

			// 检查 JSON
			let obj = JSON.parse(text);

			let result = ""

			switch (model) {
				case "/setrenew":
					result = renewConfig(obj)
					break;
				case "/xrenew":
					result = setUsersArr(getXrayData, obj)
					break;
				case "/sbrenew":
					result = setUsersArr(getSingBoxData, obj)
					break;
				case "/xupdate":
					result = setUsersArr(getXrayData, obj, "update")
					break;
				case "/sbupdate":
					result = setUsersArr(getSingBoxData, obj, "update")
					break;
				default:
					continue
					break;
			}


			if (result !== "") {
				return new Response(
					"JSON错误: " + result,
					{ status: 400 }
				);
			}


			await getUsersData(env)

			return new Response(
				`${url.origin}${SubConfig.web_url}/renew`, {
				headers: {
					"Set-Cookie": `${SubConfig.cookie_name}=${SubConfig.cookie_value}; path=${SubConfig.web_url}; HttpOnly; Secure; SameSite=Strict`,
					"Location": SubConfig.web_url + "",
				}
			});

		} catch (e) {

			return new Response(
				"JSON错误: " + e.message,
				{ status: 400 }
			);

		}

	}



	// 登出逻辑
	if (url.pathname === SubConfig.web_url + "/logout") {
		return new Response(null, {
			status: 302,
			headers: {
				"Set-Cookie": `${COOKIE_NAME}=deleted; path=${SubConfig.web_url}; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
				"Location": SubConfig.web_url + "",
			},
		});
	}

	return nginx();


}

function setUsersArr(func, obj, model = "renew") {

	const resultObj = func(obj, model)


	if (resultObj.info != "") {
		return resultObj.info
	}
	let newConfig = SubConfig

	if (!Object.hasOwn(newConfig, "users_arr")) {
		newConfig["users_arr"] = []
	} else if (!Array.isArray(newConfig.users_arr)) {
		newConfig.users_arr = []
	}

	if (model === "renew") {
		newConfig.users_arr = resultObj.users_arr
	} else {
		newConfig.users_arr = [...newConfig.users_arr, ...resultObj.users_arr]
	}

	renewConfig(newConfig)

	return ""

}


async function userSubHome(url, env) {

	let cached = await env.sub_data.get("usersData");
	let users = { "users": [] }


	if (cached) {
		users = JSON.parse(cached)
	}

	let output = "";
	output += `
			<!-- 弹窗结构 - 初始为空 -->
			<div id="imageModal" class="modal">
				<span class="close" onclick="modalClose()">&times;</span>
				<div class="modal-content">
					<div class="image-title"></div> <!-- 空标题 -->
					<img class="modal-image" src="" alt=""> <!-- 空图片 -->
				</div>
			</div>
			`

	output += `
		<nav class="tutorial-nav">
			<div class="nav-container">
				<ul>
					<li><a href="${SubConfig.web_url}/home.html" class="active">主页</a></li>
					<li><a href="${SubConfig.web_url}/set.html">设置</a></li>
				</ul>
			</div>
		</nav>	

		<!-- 返回顶部按钮 -->
        <button id="back-to-top" title="返回顶部">↑</button>

		<p><a href="${SubConfig.web_url}/update">更新数据</a></p><br/>
	`;

	for (const user of users.users) {
		output += `
				<h3>${user.name} (${user.model})</h3>
				<p>上行:${user.up},下行:${user.down}</p>
				<label>主页: </label>
				<button class="link-style" onclick="copyContent('${user.name}-主页','${url.origin}${user.sub_url}home')">复制链接</button>
				<button class="link-style"
				onclick="showImage('${user.name}-主页','${url.origin}${user.sub_url}HomeQr','${url.origin}${user.sub_url}home')">
				链接二维码</button> 
				<br/><br/>	
				<label>html: </label>
				<button class="link-style"
				onclick="showImage('${user.name}-html','${url.origin}${user.sub_url}Qr','${url.origin}${user.sub_url}html')">
				二维码</button>
				<button class="link-style" onclick="copyContent('${user.name}-html(二维码)','${url.origin}${user.sub_url}Qr')">复制二维码链接</button>
				<button class="link-style" onclick="copyContent('${user.name}-html','${url.origin}${user.sub_url}html')">复制"html"链接</button><br/><br/>
				<label>json: </label>
				<button class="link-style"
				onclick="showImage('${user.name}-json','${url.origin}${user.sub_url}SbQr','${url.origin}${user.sub_url}json')">
				二维码</button>
				<button class="link-style" onclick="copyContent('${user.name}-json(二维码)','${url.origin}${user.sub_url}SbQr')">复制二维码链接</button>
				<button class="link-style" onclick="copyContent('${user.name}-json','${url.origin}${user.sub_url}json')">复制"json"链接</button><br/><br/>
				<label>yaml: </label>
				<button class="link-style"
				onclick="showImage('${user.name}-yaml','${url.origin}${user.sub_url}CMQr','${url.origin}${user.sub_url}yaml')">
				二维码</button>
				<button class="link-style" onclick="copyContent('${user.name}-yaml(二维码)','${url.origin}${user.sub_url}CMQr')">复制二维码链接</button>
				<button class="link-style" onclick="copyContent('${user.name}-yaml','${url.origin}${user.sub_url}yaml')">复制"yaml"链接</button><br/><br/>
			   `;
	};

	output += `<p><a href="${SubConfig.web_url}/logout">退出</a></p>`;

	output += `
			<script>
			    // 获取返回顶部按钮
                const backToTopButton = document.getElementById('back-to-top');	
				// 获取元素
				const modal = document.getElementById("imageModal");
				const title = document.querySelector(".image-title");
				const image = document.querySelector(".modal-image");

				// 监听滚动事件
				window.addEventListener('scroll', function() {
					// 如果页面垂直滚动距离大于250px，显示按钮，否则隐藏
					if (window.pageYOffset > 250) {
						backToTopButton.classList.add('visible');
					} else {
						backToTopButton.classList.remove('visible');
					}
				});
				
				// 点击按钮返回顶部
				backToTopButton.addEventListener('click', function() {
					// 平滑滚动到顶部
					window.scrollTo({
						top: 0,
						behavior: 'smooth'
					});
				});						

				function copyContent(title , text) {
					// 创建一个临时的 textarea 元素
					const tempInput = document.createElement('textarea');
					tempInput.value = text;  // 设置 textarea 的值为要复制的文本
					document.body.appendChild(tempInput);  // 将 textarea 元素添加到 body
					
					// 选择 textarea 内容并复制
					tempInput.select();
					tempInput.setSelectionRange(0, 99999);  // 适用于移动设备

					// 执行复制操作
					document.execCommand("copy");

					// 移除临时的 textarea 元素
					document.body.removeChild(tempInput);

					
					alert(title + " 复制成功");
				}

				// 点击按钮打开弹窗并设置内容
				function showImage(str, urlA, urlB) {
					// 设置标题
					title.textContent = str;

					// 设置图片
					image.src = urlA; // 替换为你的图片URL
					image.alt = urlB; //"示例图片描述";

					// 显示弹窗
					modal.style.display = "block";
				}

				// 点击关闭按钮关闭弹窗
				function modalClose() {
					modal.style.display = "none";
				}

				// 点击弹窗外部区域关闭弹窗
				window.onclick = function (event) {
					if (event.target == modal) {
						modal.style.display = "none";
					}
				}
		</script>	
			`


	return output
}

async function userHomeUrl(request, name, userUrl, up, down) {

	const url = new URL(request.url);
	const USERNAME = name;
	const PASSWORD = SubConfig.user_password;
	const COOKIE_NAME = SubConfig.cookie_name;
	const COOKIE_VALUE = SubConfig.cookie_value;

	const cookie = request.headers.get("Cookie") || "";
	// 检查是否已登录（cookie 中是否有 token）
	if (!cookie.includes(`${COOKIE_NAME}=${COOKIE_VALUE}`) &&
		(url.pathname != userUrl + "logout")) {

		// 登录处理
		if (url.pathname === userUrl + "home" && request.method === "POST") {
			const formData = await request.formData();
			const username = formData.get("username");
			const password = formData.get("password");

			if (username === USERNAME && password === PASSWORD) {
				// 登录成功，设置 Cookie
				return new Response(null, {
					status: 302,
					headers: {
						"Set-Cookie": `${COOKIE_NAME}=${COOKIE_VALUE}; path=${userUrl}home; HttpOnly; Secure; SameSite=Strict`,
						"Location": userUrl + "home",
					},
				});
			} else {
				const text = layoutText('logout', `账号或密码错误 <a href='${userUrl}home'>返回</a>`)
				return new Response(text, {
					headers: { "Content-Type": "text/html; charset=utf-8" },
				});
			}
		}

		// 未登录，展示登录页面
		if (url.pathname === userUrl + "home") {

			const text = loginText(userUrl + "home")

			return new Response(
				text,
				{ headers: { "Content-Type": "text/html; charset=utf-8" } }
			);
		};


		return nginx();

	}


	if (url.pathname === userUrl + "home") {

		let output = "";
		output += `
		<h1>${name}</h1>
		<p> 已使用 上行:${up},下行:${down}</p>
		<h2>订阅</h2>
		<p>提示:手机端,可以长按二维码,选择保存图片,可以给 app 扫描图片使用</p>	
		<label>html(v2rayN,v2rayNG,小火箭 等等 app): </label> <br/> <br/>
		<details open>
		<summary>二维码 展开 / 收起</summary>
		<div>
			<img class="user-image" src="${url.origin}${userUrl}Qr" alt="${url.origin}${userUrl}html">
		</div>
		</details>
		<br/>
		<button class="link-style" onclick="copyContent('${name}-html','${url.origin}${userUrl}html')">复制"html"链接</button><br/>
		<br/><br/>
		<label>json(singbox app 专用): </label>  <br/> <br/>
		<details>
		<summary>二维码 展开 / 收起</summary>
		<div>
			<img class="user-image" src="${url.origin}${userUrl}SbQr" alt="${url.origin}${userUrl}json">
		</div>
		</details>
		<br/>
		<button class="link-style" onclick="copyContent('${name}-json','${url.origin}${userUrl}json')">复制"json"链接</button>
		<br/><br/>
		<label>yaml(clash mi 专用): </label>  <br/><br/>
		<details>
		<summary>二维码 展开 / 收起</summary>
		<div>
			<img class="user-image" src="${url.origin}${userUrl}CMQr" alt="${url.origin}${userUrl}yaml">
		</div>
		</details>
		<br/>
		<button class="link-style" onclick="copyContent('${name}-yaml','${url.origin}${userUrl}yaml')">复制"yaml"链接</button><br/><br/><br/>
		<h2>工具</h2>

		<p>windows</p>
		<a href="https://app.ifxxku.dpdns.org/ZhongApp/releases.html#v2rayN" target="_blank" rel="noopener noreferrer" > v2rayN(建议) </a>
		<a href="https://guide.myargo.de5.net/v2rayN" target="_blank" rel="noopener noreferrer" > (使用教程) </a> 
		<br/><br/>
		<a href="https://app.ifxxku.dpdns.org/ZhongApp/releases.html#clashMi" target="_blank" rel="noopener noreferrer" > clash mi </a>
		<a href="https://guide.myargo.de5.net/clashMi" target="_blank" rel="noopener noreferrer" > (使用教程) </a>
		<p>Mac os</p>
		<a href="https://app.ifxxku.dpdns.org/ZhongApp/releases.html#v2rayN" target="_blank" rel="noopener noreferrer" > v2rayN(建议) </a> 
		<br/><br/>
		<a href="https://app.ifxxku.dpdns.org/ZhongApp/other.html#sb11115m" target="_blank" rel="noopener noreferrer" > sing-box app </a>
		<br/><br/>
		<a href="https://app.ifxxku.dpdns.org/ZhongApp/releases.html#clashMi" target="_blank" rel="noopener noreferrer" > clash mi </a>
		<a href="https://guide.myargo.de5.net/clashMi" target="_blank" rel="noopener noreferrer" > (使用教程) </a> 
		<p>安卓</p>
		<a href="https://app.ifxxku.dpdns.org/ZhongApp/releases.html#v2rayNG" target="_blank" rel="noopener noreferrer" > v2rayNG(建议) </a> 
		<a href="https://guide.myargo.de5.net/v2rayNG" target="_blank" rel="noopener noreferrer" > (使用教程) </a>
		<br/><br/>
		<a href="https://app.ifxxku.dpdns.org/ZhongApp/other.html#sb11115a" target="_blank" rel="noopener noreferrer" > sing-box app </a>
		<br/><br/>
		<a href="https://app.ifxxku.dpdns.org/ZhongApp/releases.html#clashMi" target="_blank" rel="noopener noreferrer" > clash mi </a>
		<a href="https://guide.myargo.de5.net/clashMi" target="_blank" rel="noopener noreferrer" > (使用教程) </a> 
		<p>apple 移动端 app (也支持Mac os)</p>
		<a href="https://apps.apple.com/us/app/shadowrocket/id932747118" target="_blank" rel="noopener noreferrer" > 小火箭(付费,建议) </a>
		<a href="https://guide.myargo.de5.net/shadowrocket" target="_blank" rel="noopener noreferrer" > (使用教程) </a> 
		<br/> <br/>
		<a href="https://apps.apple.com/us/app/sing-box-vt/id6673731168" target="_blank" rel="noopener noreferrer" > sing-box app </a> 
		<br/><br/>
		<a href="https://app.ifxxku.dpdns.org/ZhongApp/releases.html#clashMi" target="_blank" rel="noopener noreferrer" > clash mi </a> 
		<a href="https://guide.myargo.de5.net/clashMi" target="_blank" rel="noopener noreferrer" > (使用教程) </a>
		<br/><br/>
		<p><a href="${userUrl}logout">退出</a></p>
		<script>
			function copyContent(title , text) {
				// 创建一个临时的 textarea 元素
				const tempInput = document.createElement('textarea');
				tempInput.value = text;  // 设置 textarea 的值为要复制的文本
				document.body.appendChild(tempInput);  // 将 textarea 元素添加到 body
				
				// 选择 textarea 内容并复制
				tempInput.select();
				tempInput.setSelectionRange(0, 99999);  // 适用于移动设备

				// 执行复制操作
				document.execCommand("copy");

				// 移除临时的 textarea 元素
				document.body.removeChild(tempInput);

				
				alert(title + " 复制成功");
			}
	</script>	
	`;

		return subUrl(output);

	};

	// 登出逻辑
	if (url.pathname === userUrl + "logout") {
		return new Response(null, {
			status: 302,
			headers: {
				"Set-Cookie": `${COOKIE_NAME}=deleted; path=${userUrl}home; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
				"Location": userUrl + "home",
			},
		});
	}

	return nginx();

}

function WeChatWeb() {

	const text = `
		<!DOCTYPE html>
		<html>
		<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>请用浏览器打开</title>
		<style>
		body {
		margin:0;
		background:#000;
		color:#fff;
		text-align:center;
		font-family:sans-serif;
		}
		.tip {
		padding-top:80px;
		font-size:18px;
		}
		</style>
		</head>
		<body>
		<div class="tip">
			<p>请点击右上角 ···</p>
			<p>选择「在浏览器中打开」</p>
		</div>
		</body>
		</html>
`
	return new Response(text, {
		headers: { "content-type": "text/html;charset=UTF-8" }
	});
}
