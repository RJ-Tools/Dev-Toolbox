"use client"

import * as React from "react"
import { format, fromUnixTime, getUnixTime, isValid, parse, set } from "date-fns"
import { Clock, RotateCcw, Copy, Calendar as CalendarIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export function TimestampViewer() {
    // State for "Timestamp to Date"
    const [tsInput, setTsInput] = React.useState<string>(() => getUnixTime(new Date()).toString())
    const [tsDate, setTsDate] = React.useState<Date | null>(new Date())

    // State for "Date to Timestamp"
    const [dateInput, setDateInput] = React.useState({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
        hour: new Date().getHours(),
        minute: new Date().getMinutes(),
        second: new Date().getSeconds(),
        tz: "local"
    })
    const [generatedTs, setGeneratedTs] = React.useState<number>(0)

    // Effect for Timestamp -> Date
    React.useEffect(() => {
        if (!tsInput.trim()) {
            setTsDate(null)
            return
        }
        const val = tsInput.trim()
        if (/^\d+$/.test(val)) {
            let num = parseInt(val, 10)
            // Rough heuristic for millis vs seconds:
            // Unlikely to be dealing with seconds < 10000000000 (year 2286) if length is huge.
            // BUT timestamp-converter.com usually assumes seconds unless specified or obvious.
            // Let's assume seconds if < 100000000000, else millis.
            // Actually, standard unix timestamp is seconds.
            // Let's treat as seconds unless it looks like millis (13 digits).
            if (val.length >= 13) {
                setTsDate(new Date(num))
            } else {
                setTsDate(fromUnixTime(num))
            }
        } else {
            setTsDate(null)
        }
    }, [tsInput])

    // Effect for Date -> Timestamp
    React.useEffect(() => {
        try {
            // Construct date
            // Native Date constructor treats 0-99 years as 1900-1999, so be careful? No, new Date(y, m, d) works.
            // Month is 0-indexed in JS Date, but input is 1-indexed.
            const d = new Date(
                dateInput.year,
                dateInput.month - 1,
                dateInput.day,
                dateInput.hour,
                dateInput.minute,
                dateInput.second
            )

            if (isValid(d)) {
                setGeneratedTs(getUnixTime(d))
            }
        } catch (e) {
            // invalid
        }
    }, [dateInput])

    const handleNow = () => {
        const now = new Date()
        setTsInput(getUnixTime(now).toString())
        setDateInput({
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate(),
            hour: now.getHours(),
            minute: now.getMinutes(),
            second: now.getSeconds(),
            tz: "local"
        })
        toast.info("Reset to current time")
    }

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text)
        toast.success(`Copied ${label}`)
    }

    // Helper to standard format
    const fmt = (d: Date | null, f: string) => {
        if (!d || !isValid(d)) return "Invalid Date"
        try {
            if (f === "iso") return d.toISOString()
            if (f === "utc") return d.toUTCString()
            if (f === "local") return d.toString()
            if (f === "relative") {
                // Simple relative time
                const now = new Date()
                const diff = Math.floor((now.getTime() - d.getTime()) / 1000)
                if (diff < 60) return `${diff} seconds ago`
                if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
                if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
                return `${Math.floor(diff / 86400)} days ago`
            }
            if (f === "rfc2822") return d.toUTCString() // Usually same as UTC string
            return format(d, f)
        } catch (e) { return "Error" }
    }

    return (
        <div className="flex flex-col gap-6 max-w-5xl mx-auto h-[calc(100vh-140px)] overflow-y-auto pb-8">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Clock className="w-6 h-6" />
                    Timestamp Converter
                </h2>
                <Button variant="outline" onClick={handleNow}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset to Now
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* LEFT: Timestamp to Date */}
                <Card className="flex flex-col">
                    <CardHeader className="bg-muted/40 pb-4">
                        <CardTitle className="text-lg">Timestamp to Date</CardTitle>
                        <CardDescription>Convert Epoch to Human Date</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6 flex-1">
                        <div className="space-y-2">
                            <Label>Unix Timestamp</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={tsInput}
                                    onChange={(e) => setTsInput(e.target.value)}
                                    className="font-mono text-lg"
                                    placeholder="e.g. 1672531200"
                                />
                                <Button variant="outline" size="icon" onClick={() => copyToClipboard(tsInput, "Timestamp")}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">Supports seconds (10 digits) and milliseconds (13 digits)</p>
                        </div>

                        {tsDate && isValid(tsDate) && (
                            <div className="space-y-4 pt-4 border-t">
                                <div className="grid gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground">GMT / UTC</Label>
                                        <div className="flex gap-2 items-center">
                                            <code className="font-mono bg-muted px-2 py-1 rounded flex-1">{fmt(tsDate, "utc")}</code>
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(fmt(tsDate, "utc"), "UTC")}>
                                                <Copy className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground">Your Local Time Zone</Label>
                                        <div className="flex gap-2 items-center">
                                            <code className="font-mono bg-muted px-2 py-1 rounded flex-1">{fmt(tsDate, "local")}</code>
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(fmt(tsDate, "local"), "Local")}>
                                                <Copy className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground">ISO 8601</Label>
                                        <div className="flex gap-2 items-center">
                                            <code className="font-mono bg-muted px-2 py-1 rounded flex-1">{fmt(tsDate, "iso")}</code>
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(fmt(tsDate, "iso"), "ISO")}>
                                                <Copy className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground">Relative</Label>
                                        <div className="flex gap-2 items-center">
                                            <code className="font-mono bg-muted px-2 py-1 rounded flex-1">{fmt(tsDate, "relative")}</code>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* RIGHT: Date to Timestamp */}
                <Card className="flex flex-col">
                    <CardHeader className="bg-muted/40 pb-4">
                        <CardTitle className="text-lg">Date to Timestamp</CardTitle>
                        <CardDescription>Convert Human Date to Epoch</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6 flex-1">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Year</Label>
                                <Input
                                    type="number"
                                    value={dateInput.year}
                                    onChange={(e) => setDateInput({ ...dateInput, year: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Month</Label>
                                <Input
                                    type="number"
                                    min={1} max={12}
                                    value={dateInput.month}
                                    onChange={(e) => setDateInput({ ...dateInput, month: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Day</Label>
                                <Input
                                    type="number"
                                    min={1} max={31}
                                    value={dateInput.day}
                                    onChange={(e) => setDateInput({ ...dateInput, day: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Hour (24h)</Label>
                                <Input
                                    type="number"
                                    min={0} max={23}
                                    value={dateInput.hour}
                                    onChange={(e) => setDateInput({ ...dateInput, hour: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Minute</Label>
                                <Input
                                    type="number"
                                    min={0} max={59}
                                    value={dateInput.minute}
                                    onChange={(e) => setDateInput({ ...dateInput, minute: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Second</Label>
                                <Input
                                    type="number"
                                    min={0} max={59}
                                    value={dateInput.second}
                                    onChange={(e) => setDateInput({ ...dateInput, second: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t">
                            <div className="space-y-2">
                                <Label>Result: Unix Timestamp (Seconds)</Label>
                                <div className="flex gap-2">
                                    <Input
                                        readOnly
                                        value={generatedTs}
                                        className="font-mono text-lg bg-muted/50"
                                    />
                                    <Button size="icon" onClick={() => copyToClipboard(generatedTs.toString(), "Timestamp")}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2 pt-4">
                                <Label>Result: Unix Timestamp (Milliseconds)</Label>
                                <div className="flex gap-2">
                                    <Input
                                        readOnly
                                        value={generatedTs * 1000}
                                        className="font-mono text-lg bg-muted/50"
                                    />
                                    <Button size="icon" onClick={() => copyToClipboard((generatedTs * 1000).toString(), "Timestamp (ms)")}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
