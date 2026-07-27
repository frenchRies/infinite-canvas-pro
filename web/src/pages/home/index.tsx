import { ArrowRight, Box, FileText, ImagePlus, Video } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { App, Button, Image, Tag } from "antd";
import { useNavigate } from "react-router-dom";

import { fetchPrompts, type Prompt } from "@/services/api/prompts";
import { navigationTools } from "@/constant/navigation-tools";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/stores/use-theme-store";

function Highlighter({ action, color, children }: { action: "highlight" | "underline"; color: string; children: ReactNode }) {
    return (
        <span className="relative inline-block px-1">
            {action === "highlight" ? (
                <span className="absolute inset-x-0 bottom-0 top-1 rounded-sm opacity-45" style={{ backgroundColor: color }} />
            ) : (
                <span className="absolute inset-x-0 bottom-0 h-1 rounded-full opacity-80" style={{ backgroundColor: color }} />
            )}
            <span className="relative font-medium text-stone-800 dark:text-stone-200">{children}</span>
        </span>
    );
}

export default function IndexPage() {
    const { message } = App.useApp();
    const navigate = useNavigate();
    const [primaryTool] = navigationTools;
    const [promptShowcase, setPromptShowcase] = useState<Prompt[]>([]);
    const [previewIndex, setPreviewIndex] = useState(0);
    const [previewOpen, setPreviewOpen] = useState(false);
    const studio = useThemeStore((state) => state.uiStyle === "studio");

    useEffect(() => {
        void fetchPrompts({ pageSize: 12 })
            .then((data) => setPromptShowcase(data.items))
            .catch((error) => message.error(error instanceof Error ? error.message : "获取提示词失败"));
    }, [message]);

    if (studio) return <StudioHome promptShowcase={promptShowcase} onNavigate={navigate} onPreview={(index) => { setPreviewIndex(index); setPreviewOpen(true); }} previewOpen={previewOpen} previewIndex={previewIndex} onPreviewOpenChange={setPreviewOpen} onPreviewChange={setPreviewIndex} />;

    return (
        <main className="relative h-full overflow-y-auto bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] text-stone-950 dark:bg-[radial-gradient(rgba(245,245,244,.18)_1px,transparent_1px)] dark:text-stone-100">
            <section className={cn("relative mx-auto min-h-[calc(100vh-4rem)] max-w-7xl overflow-hidden px-6", studio && "max-w-none px-5 py-5")}>
                {!studio ? <div className="pointer-events-none absolute left-[15%] top-24 size-20 rounded-full border border-dashed border-stone-200 dark:border-stone-800" /> : null}
                {!studio ? <div className="pointer-events-none absolute right-[23%] top-[48%] size-20 rounded-full border border-dashed border-stone-200 dark:border-stone-800" /> : null}

                <div className={cn("relative flex min-h-[620px] flex-col items-center justify-center pt-10 text-center", studio && "min-h-0 items-stretch justify-start border-b border-border px-1 pb-7 pt-3 text-left")}>
                    <div className={cn(studio && "flex flex-wrap items-end justify-between gap-5")}>
                        <div>
                            {studio ? <p className="mb-2 font-mono text-xs text-muted-foreground">CREATIVE DESK / READY</p> : null}
                            <h1 className={cn("ai-title-aurora max-w-5xl text-balance text-5xl font-semibold tracking-normal sm:text-7xl lg:text-8xl", studio && "text-3xl sm:text-4xl lg:text-4xl")}>{studio ? "创作工作台" : "无限画布"}</h1>
                            <p className={cn("mt-8 max-w-3xl text-balance text-lg leading-8 text-stone-500 dark:text-stone-400", studio && "mt-3 max-w-xl text-sm leading-6 text-muted-foreground")}>
                        在
                        <Highlighter action="underline" color="#FF9800">
                            无限画布
                        </Highlighter>
                        中生成、连接和重组
                        <Highlighter action="highlight" color="#87CEFA">
                            图片、文字与图形
                        </Highlighter>
                        ，让创作从单次生成变成连续推演。
                            </p>
                        </div>
                        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                        <Button type="primary" size="large" onClick={() => navigate(`/${primaryTool.slug}`)} icon={<ArrowRight className="size-4" />} iconPlacement="end">
                            开始使用
                        </Button>
                        <Button size="large" onClick={() => navigate("/canvas")}>
                            打开画布
                        </Button>
                        </div>
                    </div>
                    {studio ? (
                        <div className="mt-7 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
                            {navigationTools.map((tool, index) => {
                                const Icon = tool.icon;
                                return <button key={tool.slug} type="button" onClick={() => navigate(`/${tool.slug}`)} className="group flex min-h-24 items-start gap-3 bg-card p-4 text-left transition hover:bg-accent"><Icon className="mt-0.5 size-4 text-muted-foreground transition group-hover:text-primary" /><span><strong className="block text-sm font-medium">{tool.label}</strong><small className="mt-2 block font-mono text-[10px] text-muted-foreground">0{index + 1} / OPEN</small></span></button>;
                            })}
                        </div>
                    ) : null}
                </div>

                <section className={cn("relative mx-auto mb-20 max-w-6xl border-t border-stone-200 pt-12 dark:border-stone-800", studio && "max-w-none border-t-0 pt-7")}>
                    <div className="mb-8 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-start">
                        <div />
                        <div className="max-w-2xl text-center">
                            <h2 className="text-3xl font-semibold text-stone-950 dark:text-stone-100">沉淀每一次好结果</h2>
                            <p className="mt-3 text-base leading-7 text-stone-500 dark:text-stone-400">收藏稳定出图的提示词、参考风格和结果图片，让下一次创作从已有经验开始。</p>
                        </div>
                        <Button type="link" onClick={() => navigate("/prompts")} className="justify-self-center md:justify-self-end" icon={<ArrowRight className="size-4" />} iconPlacement="end">
                            查看提示词库
                        </Button>
                    </div>
                    <div className="grid auto-rows-[210px] gap-4 md:grid-cols-4">
                        {promptShowcase.map((item, index) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                    setPreviewIndex(index);
                                    setPreviewOpen(true);
                                }}
                                className={cn(
                                    "group relative cursor-pointer overflow-hidden border border-stone-200 bg-stone-100 text-left dark:border-stone-800 dark:bg-stone-900",
                                    index === 0 && "md:col-span-2 md:row-span-2",
                                    index === 3 && "md:col-span-2",
                                )}
                            >
                                <img src={item.coverUrl} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent p-4 text-white">
                                    <div className="mb-2 flex flex-wrap gap-1.5">
                                        {item.tags.slice(0, 2).map((tag) => (
                                            <Tag key={tag} variant="filled" className="m-0 bg-white/15 text-[11px] text-white backdrop-blur">
                                                {tag}
                                            </Tag>
                                        ))}
                                    </div>
                                    <h3 className="text-sm font-medium">{item.title}</h3>
                                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/75">{item.prompt}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>
            </section>
            <Image.PreviewGroup
                preview={{
                    open: previewOpen,
                    current: previewIndex,
                    onOpenChange: setPreviewOpen,
                    onChange: setPreviewIndex,
                }}
            >
                <div className="hidden">
                    {promptShowcase.map((item) => (
                        <Image key={item.id} src={item.coverUrl} alt={item.title} />
                    ))}
                </div>
            </Image.PreviewGroup>
        </main>
    );
}

function StudioHome({ promptShowcase, onNavigate, onPreview, previewOpen, previewIndex, onPreviewOpenChange, onPreviewChange }: { promptShowcase: Prompt[]; onNavigate: (to: string) => void; onPreview: (index: number) => void; previewOpen: boolean; previewIndex: number; onPreviewOpenChange: (open: boolean) => void; onPreviewChange: (index: number) => void }) {
    const quickActions = [
        { label: "新建画布", detail: "从一张空白画布开始", to: "/canvas?mode=new", icon: Box, key: "⌘ 1" },
        { label: "生成图片", detail: "创建一组新的视觉结果", to: "/image", icon: ImagePlus, key: "⌘ 2" },
        { label: "生成视频", detail: "编排镜头与动态素材", to: "/video", icon: Video, key: "⌘ 3" },
    ];

    useEffect(() => {
        const handleStudioContext = (event: Event) => {
            const detail = (event as CustomEvent<{ slug?: string; index?: number }>).detail;
            if (detail.slug !== "home") return;
            if (detail.index === 2) {
                onNavigate("/canvas");
                return;
            }
            const targetId = detail.index === 1 ? "home-quick-create" : "home-recent-work";
            document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
        };
        window.addEventListener("studio-context-select", handleStudioContext);
        return () => window.removeEventListener("studio-context-select", handleStudioContext);
    }, [onNavigate]);

    return (
        <main className="studio-home h-full overflow-y-auto bg-background text-foreground">
            <div className="mx-auto max-w-[1440px] px-7 py-8">
                <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-7">
                    <div>
                        <div className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground">HOME / TODAY</div>
                        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">继续你的创作</h1>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">从最近的画布、生成任务或收藏提示词继续，不必重新寻找上下文。</p>
                    </div>
                    <button type="button" className="flex items-center gap-2 text-xs text-muted-foreground transition hover:text-foreground" onClick={() => onNavigate("/config")}><span className="font-mono">⌘ ,</span><span>工作区设置</span></button>
                </div>

                <section id="home-quick-create" className="mt-7">
                    <div className="mb-3 flex items-center justify-between"><h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">快速创建</h2><span className="font-mono text-[10px] text-muted-foreground">START NEW</span></div>
                    <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">
                        {quickActions.map(({ label, detail, to, icon: Icon, key }) => <button key={to} type="button" onClick={() => onNavigate(to)} className="group flex min-h-28 items-start justify-between bg-card p-5 text-left transition hover:bg-accent"><span className="flex gap-3"><Icon className="mt-0.5 size-5 text-primary" /><span><strong className="block text-sm font-medium text-foreground">{label}</strong><small className="mt-2 block text-xs text-muted-foreground">{detail}</small></span></span><span className="font-mono text-[10px] text-muted-foreground transition group-hover:text-primary">{key}</span></button>)}
                    </div>
                </section>

                <div className="mt-9 grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,.65fr)]">
                    <section id="home-recent-work">
                        <div className="mb-3 flex items-center justify-between"><h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">最近灵感</h2><button type="button" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground" onClick={() => onNavigate("/prompts")}>查看提示词库 <ArrowRight className="size-3.5" /></button></div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {promptShowcase.slice(0, 4).map((item, index) => <button key={item.id} type="button" onClick={() => onPreview(index)} className="group flex min-h-24 gap-3 rounded-md border border-border bg-card p-2 text-left transition hover:border-primary/60 hover:bg-accent"><div className="size-20 shrink-0 overflow-hidden rounded-sm bg-muted">{item.coverUrl ? <img src={item.coverUrl} alt={item.title} className="size-full object-cover transition duration-300 group-hover:scale-105" /> : <FileText className="m-6 size-8 text-muted-foreground" />}</div><span className="min-w-0 py-1"><strong className="block truncate text-sm font-medium text-foreground">{item.title}</strong><small className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">{item.description || item.prompt}</small></span></button>)}
                        </div>
                    </section>
                    <section>
                        <div className="mb-3 flex items-center justify-between"><h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">工作区状态</h2><span className="size-2 rounded-full bg-primary" title="本地工作区正常" /></div>
                        <div className="rounded-md border border-border bg-card p-5"><div className="flex items-center justify-between border-b border-border pb-4"><span className="text-sm text-foreground">本地工作区</span><span className="font-mono text-[10px] text-primary">READY</span></div><div className="grid grid-cols-2 gap-4 pt-4"><div><div className="font-mono text-2xl text-foreground">{promptShowcase.length || 0}</div><div className="mt-1 text-xs text-muted-foreground">最近提示词</div></div><div><div className="font-mono text-2xl text-foreground">{new Date().toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" })}</div><div className="mt-1 text-xs text-muted-foreground">本地日期</div></div></div><button type="button" onClick={() => onNavigate("/assets")} className="mt-6 flex w-full items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground hover:text-foreground"><span>打开我的资产</span><ArrowRight className="size-3.5" /></button></div>
                    </section>
                </div>
            </div>
            <Image.PreviewGroup preview={{ open: previewOpen, current: previewIndex, onOpenChange: onPreviewOpenChange, onChange: onPreviewChange }}><div className="hidden">{promptShowcase.map((item) => <Image key={item.id} src={item.coverUrl} alt={item.title} />)}</div></Image.PreviewGroup>
        </main>
    );
}
