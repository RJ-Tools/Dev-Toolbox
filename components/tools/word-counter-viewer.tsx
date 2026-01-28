"use client"

import * as React from "react"
import { AlignLeft, Type, Clock, FileText } from "lucide-react"

import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function WordCounterViewer() {
    const [text, setText] = React.useState("")
    const [stats, setStats] = React.useState({
        words: 0,
        characters: 0,
        charactersNoSpace: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: 0
    })

    React.useEffect(() => {
        const words = text.trim() ? text.trim().split(/\s+/).length : 0
        const characters = text.length
        const charactersNoSpace = text.replace(/\s/g, "").length
        const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0
        const paragraphs = text.trim() ? text.split(/\n+/).filter(Boolean).length : 0
        const readingTime = Math.ceil(words / 200) // 200 wpm

        setStats({
            words,
            characters,
            charactersNoSpace,
            sentences,
            paragraphs,
            readingTime
        })
    }, [text])

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-140px)] min-h-[600px]">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <Card className="bg-muted/50">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-bold">{stats.words}</span>
                        <span className="text-xs text-muted-foreground uppercase font-medium flex items-center gap-1">
                            <AlignLeft className="w-3 h-3" /> Words
                        </span>
                    </CardContent>
                </Card>
                <Card className="bg-muted/50">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-bold">{stats.characters}</span>
                        <span className="text-xs text-muted-foreground uppercase font-medium flex items-center gap-1">
                            <Type className="w-3 h-3" /> Chars
                        </span>
                    </CardContent>
                </Card>
                <Card className="bg-muted/50 hidden md:flex">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-bold">{stats.charactersNoSpace}</span>
                        <span className="text-xs text-muted-foreground uppercase font-medium">
                            No Spaces
                        </span>
                    </CardContent>
                </Card>
                <Card className="bg-muted/50">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-bold">{stats.sentences}</span>
                        <span className="text-xs text-muted-foreground uppercase font-medium">
                            Sentences
                        </span>
                    </CardContent>
                </Card>
                <Card className="bg-muted/50">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-bold">{stats.paragraphs}</span>
                        <span className="text-xs text-muted-foreground uppercase font-medium flex items-center gap-1">
                            <FileText className="w-3 h-3" /> Paragraphs
                        </span>
                    </CardContent>
                </Card>
                <Card className="bg-muted/50">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-xl font-bold">~{stats.readingTime}m</span>
                        <span className="text-xs text-muted-foreground uppercase font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Read Time
                        </span>
                    </CardContent>
                </Card>
            </div>

            <Card className="flex-1 flex flex-col">
                <CardContent className="p-6 flex flex-col gap-6 flex-1">
                    <div className="flex justify-between items-center">
                        <Label>Content</Label>
                        <Button variant="ghost" size="sm" onClick={() => setText("")}>Clear Text</Button>
                    </div>
                    <Textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type or paste text here to analyze..."
                        className="flex-1 font-mono text-lg resize-none p-6 leading-relaxed"
                    />
                </CardContent>
            </Card>
        </div>
    )
}
