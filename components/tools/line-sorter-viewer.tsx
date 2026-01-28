"use client"

import * as React from "react"
import { ArrowDownAZ, ArrowUpAZ, Shuffle, Files, X, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

export function LineSorterViewer() {
    const [text, setText] = React.useState("")
    const [reverse, setReverse] = React.useState(false) // Used for sort direction

    const process = (action: string) => {
        if (!text) return

        let lines = text.split("\n")

        switch (action) {
            case "sort":
                lines.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
                if (reverse) lines.reverse()
                break
            case "reverse":
                lines.reverse()
                break
            case "shuffle":
                for (let i = lines.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [lines[i], lines[j]] = [lines[j], lines[i]];
                }
                break
            case "deduplicate":
                lines = [...new Set(lines)]
                break
            case "trim":
                lines = lines.map(l => l.trim()).filter(l => l.length > 0)
                break
            case "remove-empty":
                lines = lines.filter(l => l.trim().length > 0)
                break
        }

        setText(lines.join("\n"))
    }

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-140px)] min-h-[600px]">
            <Card className="flex-1 flex flex-col">
                <CardContent className="p-6 flex flex-col gap-6 flex-1">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex gap-2">
                            <Button onClick={() => process("sort")} variant="outline">
                                {reverse ? <ArrowUpAZ className="mr-2 h-4 w-4" /> : <ArrowDownAZ className="mr-2 h-4 w-4" />}
                                Sort {reverse ? "DESC" : "ASC"}
                            </Button>
                            <div className="flex items-center gap-2 border px-3 rounded-md">
                                <Label htmlFor="rev" className="text-sm font-normal cursor-pointer">Reversed</Label>
                                <Switch id="rev" checked={reverse} onCheckedChange={setReverse} />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button onClick={() => process("shuffle")} variant="outline">
                                <Shuffle className="mr-2 h-4 w-4" />
                                Shuffle
                            </Button>
                            <Button onClick={() => process("deduplicate")} variant="outline">
                                <Files className="mr-2 h-4 w-4" />
                                Deduplicate
                            </Button>
                            <Button onClick={() => process("remove-empty")} variant="outline">
                                <Filter className="mr-2 h-4 w-4" />
                                Remove Empty
                            </Button>
                            <Button onClick={() => process("trim")} variant="outline">
                                <X className="mr-2 h-4 w-4" />
                                Trim Lines
                            </Button>
                        </div>
                    </div>

                    <Textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Paste your list here..."
                        className="flex-1 font-mono text-base resize-none p-4"
                    />

                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Lines: {text ? text.split("\n").length : 0}</span>
                        <span>Characters: {text.length}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
