"use client"

import * as React from "react"
import { Copy, ArrowRightLeft, Eraser } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TextCaseViewer() {
    const [text, setText] = React.useState("")

    const convert = (type: string) => {
        if (!text) return ""

        const words = text.split(/[\s-_]+/).filter(w => w.length > 0)

        switch (type) {
            case "uppercase":
                return text.toUpperCase()
            case "lowercase":
                return text.toLowerCase()
            case "title":
                return text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
            case "camel":
                return words.map((w, i) =>
                    i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
                ).join("")
            case "pascal":
                return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("")
            case "snake":
                return words.join("_").toLowerCase()
            case "kebab":
                return words.join("-").toLowerCase()
            case "constant":
                return words.join("_").toUpperCase()
            case "sentence":
                return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase())
            case "alternating":
                return text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('')
            case "inverse":
                return text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('')
            default:
                return text
        }
    }

    const CaseButton = ({ label, type }: { label: string, type: string }) => (
        <Button
            variant="outline"
            className="justify-start h-auto py-3 px-4 flex flex-col items-start gap-1"
            onClick={() => setText(convert(type))}
        >
            <span className="font-semibold">{label}</span>
            <span className="text-xs text-muted-foreground truncate w-full text-left opacity-70">
                {convert(type).slice(0, 20) || "example"}
            </span>
        </Button>
    )

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-140px)] min-h-[600px]">
            <Card className="flex-1 flex flex-col">
                <CardContent className="p-6 flex flex-col gap-6 flex-1">
                    <div className="flex items-center justify-between">
                        <Label>Enter Text</Label>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setText("")}>
                                <Eraser className="w-4 h-4 mr-2" />
                                Clear
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(text)}>
                                <Copy className="w-4 h-4 mr-2" />
                                Copy
                            </Button>
                        </div>
                    </div>

                    <Textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type or paste your text here..."
                        className="flex-1 font-mono text-lg resize-none p-4"
                    />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <CaseButton label="UPPERCASE" type="uppercase" />
                        <CaseButton label="lowercase" type="lowercase" />
                        <CaseButton label="Title Case" type="title" />
                        <CaseButton label="Sentence case" type="sentence" />
                        <CaseButton label="camelCase" type="camel" />
                        <CaseButton label="PascalCase" type="pascal" />
                        <CaseButton label="snake_case" type="snake" />
                        <CaseButton label="kebab-case" type="kebab" />
                        <CaseButton label="CONSTANT_CASE" type="constant" />
                        <CaseButton label="aLtErNaTiNg" type="alternating" />
                        <CaseButton label="InVeRsE CaSe" type="inverse" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
