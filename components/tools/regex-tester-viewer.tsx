"use client"

import * as React from "react"
import { AlertCircle, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

export function RegexTesterViewer() {
    const [pattern, setPattern] = React.useState("[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}")
    const [flags, setFlags] = React.useState({
        g: true, // global
        i: true, // case insensitive
        m: false, // multiline
        s: false, // dotAll
        u: false, // unicode
        y: false, // sticky
    })
    const [text, setText] = React.useState("Contact us at support@example.com or sales@example.org")
    const [matches, setMatches] = React.useState<any[]>([])
    const [error, setError] = React.useState("")

    React.useEffect(() => {
        if (!pattern) {
            setMatches([])
            setError("")
            return
        }

        try {
            const activeFlags = Object.entries(flags)
                .filter(([_, active]) => active)
                .map(([flag]) => flag)
                .join("")

            const regex = new RegExp(pattern, activeFlags)
            const newMatches = []

            if (activeFlags.includes("g")) {
                let match
                while ((match = regex.exec(text)) !== null) {
                    newMatches.push(match)
                }
            } else {
                const match = regex.exec(text)
                if (match) newMatches.push(match)
            }

            setMatches(newMatches)
            setError("")
        } catch (err: any) {
            setError(err.message)
            setMatches([])
        }
    }, [pattern, flags, text])

    const toggleFlag = (flag: keyof typeof flags) => {
        setFlags(prev => ({ ...prev, [flag]: !prev[flag] }))
    }

    const highlightMatches = () => {
        if (!matches.length || error) return text

        let lastIndex = 0
        const parts = []

        // Sort matches by index just in case
        const sortedMatches = [...matches].sort((a, b) => a.index - b.index)

        sortedMatches.forEach((match, i) => {
            // Text before match
            if (match.index > lastIndex) {
                parts.push(text.substring(lastIndex, match.index))
            }

            // Match itself
            parts.push(
                <span key={i} className="bg-yellow-200 dark:bg-yellow-900 rounded-sm px-0.5 box-decoration-clone">
                    {match[0]}
                </span>
            )

            lastIndex = match.index + match[0].length
        })

        if (lastIndex < text.length) {
            parts.push(text.substring(lastIndex))
        }

        return parts
    }

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardContent className="p-6 flex flex-col gap-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex-1 space-y-2">
                                <Label>Regex Pattern</Label>
                                <div className="flex items-center gap-2 font-mono text-lg bg-muted p-2 rounded-md border">
                                    <span className="text-muted-foreground">/</span>
                                    <Input
                                        value={pattern}
                                        onChange={(e) => setPattern(e.target.value)}
                                        className="border-none shadow-none focus-visible:ring-0 px-0 bg-transparent h-auto"
                                        placeholder="Enter pattern..."
                                    />
                                    <span className="text-muted-foreground flex-shrink-0">/ {Object.entries(flags).filter(f => f[1]).map(f => f[0]).join("")}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="g" checked={flags.g} onCheckedChange={() => toggleFlag("g")} />
                                <Label htmlFor="g">Global (g)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="i" checked={flags.i} onCheckedChange={() => toggleFlag("i")} />
                                <Label htmlFor="i">Case Insensitive (i)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="m" checked={flags.m} onCheckedChange={() => toggleFlag("m")} />
                                <Label htmlFor="m">Multiline (m)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="s" checked={flags.s} onCheckedChange={() => toggleFlag("s")} />
                                <Label htmlFor="s">Dot All (s)</Label>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="text-destructive text-sm flex items-center gap-2 bg-destructive/10 p-3 rounded-md">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-2 flex flex-col h-full">
                            <Label>Test String</Label>
                            <Textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="font-mono min-h-[300px] text-base resize-none"
                                placeholder="Enter text to test against..."
                            />
                        </div>

                        <div className="space-y-2 flex flex-col h-full">
                            <div className="flex justify-between items-center">
                                <Label>Match Preview</Label>
                                <span className="text-xs text-muted-foreground">
                                    {matches.length} match{matches.length !== 1 && "es"} found
                                </span>
                            </div>
                            <div className="rounded-md border bg-background p-4 font-mono text-base min-h-[300px] whitespace-pre-wrap break-all">
                                {highlightMatches()}
                            </div>
                        </div>
                    </div>

                    {matches.length > 0 && (
                        <div className="mt-4">
                            <Label>Match Details</Label>
                            <div className="mt-2 space-y-2 max-h-[200px] overflow-y-auto rounded-md border p-2">
                                {matches.map((match, i) => (
                                    <div key={i} className="text-sm font-mono p-2 hover:bg-muted rounded-md flex gap-4">
                                        <span className="text-muted-foreground w-8">#{i + 1}</span>
                                        <span className="font-bold">{match[0]}</span>
                                        <span className="text-muted-foreground">index: {match.index}</span>
                                        {match.length > 1 && (
                                            <span className="text-muted-foreground">
                                                groups: [{match.slice(1).map((g: string) => `"${g}"`).join(", ")}]
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
