import { modelOptionName } from "@/stores/use-config-store";

export const KKAI_SEEDDANCE_MODEL = "seeddance";
export const KKAI_SEEDDANCE_API_MODEL = "video-v2";

export const KKAI_SEEDDANCE_REFERENCE_LIMITS = {
    images: 9,
    videos: 3,
    audios: 3,
    imageMaxBytes: 20 * 1024 * 1024,
    videoMaxBytes: 200 * 1024 * 1024,
    audioMaxBytes: 50 * 1024 * 1024,
};

export const KKAI_SEEDDANCE_RATIOS = ["16:9", "9:16", "1:1"] as const;
export const KKAI_SEEDDANCE_DURATIONS = [5, 10, 15] as const;

export function isKkaiSeeddanceModel(model: string) {
    const value = modelOptionName(model).trim().toLowerCase();
    return value === KKAI_SEEDDANCE_MODEL || value === "video-v2" || value === "video-v2-fast";
}

export function kkaiSeeddanceApiModel(model: string) {
    return modelOptionName(model).trim().toLowerCase() === "video-v2-fast" ? "video-v2-fast" : KKAI_SEEDDANCE_API_MODEL;
}

export function normalizeKkaiSeeddanceRatio(value: string) {
    if (KKAI_SEEDDANCE_RATIOS.includes(value as (typeof KKAI_SEEDDANCE_RATIOS)[number])) return value as (typeof KKAI_SEEDDANCE_RATIOS)[number];
    if (value === "720x1280" || value === "9:16") return "9:16";
    if (value === "1024x1024" || value === "1:1") return "1:1";
    return "16:9";
}

export function normalizeKkaiSeeddanceDuration(value: string) {
    const seconds = Number(value);
    return KKAI_SEEDDANCE_DURATIONS.includes(seconds as (typeof KKAI_SEEDDANCE_DURATIONS)[number]) ? seconds : 5;
}

export function normalizeKkaiSeeddancePrompt(prompt: string, imageCount: number, videoCount: number, audioCount: number) {
    const normalized = prompt.replaceAll("＠", "@").replace(/@(参考图|图片|image|参考视频|视频|video|参考音频|音频|audio)(\d+)/gi, (_, kind: string, rawIndex: string) => {
        if (rawIndex.length > 1 && rawIndex.startsWith("0")) throw new Error(`提示词中的 @${kind}${rawIndex} 编号格式无效，请从 1 开始填写`);
        const index = Number(rawIndex);
        if (kind.includes("视频") || kind.toLowerCase() === "video") return `@Video${index}`;
        if (kind.includes("音频") || kind.toLowerCase() === "audio") return `@Audio${index}`;
        return `@Image${index}`;
    });
    validateKkaiSeeddanceReferences(normalized, imageCount, videoCount, audioCount);
    return normalized;
}

export function kkaiSeeddanceReferenceError(imageCount: number, videoCount: number, audioCount: number) {
    if (imageCount > KKAI_SEEDDANCE_REFERENCE_LIMITS.images) return `KKAI seeddance 最多支持 ${KKAI_SEEDDANCE_REFERENCE_LIMITS.images} 张参考图`;
    if (videoCount > KKAI_SEEDDANCE_REFERENCE_LIMITS.videos) return `KKAI seeddance 最多支持 ${KKAI_SEEDDANCE_REFERENCE_LIMITS.videos} 个参考视频`;
    if (audioCount > KKAI_SEEDDANCE_REFERENCE_LIMITS.audios) return `KKAI seeddance 最多支持 ${KKAI_SEEDDANCE_REFERENCE_LIMITS.audios} 个参考音频`;
    return "";
}

export function validateKkaiSeeddanceReferences(prompt: string, imageCount: number, videoCount: number, audioCount: number) {
    const checks = [
        { kind: "Image", count: imageCount },
        { kind: "Video", count: videoCount },
        { kind: "Audio", count: audioCount },
    ];
    for (const check of checks) {
        const pattern = new RegExp(`@${check.kind}(\\d+)`, "g");
        let match: RegExpExecArray | null;
        while ((match = pattern.exec(prompt))) {
            const index = Number(match[1]);
            if (!Number.isInteger(index) || index < 1 || index > check.count) throw new Error(`提示词中的 @${check.kind}${index} 超出已上传的${check.kind === "Image" ? "参考图" : check.kind === "Video" ? "参考视频" : "参考音频"}范围`);
        }
    }
}
