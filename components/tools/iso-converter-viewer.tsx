"use client"

import * as React from "react"
import { Activity, Copy, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import { formatISO, parseISO } from "date-fns"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { CodeTextarea } from "@/components/ui/code-textarea"

export function IsoConverterViewer() {
    const [input, setInput] = React.useState(new Date().toISOString())
    const [parsed, setParsed] = React.useState<Date | null>(new Date())
    const [error, setError] = React.useState("")

    const handleConvert = React.useCallback(() => {
        if (!input) {
            setParsed(null)
            setError("")
            return
        }
        try {
            // Try lenient parsing
            const date = new Date(input)
            if (isNaN(date.getTime())) throw new Error("Invalid Date")
            setParsed(date)
            setError("")
        } catch (e) {
            setParsed(null)
            setError("Invalid Date Format")
        }
    }, [input])

    React.useEffect(() => {
        handleConvert()
    }, [input, handleConvert])

    const handleCopy = (text: string) => {
        if (!text) return
        navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard")
    }

    const formats = parsed ? [
        { label: "ISO 8601 (Basic)", value: formatISO(parsed, { format: 'basic' }) },
        { label: "ISO 8601 (Extended)", value: formatISO(parsed, { format: 'extended' }) },
        { label: "UTC String", value: parsed.toUTCString() },
        { label: "Local String", value: parsed.toString() },
        { label: "JSON", value: parsed.toJSON() },
    ] : []

    return (
        <div className="flex flex-col gap-6 max-w-3xl mx-auto h-[calc(100vh-140px)] min-h-[500px]">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Activity className="w-6 h-6" />
                    ISO 8601 Converter
                </h2>
                <Button variant="outline" onClick={() => setInput(new Date().toISOString())}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset to Now
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 h-full">
                <Card className="h-full flex flex-col">
                    <CardContent className="p-4 flex flex-col gap-4 flex-1">
                        <Label>Input Date String</Label>
                        <CodeTextarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="e.g. 2023-01-01T12:00:00Z or Today"
                            className="flex-1"
                        />
                        {error && (
                            <div className="text-red-500 text-sm font-medium">
                                {error}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="h-full flex flex-col overflow-hidden">
                    <CardContent className="p-0 flex flex-col h-full overflow-y-auto divide-y">
                        {parsed ? (
                            formats.map((f, i) => (
                                <div key={i} className="p-4 flex flex-col gap-2 hover:bg-muted/50">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs text-muted-foreground uppercase tracking-wider">{f.label}</Label>
                                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleCopy(f.value)}>
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <div className="font-mono text-sm break-all">
                                        {f.value}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground p-8 text-center">
                                {error ? "Invalid Input" : "Enter a date..."}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
