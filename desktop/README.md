# 无限画布 macOS 桌面版

桌面版使用 Electron 封装现有 `web/` 前端，首期面向 Apple Silicon Mac，生成未签名的 `.app` 和 `.dmg`。

## 开发运行

先分别安装前端和桌面版依赖：

```bash
cd web
npm install --legacy-peer-deps

cd ../desktop
npm install
npm run dev
```

`npm run dev` 会同时启动 Vite 和 Electron，前端修改后仍使用 Vite 热更新。

## 打包

在 `desktop/` 目录执行：

```bash
npm run make
```

产物位于 `desktop/out/make/`，包括 Apple Silicon `.dmg` 和 `.zip`。首次打开未签名应用时，macOS 可能需要在「系统设置 -> 隐私与安全性」中手动允许。

## Canvas Agent

桌面版不会自动启动本地 Agent。需要另外运行：

```bash
npx -y @basketikun/canvas-agent
```

然后在画布 Agent 面板中填写 Local URL 和 Connect token。Agent 仍然以独立 Node 服务运行，和网页版使用同一套 HTTP/SSE 协议。

## 数据与密钥

桌面版使用自己的 Electron 本地存储空间，不会自动读取浏览器中的画布、素材或生成记录。API Key、Base URL 和其他配置仍然只保存在当前 Mac 本地，并由前端直接请求 OpenAI 兼容接口。
