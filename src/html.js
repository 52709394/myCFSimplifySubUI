export function responseURL(str, CType = "text/html") {
	return new Response(
		str,
		{ headers: { "Content-Type": CType } }
	);
}

export function nginx() {

	const str = `
	<h1>Welcome to nginx!</h1>
	<p>If you see this page, the nginx web server is successfully installed and
	working. Further configuration is required.</p>
	
	<p>For online documentation and support please refer to
	<a href="http://nginx.org/">nginx.org</a>.<br/>
	Commercial support is available at
	<a href="http://nginx.com/">nginx.com</a>.</p>
	
	<p><em>Thank you for using nginx.</em></p>	
	`
	const text = layoutText('Welcome to nginx!', str)

	return new Response(text, {
		status: 200,
		headers: {
			'Content-Type': 'text/html; charset=UTF-8',
		},
	});

}

export function subUrl(url) {

	const text = layoutText('Welcome to Sub!', url)

	return new Response(text, {
		status: 200,
		headers: {
			'Content-Type': 'text/html; charset=UTF-8',
		},
	});

}

export function layoutText(title, text) {
	let body
	if (title === "Welcome to nginx!") {
		body = `
		body {
			width: 35em;
			margin: 0 auto;
			font-family: Tahoma, Verdana, Arial, sans-serif;
		}`
	} else {
		body = `
		body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin-top: 50px;
		}`
	}
	return `
	<!DOCTYPE html>
	<html lang="zh-CN">
	<html>
	<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>${title}</title>
	<style>
		${body}

		/* 返回顶部按钮样式 */
		#back-to-top {
			position: fixed;
			bottom: 30px;
			right: 30px;
			width: 50px;
			height: 50px;
			background-color: #333;
			color: white;
			border: none;
			border-radius: 50%;
			cursor: pointer;
			font-size: 20px;
			opacity: 0;
			visibility: hidden;
			transition: all 0.3s ease;
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
		}
		
		#back-to-top:hover {
			background-color: #555;
		}
		
		#back-to-top.visible {
			opacity: 1;
			visibility: visible;
		}		

		/* 固定顶部导航样式 */
		.tutorial-nav {
			top: 0;
			left: 0;
			width: 100%;
			background-color: #444;
			z-index: 1000;
			box-shadow: 0 2px 5px rgba(0,0,0,0.2);
		}           
			
		.nav-container {
			max-width: 1200px;
			margin: 0 auto;
			padding: 10px 20px;
		}

		/* 导航菜单样式 */
		.tutorial-nav ul {
			list-style: none;
			padding: 0;
			margin: 0;
			display: flex;
			gap: 30px;
		}

		.tutorial-nav a {
			color: white;
			text-decoration: none;
			font-weight: bold;
			padding: 5px 10px;
			border-radius: 4px;
			transition: all 0.3s;
		}

		.tutorial-nav a:hover {
			background-color: #666;
		}

		.tutorial-nav a.active {
			color: red;
			border-bottom: 2px solid red;
		}

		select {
            display: block;
            margin: 0 auto 10px auto;
            font-size: 18px;
            font-weight: bold;
            padding: 6px 12px;
        }

		.link-style {
			background: none;
			border: none;
			color: #0066cc;
			text-decoration: underline;
			cursor: pointer;
			font: inherit;
			padding: 0;
		}

		.link-style:hover {
			color: #004499;
			text-decoration: none;
		}

		/* 弹窗样式 */
		.modal {
			display: none;
			position: fixed;
			z-index: 1;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.8);
			text-align: center;
		}

		.modal-content {
			display: inline-block;
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
		}

		.image-title {
			font-size: 24px;
			font-weight: bold;
			margin-bottom: 15px;
			color: #ff0000;
			text-shadow: 1px 1px 2px #000;
		}

		.modal-image {
			max-width: 100%;
			max-height: 70vh;
			box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
		}

		.user-image {
			max-width: 100%;
			max-height: 70vh;
			box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
		}

		.close {
			font-size: 40px;
			font-weight: bold;
			position: absolute;
			top: 20px;
			right: 30px;
			cursor: pointer;
			text-shadow: 1px 1px 2px #000;
		}
			
		.text-set {
			width: 90%;
			height: 400px;
			font-size: 16px;
		}

		.but-set {
			margin-top:10px;
			padding:10px 30px;
		}
	</style>
	</head>
	<body>
	${text}
	</body>
	</html>
	`
}

export function loginText(url) {
	return `
	<!DOCTYPE html>
	<html lang="zh-CN">

	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Welcome to Login!</title>
		<style>
			body,
			html {
				height: 100%;
				margin: 0;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: #f0f0f0;
				font-family: Arial, sans-serif;
			}

			.login-container {
				background: white;
				padding: 20px;
				border-radius: 10px;
				box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
				text-align: center;
			}

			form {
				display: flex;
				flex-direction: column;
				align-items: center;
			}

			input[type="text"],
			input[type="password"] {
				margin-bottom: 10px;
				padding: 8px;
				width: 100%;
				max-width: 300px;
				box-sizing: border-box;
			}

			input[type="submit"] {
				padding: 8px 20px;
				background-color: #4CAF50;
				color: white;
				border: none;
				border-radius: 5px;
				cursor: pointer;
			}

			input[type="submit"]:hover {
				background-color: #45a049;
			}

			.error {
				color: red;
				margin-top: 10px;
			}
		</style>
	</head>

	<body>
		<div class="login-container">
        <h2>登录</h2>
        <form method="POST" action="${url}">
            <label for="username">用户:</label>
            <input type="text" id="username" name="username" required><br>
            <label for="password">密码:</label>
            <input type="password" id="password" name="password" required><br>
            <input type="submit" value="登录">
        </form>
		</div>
	</body>

	</html>
	`;
}
