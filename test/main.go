package main

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
)

type Config struct {
	Key  string `json:"key"`
	JSON string `json:"json"`
	Port string `json:"port"`
	Path string `json:"path"`
}

func main() {
	// 读取配置文件
	configFile, err := os.Open("config.json")
	if err != nil {
		log.Fatalf("无法打开配置文件: %v", err)
	}
	defer configFile.Close()

	var cfg Config
	decoder := json.NewDecoder(configFile)
	if err := decoder.Decode(&cfg); err != nil {
		log.Fatalf("解析配置文件失败: %v", err)
	}

	// 从密码派生 AES-256 密钥 (SHA-256)
	key := sha256.Sum256([]byte(cfg.Key))

	// 注册 HTTP 处理函数
	http.HandleFunc(cfg.Path, func(w http.ResponseWriter, r *http.Request) {

		// 设置 CORS 头（放在最前面）
		w.Header().Set("Access-Control-Allow-Origin", "*")

		// 处理预检请求（OPTIONS）
		if r.Method == http.MethodOptions {
			w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
			w.WriteHeader(http.StatusNoContent)
			return
		}

		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		// 动态读取 JSON 文件（你已修改的代码）
		jsonData, err := os.ReadFile(cfg.JSON)
		if err != nil {
			http.Error(w, fmt.Sprintf("读取 JSON 文件失败: %v", err), http.StatusInternalServerError)
			return
		}

		encrypted, err := encrypt(jsonData, key[:])
		if err != nil {
			http.Error(w, fmt.Sprintf("加密失败: %v", err), http.StatusInternalServerError)
			return
		}

		// 注意：Content-Type 在 CORS 头之后设置，无影响
		w.Header().Set("Content-Type", "text/plain")
		w.Write([]byte(encrypted))
	})

	// 启动服务器
	addr := ":" + cfg.Port
	log.Printf("服务启动在 %s，路径 %s", addr, cfg.Path)
	if err := http.ListenAndServe(addr, nil); err != nil {
		log.Fatalf("服务器启动失败: %v", err)
	}
}

// encrypt 使用 AES-GCM 加密数据，返回 Base64 编码的 (nonce + ciphertext + tag)
func encrypt(plaintext []byte, key []byte) (string, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	nonce := make([]byte, gcm.NonceSize())
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return "", err
	}

	// 加密并附加 tag (GCM 自动附加在末尾)
	ciphertext := gcm.Seal(nonce, nonce, plaintext, nil)

	// 整体 Base64 编码
	return base64.StdEncoding.EncodeToString(ciphertext), nil
}
