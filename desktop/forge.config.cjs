const path = require("node:path");

module.exports = {
    packagerConfig: {
        name: "InfiniteCanvas",
        productName: "无限画布",
        appBundleId: "com.infinitecanvas.desktop",
        appCategoryType: "public.app-category.graphics-design",
        asar: true,
        extraResource: [path.resolve(__dirname, "../web/dist")],
    },
    rebuildConfig: {},
    makers: [
        {
            name: "@electron-forge/maker-dmg",
            platforms: ["darwin"],
            config: {
                format: "ULFO",
            },
        },
        {
            name: "@electron-forge/maker-zip",
            platforms: ["darwin"],
        },
    ],
};
