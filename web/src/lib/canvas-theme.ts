export type CanvasColorTheme = "light" | "dark";
export type CanvasBackgroundMode = "dots" | "lines" | "blank";

const classicCanvasThemes = {
    light: {
        canvas: {
            background: "#f4f2ed",
            dot: "rgba(68,64,60,.28)",
            line: "rgba(68,64,60,.12)",
            selectionStroke: "#1c1917",
            selectionFill: "rgba(28,25,23,.06)",
        },
        node: {
            label: "#57534e",
            fill: "#e7e5df",
            panel: "#fbfaf7",
            stroke: "#d6d3ca",
            activeStroke: "#1c1917",
            placeholder: "#8a8479",
            text: "#292524",
            muted: "#78716c",
            faint: "#a8a29e",
        },
        toolbar: {
            panel: "rgba(251,250,247,.96)",
            border: "#d6d3ca",
            item: "#57534e",
            itemHover: "#e7e5df",
            activeBg: "#e7e5df",
            activeText: "#292524",
        },
    },
    dark: {
        canvas: {
            background: "#181715",
            dot: "rgba(245,245,244,.24)",
            line: "rgba(245,245,244,.10)",
            selectionStroke: "#fafaf9",
            selectionFill: "rgba(250,250,249,.10)",
        },
        node: {
            label: "#d6d3d1",
            fill: "#292524",
            panel: "#1f1d1a",
            stroke: "#44403c",
            activeStroke: "#fafaf9",
            placeholder: "#a8a29e",
            text: "#f5f5f4",
            muted: "#d6d3d1",
            faint: "#78716c",
        },
        toolbar: {
            panel: "rgba(31,29,26,.96)",
            border: "#44403c",
            item: "#d6d3d1",
            itemHover: "#292524",
            activeBg: "#3a3631",
            activeText: "#f5f5f4",
        },
    },
} as const;

export const studioCanvasThemes = {
    light: {
        canvas: { background: "#f2f5f4", dot: "rgba(22,33,31,.16)", line: "rgba(22,33,31,.07)", selectionStroke: "#147867", selectionFill: "rgba(20,120,103,.08)" },
        node: { label: "#65746f", fill: "#f7faf8", panel: "#ffffff", stroke: "#c7d5d0", activeStroke: "#147867", placeholder: "#84938d", text: "#16211f", muted: "#65746f", faint: "#93a39d" },
        toolbar: { panel: "rgba(255,255,255,.95)", border: "#c7d5d0", item: "#65746f", itemHover: "#e8f0ed", activeBg: "#d8e9e2", activeText: "#147867" },
    },
    dark: {
        canvas: { background: "#111419", dot: "rgba(155,168,169,.18)", line: "rgba(155,168,169,.08)", selectionStroke: "#79d8c0", selectionFill: "rgba(121,216,192,.12)" },
        node: { label: "#b4c0c1", fill: "#191e26", panel: "#212832", stroke: "#35404b", activeStroke: "#79d8c0", placeholder: "#71808b", text: "#eef3f1", muted: "#9ba8a9", faint: "#64717d" },
        toolbar: { panel: "rgba(25,30,38,.96)", border: "#35404b", item: "#b4c0c1", itemHover: "#25323a", activeBg: "#2b3a3e", activeText: "#abefdb" },
    },
} as const;

export const canvasThemes = new Proxy(classicCanvasThemes, {
    get(target, property: string | symbol, receiver) {
        const source = typeof document !== "undefined" && document.documentElement.dataset.uiStyle === "studio" ? studioCanvasThemes : target;
        return Reflect.get(source, property, receiver);
    },
}) as typeof classicCanvasThemes;

export type CanvasTheme = (typeof canvasThemes)[CanvasColorTheme];
