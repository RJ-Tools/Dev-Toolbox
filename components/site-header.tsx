"use client"

import Link from "next/link"
import { Menu, Home, FileDiff, FileCode, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
    return (
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col">
                    <SheetTitle>Menu</SheetTitle>
                    <nav className="grid gap-2 text-lg font-medium">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-lg font-semibold"
                        >
                            <span className="sr-only">DevTools</span>
                        </Link>
                        <Link
                            href="/"
                            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-foreground hover:text-foreground"
                        >
                            <Home className="h-5 w-5" />
                            Home
                        </Link>
                        <Link
                            href="/tools/diff"
                            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                        >
                            <FileDiff className="h-5 w-5" />
                            Diff Checker
                        </Link>
                        <Link
                            href="/tools/formatter"
                            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                        >
                            <FileCode className="h-5 w-5" />
                            Formatter
                        </Link>
                        <Link
                            href="/tools/validator"
                            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                        >
                            <CheckCircle className="h-5 w-5" />
                            Validator
                        </Link>
                        <Link
                            href="/tools/timestamp"
                            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                        >
                            <Clock className="h-5 w-5" />
                            Time Converter
                        </Link>
                    </nav>
                </SheetContent>
            </Sheet>
            <div className="w-full flex-1">
                {/* Search bar could go here */}
            </div>
            <ThemeToggle />
        </header>
    )
}
