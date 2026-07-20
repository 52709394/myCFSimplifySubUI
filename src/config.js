export let SubConfig = {}

export async function getSubConfig(env) {

    const config = await env.sub_data.get("subCofig");

    if (config) {
        SubConfig = JSON.parse(config)
        return
    }

    SubConfig = JSON.parse(originConfig())
}

export async function userSubSet(env) {

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
                <li><a href="${SubConfig.sub_url}/home.html">主页</a></li>
                <li><a href="${SubConfig.sub_url}/set.html" class="active">设置</a></li>
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

    <p><a href="${SubConfig.sub_url}/logout">退出</a></p>

    <script>

        function init() {
           
            if (!confirm(${iniSrt})) {
               return;
            }
           
            let text = document.getElementById("json").value;

            copyContent(text)

            window.location.replace("${SubConfig.sub_url}/init");
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
            alert("JSON格式错误");
            return;
        }

        let res = await fetch("${SubConfig.sub_url}/renew",{
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
    SubConfig = obj
}

export function initConfig() {
    SubConfig = JSON.parse(originConfig())
}

export function originConfig() {
    return `
        {
            "sub_url": "/52709394",
            "web_user": "52709394",
            "web_password": "52709394",
            "cookie_name": "52709394",
            "cookie_value": "52709394",
            "xui_url": null,
            "xui_token": null,
            "none_atuo_select": null,
            "none_front": null,
            "none_back": null,
            "all_user": {
                "addr": null,
                "port": null,
                "sni": null,
                "security": "tls",
                "nodes": []
            },
            "backup": {
                "enable": "false",
                "html": null,
                "json": null,
                "yaml": null
            },
            "users": {
                "test-user": {
                    "enable": null,
                    "none_atuo_select": null,
                    "addr": null,
                    "port": null,
                    "security": null,
                    "nodes": [
                        {
                            "addr": null,
                            "sni": null,
                            "none": null
                        }
                    ]
                }
            }
        }
    `
}