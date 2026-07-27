import { Bot, Box, FileText, House, Images, LayoutGrid, Menu, Palette, Settings2, Sparkles, Video } from "lucide-react";
import { Button, Tooltip } from "antd";
import { Link, useLocation } from "react-router-dom";

import { navigationTools, type NavigationToolSlug } from "@/constant/navigation-tools";
import { AppConfigModal } from "@/components/layout/app-config-modal";
import { MobileNavDrawer } from "@/components/layout/mobile-nav-drawer";
import { UserStatusActions } from "@/components/layout/user-status-actions";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useAgentStore } from "@/stores/use-agent-store";
import { useThemeStore } from "@/stores/use-theme-store";

const studioContextItems = {
    home: [
        { label: "最近工作", detail: "继续上次创作" },
        { label: "快速创建", detail: "从空白工作区开始" },
        { label: "固定项目", detail: "常用画布与素材" },
    ],
    canvas: [
        { label: "项目概览", detail: "画布与版本" },
        { label: "对象与连接", detail: "当前画布结构" },
        { label: "画布资产", detail: "已引用的媒体" },
    ],
    image: [
        { label: "生成会话", detail: "历史任务与草稿" },
        { label: "参考素材", detail: "本次任务输入" },
        { label: "生成参数", detail: "模型与输出设置" },
    ],
    video: [
        { label: "生成会话", detail: "历史任务与草稿" },
        { label: "镜头素材", detail: "参考图与音频" },
        { label: "视频参数", detail: "模型与时间设置" },
    ],
    prompts: [
        { label: "公共提示词", detail: "按来源浏览" },
        { label: "我的提示词", detail: "个人收藏与草稿" },
        { label: "标签与分类", detail: "管理内容索引" },
    ],
    assets: [
        { label: "全部资产", detail: "图片、视频、文本" },
        { label: "图片与视频", detail: "媒体素材" },
        { label: "文本收藏", detail: "提示词与片段" },
    ],
    config: [
        { label: "模型渠道", detail: "接口与模型" },
        { label: "生成偏好", detail: "默认输出设置" },
        { label: "同步与数据", detail: "本地与 WebDAV" },
    ],
} as const;

const studioToolIcons = {
    home: LayoutGrid,
    canvas: Box,
    image: Sparkles,
    video: Video,
    prompts: FileText,
    assets: Images,
    config: Settings2,
} as const;

export function StudioSidebar() {
    const { pathname } = useLocation();
    const studio = useThemeStore((state) => state.uiStyle === "studio");
    const toggleUiStyle = useThemeStore((state) => state.toggleUiStyle);
    const [selectedContextIndex, setSelectedContextIndex] = useState(0);
    const hideSidebar = /^\/canvas\/[^/]+/.test(pathname);
    const slug = pathname.split("/").filter(Boolean)[0];
    const activeToolSlug = navigationTools.some((tool) => tool.slug === slug) ? (slug as NavigationToolSlug) : undefined;
    const contextKey = (activeToolSlug || "home") as keyof typeof studioContextItems;

    useEffect(() => {
        setSelectedContextIndex(0);
    }, [contextKey]);

    if (!studio || hideSidebar) return null;

    const ContextIcon = studioToolIcons[contextKey];
    const selectContext = (index: number) => {
        setSelectedContextIndex(index);
        window.dispatchEvent(new CustomEvent("studio-context-select", { detail: { slug: contextKey, index } }));
    };

    return (
        <>
            <aside className="studio-module-rail hidden h-full w-[60px] shrink-0 flex-col items-center border-r border-border bg-card py-3 md:flex">
                <Link to="/" className="grid size-9 place-items-center rounded-md text-foreground" aria-label="回到工作台" title="回到工作台">
                    <span className="size-5 bg-current" style={{ mask: "url(/logo.svg) center / contain no-repeat", WebkitMask: "url(/logo.svg) center / contain no-repeat" }} />
                </Link>
                <nav className="mt-6 grid gap-1">
                    {navigationTools.map((tool) => {
                        const Icon = tool.icon;
                        const active = tool.slug === activeToolSlug;
                        return <Link key={tool.slug} to={`/${tool.slug}`} className={cn("studio-module-button group relative grid size-9 place-items-center rounded-md text-muted-foreground transition", active && "is-active")} aria-label={tool.label} aria-current={active ? "page" : undefined} title={tool.label}><Icon className="size-[17px]" /><span className="studio-module-tooltip">{tool.label}</span></Link>;
                    })}
                </nav>
                <div className="mt-auto flex flex-col items-center gap-3"><button type="button" className="grid size-9 place-items-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground" onClick={toggleUiStyle} title="切换回原版界面" aria-label="切换回原版界面"><Palette className="size-4" /></button><div className="font-mono text-[9px] text-muted-foreground [writing-mode:vertical-rl]">STUDIO</div></div>
            </aside>
            <aside className="studio-context-panel hidden h-full w-60 shrink-0 flex-col border-r border-border bg-card md:flex">
                <div className="border-b border-border px-4 py-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><ContextIcon className="size-4 text-primary" />{activeToolSlug ? navigationTools.find((tool) => tool.slug === activeToolSlug)?.label : "创作工作台"}</div>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Workspace context</div>
                </div>
                <div className="grid gap-1 p-3">
                    {studioContextItems[contextKey].map((item, index) => <button key={item.label} type="button" className={cn("studio-context-item flex min-h-14 w-full items-start gap-3 rounded-md px-3 py-2.5 text-left", index === selectedContextIndex && "is-selected")} aria-pressed={index === selectedContextIndex} onClick={() => selectContext(index)}><span className="mt-0.5 font-mono text-[10px] text-muted-foreground">0{index + 1}</span><span><strong className="block text-xs font-medium text-foreground">{item.label}</strong><small className="mt-1 block text-[11px] leading-4 text-muted-foreground">{item.detail}</small></span></button>)}
                </div>
                <div className="mt-auto border-t border-border px-4 py-3 font-mono text-[9px] tracking-wide text-muted-foreground">LOCAL-FIRST / READY</div>
            </aside>
        </>
    );
}

export function StudioMobileNav() {
    const { pathname } = useLocation();
    const studio = useThemeStore((state) => state.uiStyle === "studio");
    const hideNavigation = /^\/canvas\/[^/]+/.test(pathname);
    const slug = pathname.split("/").filter(Boolean)[0] || "home";
    const items = [
        { slug: "home", label: "工作台", icon: House, to: "/" },
        { slug: "canvas", label: "画布", icon: Box, to: "/canvas" },
        { slug: "image", label: "图像", icon: Sparkles, to: "/image" },
        { slug: "video", label: "视频", icon: Video, to: "/video" },
        { slug: "prompts", label: "提示词", icon: FileText, to: "/prompts" },
        { slug: "assets", label: "资产", icon: Images, to: "/assets" },
        { slug: "config", label: "设置", icon: Settings2, to: "/config" },
    ] as const;

    if (!studio || hideNavigation) return null;

    return <nav className="studio-mobile-nav fixed inset-x-0 bottom-0 z-50 grid h-14 grid-cols-7 border-t border-border bg-card md:hidden">{items.map((item) => { const Icon = item.icon; const active = slug === item.slug; return <Link key={item.slug} to={item.to} className={cn("grid place-items-center gap-0.5 text-[10px] text-muted-foreground", active && "text-primary")} aria-current={active ? "page" : undefined}><Icon className="size-4" /><span>{item.label}</span></Link>; })}</nav>;
}

export function AppTopNav() {
    const { pathname } = useLocation();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const autoConnectRef = useRef(false);
    const agentToken = useAgentStore((state) => state.token);
    const agentEnabled = useAgentStore((state) => state.enabled);
    const agentConnected = useAgentStore((state) => state.connected);
    const connectAgent = useAgentStore((state) => state.connectAgent);
    const togglePanel = useAgentStore((state) => state.togglePanel);
    const panelOpen = useAgentStore((state) => state.panelOpen);
    const studio = useThemeStore((state) => state.uiStyle === "studio");
    const hideHeader = /^\/canvas\/[^/]+/.test(pathname);
    const slug = pathname.split("/").filter(Boolean)[0];
    const activeToolSlug = navigationTools.some((tool) => tool.slug === slug) ? (slug as NavigationToolSlug) : undefined;

    useEffect(() => {
        if (autoConnectRef.current || agentEnabled || agentConnected || !agentToken.trim()) return;
        autoConnectRef.current = true;
        connectAgent({ silent: true });
    }, [agentConnected, agentEnabled, agentToken, connectAgent]);

    return (
        <>
            {!hideHeader ? (
                <header className={cn("studio-app-topbar sticky top-0 z-20 h-14 shrink-0 border-b border-stone-200 bg-background/90 backdrop-blur-xl dark:border-stone-800", studio && "h-12 bg-card/95") }>
                    <div className={cn("mx-auto flex h-full max-w-7xl items-stretch justify-between gap-5 px-6", studio && "max-w-none px-4")}>
                        <div className="flex min-w-0 items-center">
                            <Link to="/" className={cn("flex h-full shrink-0 items-center gap-2 text-sm font-semibold leading-none tracking-tight text-stone-950 transition hover:text-stone-600 dark:text-stone-100 dark:hover:text-stone-300", studio && "md:hidden")}>
                                <span
                                    className="size-5 shrink-0 bg-current"
                                    style={{
                                        mask: "url(/logo.svg) center / contain no-repeat",
                                        WebkitMask: "url(/logo.svg) center / contain no-repeat",
                                    }}
                                />
                                <span className="text-base font-medium">无限画布</span>
                            </Link>

                            <button
                                type="button"
                                className="ml-3 inline-flex size-8 shrink-0 items-center justify-center text-stone-600 transition hover:text-stone-950 md:hidden dark:text-stone-300 dark:hover:text-white"
                                onClick={() => setMobileNavOpen(true)}
                                aria-label="打开导航菜单"
                                title="导航菜单"
                            >
                                <Menu className="size-5" />
                            </button>

                            <nav className={cn("hide-scrollbar ml-8 hidden h-14 min-w-0 items-center gap-7 overflow-x-auto md:flex", studio && "md:hidden")}>
                                {navigationTools.map((tool) => {
                                    const Icon = tool.icon;
                                    const active = tool.slug === activeToolSlug;
                                    return (
                                        <Link
                                            key={tool.slug}
                                            to={`/${tool.slug}`}
                                            className={cn(
                                                "relative flex h-14 shrink-0 items-center gap-2 text-sm leading-6 transition after:absolute after:inset-x-0 after:bottom-0 after:h-px",
                                                active
                                                    ? "font-medium text-stone-950 after:bg-stone-950 dark:text-stone-100 dark:after:bg-stone-100"
                                                    : "text-stone-500 after:bg-transparent hover:text-stone-950 dark:text-stone-400 dark:hover:text-stone-100",
                                            )}
                                        >
                                            <Icon className="size-4" />
                                            <span className="truncate">{tool.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        <div className="my-auto flex h-9 min-w-0 items-center justify-end gap-2 justify-self-end whitespace-nowrap">
                            {studio ? <span className="mr-auto hidden font-mono text-[11px] text-muted-foreground md:block">{activeToolSlug ? `/${activeToolSlug}` : "/home"}</span> : null}
                            <Tooltip title={panelOpen ? "收起 Agent" : "打开 Agent"}>
                                <Button type="text" shape="circle" className="!h-8 !w-8 !min-w-8" icon={<Bot className="size-4" />} onClick={togglePanel} aria-label="打开 Agent" />
                            </Tooltip>
                            <UserStatusActions showConfig={!studio} />
                        </div>
                    </div>
                </header>
            ) : null}

            <MobileNavDrawer open={mobileNavOpen} activeToolSlug={activeToolSlug} onClose={() => setMobileNavOpen(false)} />
            <AppConfigModal />
        </>
    );
}
