import { modelOptionName } from "@/stores/use-config-store";

export const GROK_IMAGINE_15_VIDEO_MODEL = "grok-imagine-1.5-video";

export function isGrokImagine15VideoModel(model: string) {
    return modelOptionName(model).trim().toLowerCase() === GROK_IMAGINE_15_VIDEO_MODEL;
}
