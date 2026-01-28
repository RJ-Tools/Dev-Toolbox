"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"

export interface CodeTextareaProps extends React.ComponentProps<"textarea"> {
    value: string
}

export function CodeTextarea({ className, value, onChange, ...props }: CodeTextareaProps) {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)
    const lineNumbersRef = React.useRef<HTMLDivElement>(null)

    const lineCount = React.useMemo(() => {
        return value.split("\n").length
    }, [value])

    const handleScroll = () => {
        if (textareaRef.current && lineNumbersRef.current) {
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop
        }
    }

    return (
        <div className={cn("relative flex h-full border rounded-md overflow-hidden bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2", className)}>
            {/* Line Numbers */}
            <div
                ref={lineNumbersRef}
                className="flex-shrink-0 flex flex-col text-right select-none bg-muted/30 border-r text-muted-foreground font-mono text-sm p-3 overflow-hidden pointer-events-none w-[2.5rem]"
                aria-hidden="true"
            >
                {Array.from({ length: lineCount }).map((_, i) => (
                    <div key={i} className="leading-5 h-5">{i + 1}</div>
                ))}
            </div>

            {/* Textarea */}
            {/* We strip standard borders from Textarea as the wrapper handles it */}
            <Textarea
                ref={textareaRef}
                value={value}
                onChange={onChange}
                onScroll={handleScroll}
                className="flex-1 border-0 rounded-none focus-visible:ring-0 shadow-none resize-none p-3 font-mono text-sm leading-5"
                wrap="off" // Optional: prevents wrapping for strict line match
                {...props}
            />
        </div>
    )
}
