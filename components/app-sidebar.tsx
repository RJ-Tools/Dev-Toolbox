"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button" // Removed unused import if not used, but likely needed.
import { FileDiff, FileCode, CheckCircle, Clock, Home, ChevronLeft, ChevronRight, Settings, ArrowRightLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { toolsConfig } from "@/lib/tools-config"

export function AppSidebar() {
    const pathname = usePathname()
    // Initialize separately to avoid hydration mismatch
    const [collapsed, setCollapsed] = React.useState(false)
    const [openItem, setOpenItem] = React.useState<string | undefined>("")

    // Retrieve collapsed state from local storage on mount
    React.useEffect(() => {
        const saved = localStorage.getItem("sidebar-collapsed")
        if (saved) setCollapsed(JSON.parse(saved))
    }, [])

    // Update local storage when collapsed changes
    React.useEffect(() => {
        localStorage.setItem("sidebar-collapsed", JSON.stringify(collapsed))
    }, [collapsed])


    return (
        <div
            className={cn(
                "hidden border-r bg-muted/20 md:flex flex-col transition-all duration-300 ease-in-out h-screen sticky top-0",
                collapsed ? "w-[60px]" : "w-72"
            )}
        >
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] shrink-0">
                <Link href="/" className={cn("flex items-center gap-2 font-semibold overflow-hidden whitespace-nowrap", collapsed && "justify-center px-0")}>
                    {collapsed ? <span className="text-xl font-bold bg-primary text-primary-foreground h-8 w-8 flex items-center justify-center rounded-lg">DT</span> :
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold bg-primary text-primary-foreground h-8 w-8 flex items-center justify-center rounded-lg">DT</span>
                            <span>DevToolbox</span>
                        </div>}
                </Link>
            </div>

            <div className="flex-1 flex flex-col justify-between overflow-hidden">
                {/* Scrollable Nav Area */}
                <div className="flex-1 overflow-y-auto py-4 px-3">
                    {/* Home Link - Always visible at top */}
                    <Link
                        href="/"
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all mb-2",
                            pathname === "/" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                            collapsed && "justify-center px-2"
                        )}
                        title="Home"
                    >
                        <Home className="h-4 w-4 shrink-0" />
                        {!collapsed && <span className="text-sm font-medium">Dashboard</span>}
                    </Link>

                    {!collapsed ? (
                        <Accordion type="single" collapsible className="w-full" value={openItem} onValueChange={setOpenItem}>
                            {toolsConfig.map((category) => (
                                <AccordionItem key={category.id} value={category.id} className="border-none">
                                    <AccordionTrigger className="py-2 hover:no-underline hover:bg-muted/50 rounded-lg px-3 mb-1 text-muted-foreground data-[state=open]:text-foreground data-[state=open]:bg-muted/50">
                                        <div className="flex items-center gap-3 text-sm font-normal">
                                            <category.icon className="h-4 w-4 shrink-0" />
                                            <span>{category.name}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-1">
                                        <div className="flex flex-col gap-0.5 pl-9">
                                            {category.tools.map(tool => (
                                                <Link
                                                    key={tool.id}
                                                    href={tool.href || `/tools/${tool.slug}`}
                                                    className={cn(
                                                        "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors hover:text-foreground",
                                                        pathname === (tool.href || `/tools/${tool.slug}`) ? "bg-secondary text-foreground font-medium" : "text-muted-foreground hover:bg-muted/50"
                                                    )}
                                                >
                                                    <tool.icon className="h-3.5 w-3.5 opacity-70" />
                                                    {tool.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    ) : (
                        <div className="flex flex-col gap-2 relative z-50">
                            {/* Icons Only View */}
                            {toolsConfig.map((category) => (
                                <div key={category.id} className="group relative flex justify-center">
                                    <div
                                        className={cn(
                                            "flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-muted hover:text-foreground cursor-pointer text-muted-foreground",
                                            // Highlight if any child interacts? Difficult in pure CSS/simple JS without context. 
                                            // Simple hover effect is enough for now.
                                        )}
                                    >
                                        <category.icon className="h-4 w-4" />
                                    </div>
                                    {/* Tooltip-like popup on hover for collapsed state */}
                                    <div className="absolute left-10 top-0 hidden w-48 rounded-md border bg-popover text-popover-foreground shadow-md group-hover:block p-2 z-50 ml-2">
                                        <div className="font-medium text-xs mb-2 px-2 text-muted-foreground">{category.name}</div>
                                        <div className="flex flex-col gap-1">
                                            {category.tools.map(tool => (
                                                <Link
                                                    key={tool.id}
                                                    href={tool.href || `/tools/${tool.slug}`}
                                                    className="flex items-center gap-2 rounded-sm px-2 py-1 text-xs hover:bg-muted"
                                                >
                                                    <tool.icon className="h-3 w-3 opacity-70" />
                                                    {tool.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>

                {/* Footer / Collapse Button */}
                <div className="h-[60px] flex items-center justify-center border-t px-2 shrink-0 bg-background/50 backdrop-blur">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("w-full flex items-center justify-center hover:bg-muted", collapsed ? "h-9 w-9" : "h-9 w-full")}
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        {collapsed ? <ChevronRight className="h-4 w-4" /> : (
                            <div className="flex items-center gap-2 w-full px-2">
                                <ChevronLeft className="h-4 w-4" />
                                <span>Collapse</span>
                            </div>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
