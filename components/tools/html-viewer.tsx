"use client"

import * as React from "react"
import { Copy, RotateCcw, ArrowRightLeft } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CodeTextarea } from "@/components/ui/code-textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type Mode = "escape" | "unescape"

export function HtmlEscapeViewer() {
    const [input, setInput] = React.useState("")
    const [output, setOutput] = React.useState("")
    const [mode, setMode] = React.useState<Mode>("escape")

    const handleConvert = React.useCallback(() => {
        if (!input) {
            setOutput("")
            return
        }

        try {
            if (mode === "escape") {
                const map: Record<string, string> = {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#039;'
                };
                setOutput(input.replace(/[&<>"']/g, (m) => map[m]));
            } else {
                const doc = new DOMParser().parseFromString(input, "text/html");
                setOutput(doc.documentElement.textContent || "")
            }
        } catch (e) {
            setOutput("Error converting")
        }
    }, [input, mode])

    React.useEffect(() => {
        handleConvert()
    }, [input, handleConvert])

    const handleCopy = () => {
        if (!output) return
        navigator.clipboard.writeText(output)
        toast.success("Copied to clipboard")
    }

    const handleSwap = () => {
        setInput(output)
        setMode(mode === "escape" ? "unescape" : "escape")
    }

    return (
        <div className="flex flex-col gap-4 h-[calc(100vh-140px)] min-h-[500px]">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    HTML Escape / Unescape
                </h2>
                <div className="flex items-center gap-2">
                    <Select value={mode} onValueChange={(v) => setMode(v as Mode)}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="escape">Escape</SelectItem>
                            <SelectItem value="unescape">Unescape</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={() => setInput("")}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Clear
                    </Button>
                </div>
            </div>

            <div className="grid h-full gap-4 md:grid-cols-2 pb-4">
                {/* Input Section */}
                <div className="flex flex-col gap-2 h-full">
                    <Label htmlFor="input">{mode === "escape" ? "Unescaped HTML" : "Escaped HTML"}</Label>
                    <CodeTextarea
                        id="input"
                        placeholder={mode === "escape" ? "<h1>Hello</h1>" : "&lt;h1&gt;Hello&lt;/h1&gt;"}
                        className="h-full"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>

                {/* Output Section */}
                <div className="flex flex-col gap-2 h-full">
                    <div className="flex items-center justify-between">
                        <Label>{mode === "escape" ? "Escaped Output" : "Unescaped Output"}</Label>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={handleSwap} title="Swap inputs and mode">
                                <ArrowRightLeft className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="relative flex-1 h-full min-h-0">
                        <CodeTextarea
                            readOnly
                            placeholder="Result..."
                            className="h-full"
                            value={output}
                        />
                        {output && (
                            <Button
                                size="icon"
                                variant="ghost"
                                className="absolute top-2 right-6 z-10"
                                onClick={handleCopy}
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
