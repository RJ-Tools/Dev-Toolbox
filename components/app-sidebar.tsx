"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button" // Removed unused import if not used, but likely needed.
import { FileDiff, FileCode, CheckCircle, Clock, Home, ChevronLeft, ChevronRight, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

const items = [
    {
        title: "Home",
        url: "/",
        icon: Home,
    },
    {
        title: "Diff Checker",
        url: "/tools/diff",
        icon: FileDiff,
    },
    {
        title: "Formatter",
        url: "/tools/formatter",
        icon: FileCode,
    },
    {
        title: "Validator",
        url: "/tools/validator",
        icon: CheckCircle,
    },
    {
        title: "Time Converter",
        url: "/tools/timestamp",
        icon: Clock,
    },
]

export function AppSidebar() {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = React.useState(false)

    return (
        <div
            className={cn(
                "hidden border-r bg-muted/40 md:flex flex-col transition-all duration-300 ease-in-out h-screen sticky top-0",
                collapsed ? "w-[60px]" : "w-64"
            )}
        >
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px]">
                <Link href="/" className={cn("flex items-center gap-2 font-semibold overflow-hidden", collapsed && "justify-center px-0")}>
                    {collapsed ? <span className="text-xl">DT</span> : <span>DevTools</span>}
                </Link>
            </div>

            <div className="flex-1 flex flex-col justify-between overflow-hidden">
                <nav className="grid items-start px-2 text-sm font-medium lg:px-2 pt-4 gap-1">
                    {items.map((item) => (
                        <Link
                            key={item.url}
                            href={item.url}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                pathname === item.url || (pathname.startsWith(item.url) && item.url !== "/")
                                    ? "bg-muted text-primary"
                                    : "text-muted-foreground",
                                collapsed && "justify-center px-2"
                            )}
                            title={collapsed ? item.title : undefined}
                        >
                            <item.icon className="h-4 w-4 shrink-0" />
                            {!collapsed && <span>{item.title}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="h-[60px] flex items-center justify-center border-t px-2">
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
