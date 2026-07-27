import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeName = "light" | "dark";
export type UiStyle = "classic" | "studio";

type ThemeStore = {
    theme: ThemeName;
    uiStyle: UiStyle;
    setTheme: (theme: ThemeName) => void;
    setUiStyle: (uiStyle: UiStyle) => void;
    toggleUiStyle: () => void;
};

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set) => ({
            theme: "dark",
            uiStyle: "classic",
            setTheme: (theme) => set({ theme }),
            setUiStyle: (uiStyle) => set({ uiStyle }),
            toggleUiStyle: () => set((state) => ({ uiStyle: state.uiStyle === "classic" ? "studio" : "classic" })),
        }),
        { name: "infinite-canvas:theme_store" },
    ),
);
