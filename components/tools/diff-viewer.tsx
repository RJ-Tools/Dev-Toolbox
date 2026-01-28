"use client"

import * as React from "react"
import { diffChars, diffWords, Change } from "diff"
import { Copy, Split, RotateCcw, Check, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function DiffViewer() {
    const [original, setOriginal] = React.useState("")
    const [modified, setModified] = React.useState("")
    const [diffs, setDiffs] = React.useState<Change[]>([])
    const [showDiff, setShowDiff] = React.useState(false)
    const [diffMode, setDiffMode] = React.useState<"chars" | "words">("words")

    const handleCompare = () => {
        if (!original && !modified) {
            toast.error("Please enter text to compare")
            return
        }

        let changes: Change[] = []
        if (diffMode === "chars") {
            changes = diffChars(original, modified)
        } else {
            changes = diffWords(original, modified)
        }

        setDiffs(changes)
        setShowDiff(true)
        toast.success("Comparison complete")
    }

    const handleReset = () => {
        setOriginal("")
        setModified("")
        setShowDiff(false)
        setDiffs([])
        toast.info("Cleared all fields")
    }

    return (
        <div className="flex flex-col gap-4 h-[calc(100vh-140px)] min-h-[500px]">
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold">Difference Checker</h2>
                <div className="flex gap-2 items-center">
                    <Select value={diffMode} onValueChange={(v: "chars" | "words") => setDiffMode(v)}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Diff Mode" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="words">Words</SelectItem>
                            <SelectItem value="chars">Characters</SelectItem>
                        </SelectContent>
                    </Select>

                    {!showDiff ? (
                        <Button onClick={handleCompare} disabled={!original && !modified}>
                            <Split className="mr-2 h-4 w-4" />
                            Compare
                        </Button>
                    ) : (
                        <Button variant="secondary" onClick={() => setShowDiff(false)}>
                            Edit
                        </Button>
                    )}
                    <Button variant="outline" onClick={handleReset}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset
                    </Button>
                </div>
            </div>

            {!showDiff ? (
                <div className="grid h-full gap-4 md:grid-cols-2 pb-4">
                    <div className="flex flex-col gap-2 h-full">
                        <Label htmlFor="original">Original Text</Label>
                        <Textarea
                            id="original"
                            placeholder="Paste original text here..."
                            className="flex-1 resize-none font-mono text-sm h-full"
                            value={original}
                            onChange={(e) => setOriginal(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2 h-full">
                        <Label htmlFor="modified">Modified Text</Label>
                        <Textarea
                            id="modified"
                            placeholder="Paste modified text here..."
                            className="flex-1 resize-none font-mono text-sm h-full"
                            value={modified}
                            onChange={(e) => setModified(e.target.value)}
                        />
                    </div>
                </div>
            ) : (
                <Card className="h-full flex-1 overflow-hidden mb-4">
                    <CardContent className="h-full p-4 overflow-auto">
                        <div className="font-mono text-sm whitespace-pre-wrap break-all">
                            {diffs.map((part, index) => {
                                const color = part.added
                                    ? "bg-green-500/20 text-green-700 dark:text-green-300"
                                    : part.removed
                                        ? "bg-red-500/20 text-red-700 dark:text-red-300 decoration-line-through"
                                        : "text-foreground opacity-70"

                                return (
                                    <span
                                        key={index}
                                        className={cn(color)}
                                    >
                                        {part.value}
                                    </span>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
