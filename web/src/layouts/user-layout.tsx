import type { ReactNode } from "react";

import { AgentPanel } from "@/components/agent/agent-panel";
import { AppTopNav, StudioMobileNav, StudioSidebar } from "@/components/layout/app-top-nav";

export default function UserLayout({ children }: { children: ReactNode }) {
    return (
        <div className="app-shell flex h-dvh overflow-hidden bg-background text-foreground">
            <StudioSidebar />
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <AppTopNav />
                <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
            </div>
            <AgentPanel />
            <StudioMobileNav />
        </div>
    );
}
