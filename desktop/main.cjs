const { app, BrowserWindow, Menu } = require("electron");
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const DEV_URL = "http://localhost:3000";
const STATIC_PORT = 3210;
let DESKTOP_AI_DEFAULT;
try {
    DESKTOP_AI_DEFAULT = require("./default-config.local.cjs");
} catch {}
let mainWindow;
let staticServer;
let staticUrl;

function createWindow(url) {
    mainWindow = new BrowserWindow({
        width: 1440,
        height: 960,
        minWidth: 1024,
        minHeight: 700,
        title: "无限画布",
        titleBarStyle: "hiddenInset",
        trafficLightPosition: { x: 14, y: 14 },
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
        },
    });

    mainWindow.loadURL(url);
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

function contentType(filePath) {
    return {
        ".css": "text/css; charset=utf-8",
        ".gif": "image/gif",
        ".html": "text/html; charset=utf-8",
        ".ico": "image/x-icon",
        ".jpeg": "image/jpeg",
        ".jpg": "image/jpeg",
        ".js": "text/javascript; charset=utf-8",
        ".json": "application/json; charset=utf-8",
        ".mjs": "text/javascript; charset=utf-8",
        ".png": "image/png",
        ".svg": "image/svg+xml",
        ".webp": "image/webp",
        ".woff": "font/woff",
        ".woff2": "font/woff2",
    }[path.extname(filePath).toLowerCase()] || "application/octet-stream";
}

function startStaticServer(root) {
    staticServer = http.createServer((request, response) => {
        const requestUrl = new URL(request.url || "/", "http://127.0.0.1");
        if (requestUrl.pathname === "/config.js" && DESKTOP_AI_DEFAULT) {
            response.setHeader("Content-Type", "text/javascript; charset=utf-8");
            response.end(`window.__DESKTOP_AI_DEFAULT__ = ${JSON.stringify(DESKTOP_AI_DEFAULT)};`);
            return;
        }
        const requestedPath = decodeURIComponent(requestUrl.pathname);
        const relativePath = requestedPath === "/" ? "index.html" : requestedPath.slice(1);
        const candidate = path.resolve(root, relativePath);
        const safeRoot = path.resolve(root) + path.sep;
        const filePath = candidate.startsWith(safeRoot) && fs.existsSync(candidate) && fs.statSync(candidate).isFile() ? candidate : path.join(root, "index.html");

        fs.readFile(filePath, (error, data) => {
            if (error) {
                response.statusCode = 500;
                response.end("无法加载桌面版前端");
                return;
            }
            response.setHeader("Content-Type", contentType(filePath));
            response.setHeader("Cache-Control", "no-cache");
            response.end(data);
        });
    });

    return new Promise((resolve, reject) => {
        staticServer.once("error", reject);
        staticServer.listen(STATIC_PORT, "127.0.0.1", () => {
            const address = staticServer.address();
            if (!address || typeof address === "string") return reject(new Error("桌面版本地服务启动失败"));
            resolve(`http://127.0.0.1:${address.port}`);
        });
    });
}

async function launch() {
    if (!app.isPackaged) {
        createWindow(DEV_URL);
        return;
    }

    const frontendRoot = path.join(process.resourcesPath, "dist");
    staticUrl ||= await startStaticServer(frontendRoot);
    createWindow(staticUrl);
}

app.whenReady().then(async () => {
    Menu.setApplicationMenu(
        Menu.buildFromTemplate([
            {
                label: app.name,
                submenu: [{ role: "about" }, { type: "separator" }, { role: "hide" }, { role: "hideOthers" }, { role: "unhide" }, { type: "separator" }, { role: "quit" }],
            },
            {
                label: "编辑",
                submenu: [{ role: "undo" }, { role: "redo" }, { type: "separator" }, { role: "cut" }, { role: "copy" }, { role: "paste" }, { role: "selectAll" }],
            },
            {
                label: "视图",
                submenu: [{ role: "reload" }, { role: "forceReload" }, { role: "toggleDevTools" }, { type: "separator" }, { role: "resetZoom" }, { role: "zoomIn" }, { role: "zoomOut" }],
            },
        ]),
    );
    try {
        await launch();
    } catch (error) {
        console.error(error);
        app.quit();
    }
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (!mainWindow) void launch();
});

app.on("before-quit", () => {
    staticServer?.close();
});
