export let SubConfig = {}

export async function getSubConfig(env) {

    const config = await env.sub_data.get("subCofig");

    if (config) {
        SubConfig = JSON.parse(config)
        return
    }

    SubConfig = JSON.parse(originConfig())
}

export function userSubSet() {

    let output = "";

    let iniSrt = ""
    let renewSrt = ""

    iniSrt = "`" + `"是否初始化配置?\\n`
    iniSrt += `点击 "是" 继续\\n\\n`
    iniSrt += `(自动原来配置备份到粘贴板)"` + "`"

    renewSrt = "`" + `"是否更新配置?\\n`
    renewSrt += `点击 "是" 继续\\n\\n`
    renewSrt += `(自动原来配置备份到粘贴板)"` + "`"

    const config = JSON.stringify(SubConfig, null, 4)

    output = `
        <nav class="tutorial-nav">
        <div class="nav-container">
            <ul>
                <li><a href="${SubConfig.web_url}/home.html">主页</a></li>
                <li><a href="${SubConfig.web_url}/set.html" class="active">设置</a></li>
            </ul>
        </div>
    </nav>	
    <h3>JSON 编辑</h3>

    <button class="link-style" onclick="init()">初始化</button><br/><br/>

    <textarea class="text-set" id="json">
    ${config}
    </textarea>

    <br>
    <button id="send" class="but-set" onclick="submitJson()">提交</button>

    <p><a href="${SubConfig.web_url}/logout">退出</a></p>

    <script>

        function init() {
           
            if (!confirm(${iniSrt})) {
               return;
            }
           
            let text = document.getElementById("json").value;

            copyContent(text)

            window.location.replace("${SubConfig.web_url}/init");
    }

    async function submitJson(){

        if (!confirm(${renewSrt})) {
            return;
        }

        const send = document.getElementById("send")
        let text = document.getElementById("json").value;

        send.disabled = true;
        send.innerText = '处理中';

        copyContent(${config})

        try{
            JSON.parse(text);
        }
        catch(e){
            send.disabled = false;
            send.innerText = "提交";

            alert("JSON格式错误");
            return;
        }

        let res = await fetch("${SubConfig.web_url}/renew",{
            method:"POST",
            headers:{
            "Content-Type":"application/json"
            },
            body:text
        });


        const result = await res.text();

        send.disabled = false;
        send.innerText = "提交";

        if (isValidUrl(result)) {
            window.location.replace(result);
            return;
        }
  
        alert(result);

    }
  
    function copyContent(text) {
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
    }

    function isValidUrl(str) {
    try {
        new URL(str);
        return true;
    } catch (_) {
        return false;
    }
    }         

    </script>
			`
    return output
}

export function renewConfig(obj) {
    let re


    re = /^\/[a-zA-Z0-9]+$/;
    if (!re.test(obj.web_url)) {
        return "web_url 字段格式不正确";
    }

    re = /^.{3,16}$/;
    if (!re.test(obj.web_user) &&
        obj.web_user === undefined) {
        return "web_user 字段格式不正确";
    }

    re = /^.{3,16}$/;
    if (!re.test(obj.web_password) ||
        obj.web_password === undefined) {
        return "web_password 字段格式不正确";
    }

    re = /^.{3,16}$/;
    if (!re.test(obj.user_password) ||
        obj.user_password === undefined) {
        obj.user_password = "52709394"
    }

    re = /^.{3,16}$/;
    if (!re.test(obj.cookie_name) ||
        obj.cookie_name === undefined) {
        obj.cookie_name = "52709394"
    }

    re = /^.{3,16}$/;
    if (!re.test(obj.cookie_value) ||
        obj.cookie_value === undefined) {
        obj.cookie_value = "52709394"
    }



    const users_obj = {}
    const users_arr = []
    let usersObj, usersArr

    if (obj.users_obj) {

        let isObj = false
        for (let key in obj.users_obj) {
            if (Object.prototype.hasOwnProperty.call(obj.users_obj, key)) {
                const value = obj.users_obj[key];

                if (typeof value === 'object' && value != null) {
                    isObj = true
                    const nodes = []
                    if (Array.isArray(obj.users_obj[`${key}`].nodes)) {
                        for (const n of obj.users_obj[`${key}`].nodes) {
                            nodes.push({
                                "addr": n.addr,
                                "sni": n.sni,
                                "none": n.none
                            })
                        }
                    }
                    users_obj[`${key}`] = {
                        "enable": obj.users_obj[`${key}`].enable,
                        "node_cf": obj.users_obj[`${key}`].node_cf,
                        "none_atuo_select": obj.users_obj[`${key}`].none_atuo_select,
                        "addr": obj.users_obj[`${key}`].addr,
                        "port": obj.users_obj[`${key}`].port,
                        "ports": obj.users_obj[`${key}`].ports,
                        "security": obj.users_obj[`${key}`].security,
                        "nodes": nodes
                    }

                }
            }
        }

        if (isObj) {
            usersObj = users_obj
        }

    }


    if (Array.isArray(obj.users_arr)) {
        if (obj.users_arr.length) {

            const modelList = [
                "vmess+tcp+none",
                "vmess+ws+none",
                "vmess+tcp+tls",
                "vmess+ws+tls",
                "vmess+httpupgrade+tls",
                "vmess+xhttp+tls",
                "vless+tcp+tls",
                "vless+ws+tls",
                "vless+httpupgrade+tls",
                "vless+xhttp+tls",
                "vless+tcp+reality",
                "vless+grpc+reality",
                "vless+xhttp+reality",
                "trojan+tcp+tls",
                "trojan+ws+tls",
                "trojan+httpupgrade+tls",
                "trojan+xhttp+tls",
                "hysteria",
                "anytls",
                "tuic"
            ]



            const subUrlArr = []

            for (const user of obj.users_arr) {

                if (user.name === null || user.name === "") {
                    return `name(${user.name}) 不能为空!`
                }

                subUrlArr.push(user.sub_url)
                re = new RegExp("^\/[a-zA-Z0-9\/]{6,}\/" + user.name + "\.$");

                if (!re.test(user.sub_url)) {
                    return `sub_url(${user.sub_url}) 字段格式不正确 \n` +
                        `(格式: /xxxxxx.../${user.name}.)`;
                }

                if (user.none === null || user.none === "") {
                    return `none(${user.name}的none字段) 不能为空! \n`;
                }

                if (!modelList.includes(user.model)) {
                    return `model(${user.name}的model字段) 不正确! \n` +
                        `(可选值:\n ${modelList.join(`\n `)})`;
                }

                const nodes = []
                if (Array.isArray(user.nodes)) {
                    for (const n of user.nodes) {
                        nodes.push({
                            "addr": n.addr,
                            "sni": n.sni,
                            "none": n.none
                        })
                    }
                }

                users_arr.push({
                    "name": user.name,
                    "enable": user.enable,
                    "sub_url": user.sub_url,
                    "autoSelect": user.autoSelect,
                    "node_cf": user.node_cf,
                    "addr": user.addr,
                    "port": user.port,
                    "ports": user.ports,
                    "model": user.model,
                    "uuid": user.uuid,
                    "password": user.password,
                    "tuicCC": user.tuicCC,
                    "path": user.path,
                    "serviceName": user.serviceName,
                    "sni": user.sni,
                    "pbk": user.pbk,
                    "sid": user.sid,
                    "isInsecure": user.isInsecure,
                    "fp": user.fp,
                    "none": user.none,
                    "nodes": user.nodes
                })
            }


            if (new Set(subUrlArr).size !== subUrlArr.length) {
                return `users_arr.sub_url 字段 users_arr.sub_url 不是唯一性 \n` +
                    `(请检查 全有 users_arr.sub_url 字段)`;
            }

            usersArr = users_arr
        }
    }

    const nodes = []
    if (Array.isArray(obj.all_user?.nodes)) {
        for (const n of obj.all_user.nodes) {
            nodes.push({
                "addr": n.addr,
                "sni": n.sni,
                "none": n.none
            })
        }
    }

    const newObj = {
        "web_url": obj.web_url,
        "web_user": obj.web_user,
        "web_password": obj.web_password,
        "user_password": obj.user_password,
        "cookie_name": obj.cookie_name,
        "xui_url": obj.xui_url,
        "xui_token": obj.xui_token,
        "manual_model": obj.manual_model,
        "node_cf": obj.node_cf,
        "cf_ips_url": obj.cf_ips_url,
        "none_atuo_select": obj.none_atuo_select,
        "none_front": obj.none_front,
        "none_back": obj.none_back,
        "all_user": {
            "addr": obj.all_user?.addr,
            "port": obj.all_user?.port,
            "ports": obj.all_user?.ports,
            "sni": obj.all_user?.sni,
            "security": obj.all_user?.security,
            "nodes": nodes
        },
        "backup": {
            "enable": obj.backup.enable,
            "html": obj.backup.html,
            "json": obj.backup.json,
            "yaml": obj.backup.yaml
        },
        "users_obj": usersObj,
        "users_arr": usersArr
    }

    SubConfig = newObj

    return ""
}

export function initConfig() {
    SubConfig = JSON.parse(originConfig())
}

export function originConfig() {
    return `
        {
            "说明":"说明在提交后自动删除掉!",
            "web_url 说明": "管理用户页面路径,已'/'开头",
            "web_url": "/52709394",
            "web_user 说明": "管理用户页面账号.",
            "web_user": "52709394",
            "web_password 说明": "管理用户页面密码",
            "web_password": "52709394",
            "user_password 说明": "用户页面密码",
            "user_password": "52709394",
            "cookie_name 说明": "登录缓存名称",
            "cookie_name": "52709394",
            "cookie_value 说明": "登录缓存值",
            "cookie_value": "52709394",
            "xui_url 说明": "你的'3x-ui'地址",
            "xui_url": null,
            "xui_token 说明": "3x-ui 的 token",
            "xui_token": null,
            "manual_model 说明1": "手动模式,非'3x-ui'一样他可以使用,使用字串布尔值启用手动模式",
            "manual_model 说明2": "不用设置 xui_url 和 xui_token",
            "manual_model 说明3": "手动模式 使用'users_arr','3x-ui'使用'users_obj'",
            "manual_model": null,
            "node_cf 说明": "'cf'优化模式并且单独用户设置也要开启,使用字串布尔值启用",
            "node_cf": null,
            "cf_ips_url 说明1": "'cf'优化ip库地址",
            "cf_ips_url 说明2": "'cf'优化ip库格式(每行): '地址 , 端口' ",
            "cf_ips_url": null,
            "none_atuo_select 说明1": " 'singbox','clash'节点自动切换模式,使用字串布尔值启用手动模式",
            "none_atuo_select 说明2": "'并且在 用户的'nodes'字段设置多节点",
            "none_atuo_select": null,
            "none_front 说明1": "节点名前置补充",
            "none_front 说明2": "例如:'3x-ui' 的 'email'为'john','none_front'为'us-'输出结果'us-john'",
            "none_front 说明3": "手动模式不支持",
            "none_front": null,
            "none_back 说明": "节点名后置补充,参考'none_front'说明",
            "none_back": null,
            "all_user 说明1": "'3x-ui'所有用户设置,也可以在'users_obj'单独用户设置",
            "all_user 说明2": "一般情况不用指定,例如:'nginx sni'分流,'VMess + WebSocket + 前置Nginx tls' 玩家指定 地址,端口,sni",
            "all_user 说明3": "手动模式不支持",
            "all_user": {
                "addr 说明1": "指定所有用户地址,也可以'users_obj'单独设置! 'all_user' 和 'users_obj'",
                "addr 说明2": "如果同时 'all_user' 和 'users_obj',结果以'users_obj'设置",
                "addr 说明3": "无法正确地址,可以通过'addr'设置",
                "addr": null,
                "port 说明": "指定所有用户端口,参考addr说明",
                "port": null,
                "ports 说明": "指定'hysteria2' 端口跳跃范围",
                "ports": null,
                "sni 说明": "指定所以用户sni,例如:'nginx sni'分流,参考addr说明",
                "sni": null,
                "security 说明": "指定所以用户'security'值,例如:VMess + WebSocket + 前置Nginx tls',参考addr说明",
                "security": "tls",
                "nodes 说明": "多节点,相同协议,地址,sni,名称不一样,参考addr说明",
                "nodes": [
                    {
                        "addr 说明": "如有,必要写,节点地址",
                        "addr": null,
                        "sni": null,
                        "none 说明": "如有,必要写,节点名称,确保与节点名称唯一性",
                        "none": null
                    }
                ]
            },
            "backup 说明": "应急备用节点,开启所有用户转到备用节点",
            "backup": {
                "enable 说明": "使用字串布尔值启用备用节点",
                "enable": "false",
                "html 说明": "如 v2rayN , 小火箭 客户端链接",
                "html": null,
                "json 说明": "'sing-box'官方客户端链接",
                "json": null,
                "yaml 说明": "'clash mihomo'系列客户端链接",
                "yaml": null
            },
            "users_obj 说明1": "'3x-ui'专用,参考'all_user'对象下字段和数组",
            "users_obj 说明2": "一般情况不用指定,例如:'nginx sni'分流,'VMess + WebSocket + 前置Nginx tls' 玩家指定 地址,端口,sni",
            "users_obj 说明3": "第一次使用,所有用户会自动填充'null'",
            "users_obj 说明4": "'manual_model'不为'true'即为启用",
            "users_obj": {
                "test-user 说明": "对应'3x-ui'email用户名",
                "test-user": {
                    "enable 说明1": "使用字串布尔值启用备用节点,默认为开启",
                    "enable 说明2": "当为'false',禁用状态,会自动转入备用链接",
                    "enable": null,
                    "node_cf 说明": "'cf'优化模式开启并且全局也开启,使用字串布尔值启用",
                    "node_cf": null,
                    "none_atuo_select 说明": "参考全局说明,可单独开启,使用字串布尔值启用",
                    "none_atuo_select": null,
                    "addr 说明": "单独设置,参考'all_user.addr'说明",
                    "addr": null,
                    "port 说明": "单独设置,参考'all_user.port'说明",
                    "port": null,
                    "ports 说明": "指定'hysteria2' 端口跳跃范围",
                    "ports": null,
                    "security 说明": "单独设置,参考'all_user.security'说明",
                    "security": null,                   
                    "nodes 说明": "单独设置,参考'all_user.nodes'说明",
                    "nodes": [
                        {
                            "addr": null,
                            "sni": null,
                            "none": null
                        }
                    ]
                }
            },
            "model 列表 说明":[
                "vmess+tcp+none",
                "vmess+ws+none",
                "vmess+tcp+tls",
                "vmess+ws+tls",
                "不支持,clash",
                "vmess+httpupgrade+tls",
                "不支持sing-box",
                "vmess+xhttp+tls",
                "vless+tcp+tls",
                "vless+ws+tls",
                "不支持,clash",
                "vless+httpupgrade+tls",
                "不支持sing-box",
                "vless+xhttp+tls",
                "vless+tcp+reality",
                "vless+grpc+reality",
                "不支持sing-box",
                "vless+xhttp+reality",
                "trojan+tcp+tls",
                "trojan+ws+tls",
                "不支持,clash",
                "trojan+httpupgrade+tls",
                "不支持sing-box",
                "trojan+xhttp+tls",
                "手动模式,写为'hysteria'",
                "hysteria2",
                "只有手动模式",
                "anytls",
                "tuic"
            ],
            "users_arr 说明":"手动模式,'manual_model'为'true'即为启用",
            "users_arr": [
                {
                    "name 说明": "必要,跟'email'字段一样,在用户显示用户名",
                    "name": "test-user",
                    "enable 说明": "参考'users_obj.enable'字段",
                    "enable": null,
                    "sub_url 说明": "必要,用户前置路径,要唯一的,建议复杂点,必须以格式:'/xxxxxx.../name.' 最终链接会以'html json yaml home'结尾",
                    "sub_url": "/xxxxxx/test-user.",
                    "autoSelect 说明": "参考'users_obj.autoSelect'字段",
                    "autoSelect": null,
                    "node_cf 说明": "参考'users_obj.node_cf'字段",
                    "node_cf": null,
                    "addr 说明": "必要,节点地址",
                    "addr": null,
                    "port 说明": "必要,节点端口",
                    "port": null,
                    "ports 说明": "指定'hysteria2' 端口跳跃范围",
                    "ports": null,
                    "model 说明": "必要,参考 'model 列表 说明'",
                    "model": null,
                    "uuid 说明": "必要,节点'uuid'",
                    "uuid": null,
                    "password 说明":"必要,节点 'password'",
                    "password": null,
                    "tuicCC 说明": "节点 'tuic'的'congestion-controller'",
                    "tuicCC": null,
                    "path 说明":"节点'ws','httpupgrade','xhttp'的'path'",
                    "path": null,
                    "serviceName 说明": "节点 'grpc'的'serviceName'",
                    "serviceName": null,
                    "sni 说明": "节点'tls'和'reality'的sni",
                    "sni": null,
                    "pbk 说明": "节点'reality'的pbk",
                    "pbk": null,
                    "sid 说明": "节点'reality'的sid",
                    "sid": null,
                    "isInsecure 说明": "节点是否跳过'tls'证书验证",
                    "isInsecure": null,
                    "fp 说明": "节点'utls'设置,默认使用'chrome'",
                    "fp": null,
                    "none 说明": "必要,节点名称'如果有nodes,确保与'nodes.none'唯一性",
                    "none": null,
                    "nodes 说明": "参考'all_user.nodes'说明",
                    "nodes": [
                        {
                            "addr": null,
                            "sni": null,
                            "none": null
                        }
                    ]
                }
            ]
        }
    `
}