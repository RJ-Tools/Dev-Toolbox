"use client"

import * as React from "react"
import { ArrowRightLeft, Copy, RotateCcw, CheckCircle, FileCode } from "lucide-react"
import { toast } from "sonner"
import yaml from "yaml"
import convert from "xml-js"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CodeTextarea } from "@/components/ui/code-textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Format = "json" | "xml" | "yaml"

export interface ConverterViewerProps {
    defaultSource?: Format
    defaultTarget?: Format
    disableSourceSelect?: boolean
    disableTargetSelect?: boolean
}

export function ConverterViewer({
    defaultSource = "json",
    defaultTarget = "xml",
    disableSourceSelect = false,
    disableTargetSelect = false
}: ConverterViewerProps) {
    const [input, setInput] = React.useState("")
    const [output, setOutput] = React.useState("")
    const [sourceFormat, setSourceFormat] = React.useState<Format>(defaultSource)
    const [targetFormat, setTargetFormat] = React.useState<Format>(defaultTarget)
    const [isLoading, setIsLoading] = React.useState(false)

    const validateInput = (text: string, format: Format): any => {
        try {
            if (format === "json") {
                return JSON.parse(text)
            } else if (format === "yaml") {
                return yaml.parse(text)
            } else if (format === "xml") {
                // xml-js xml2js throws if invalid?
                // Let's rely on xml-js parsing.
                const result = convert.xml2js(text, { compact: true }) as any
                if (!result || Object.keys(result).length === 0) throw new Error("Invalid XML")
                return result
            }
        } catch (e) {
            throw new Error(`Invalid ${format.toUpperCase()} input`)
        }
    }

    const handleConvert = () => {
        if (!input.trim()) {
            toast.error("Please enter input text")
            return
        }

        setIsLoading(true)
        try {
            // 1. Validate and Parse to Intermediate Object (JSON Object)
            let intermediateObj: any
            try {
                if (sourceFormat === "json") {
                    intermediateObj = JSON.parse(input)
                } else if (sourceFormat === "yaml") {
                    intermediateObj = yaml.parse(input)
                } else if (sourceFormat === "xml") {
                    const rawObj = convert.xml2js(input, { compact: true, nativeType: true })
                    intermediateObj = flattenXmlOutput(rawObj)
                }
            } catch (e) {
                throw new Error(`Invalid ${sourceFormat.toUpperCase()} input`)
            }

            toast.success("Input Validated")

            // 2. Convert Intermediate Object to Target String
            let result = ""
            if (targetFormat === "json") {
                result = JSON.stringify(intermediateObj, null, 2)
            } else if (targetFormat === "yaml") {
                result = yaml.stringify(intermediateObj)
            } else if (targetFormat === "xml") {
                // If converting from pure JSON array to XML, it needs a root.
                // xml-js js2xml expects object.
                // If intermediate is not wrapped, we might might basic wrapping or let lib handle.
                result = convert.js2xml(intermediateObj, { compact: true, ignoreComment: true, spaces: 4 })
            }

            setOutput(result)
            toast.success(`Converted to ${targetFormat.toUpperCase()}`)

        } catch (e: any) {
            toast.error(e.message || "Conversion failed")
            setOutput("")
        } finally {
            setIsLoading(false)
        }
    }

    // Helper to remove _text validation issues from xml-js compact mode
    const flattenXmlOutput = (obj: any): any => {
        if (Array.isArray(obj)) {
            return obj.map(flattenXmlOutput)
        } else if (typeof obj === 'object' && obj !== null) {
            // Check if object has only _text property
            const keys = Object.keys(obj)
            if (keys.length === 1 && keys[0] === '_text') {
                return obj._text
            }
            // If it has _attributes and _text, we might want to keep it or flatten if possible.
            // For now, let's strictly handle the case user complained about: simple nodes.
            // If user has attributes, the structure is necessary.

            // Recursively process all properties
            const newObj: any = {}
            for (const key in obj) {
                newObj[key] = flattenXmlOutput(obj[key])
            }
            return newObj
        }
        return obj
    }

    const handleCopy = () => {
        if (!output) return
        navigator.clipboard.writeText(output)
        toast.success("Copied to clipboard")
    }

    const handleSwap = () => {
        setSourceFormat(targetFormat)
        setTargetFormat(sourceFormat)
        setInput(output)
        setOutput("") // Clear output or convert back immediately? Better clear to avoid confusion.
        toast.info("Swapped formats")
    }

    return (
        <div className="flex flex-col gap-4 h-[calc(100vh-140px)] min-h-[500px]">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <ArrowRightLeft className="w-5 h-5" />
                    Format Converter
                </h2>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => { setInput(""); setOutput(""); }}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Clear
                    </Button>
                </div>
            </div>

            <div className="grid h-full gap-4 md:grid-cols-2 pb-4">
                {/* Source Section */}
                <div className="flex flex-col gap-2 h-full">
                    <div className="flex items-center justify-between">
                        <Label>Source Format {disableSourceSelect ? `(${sourceFormat.toUpperCase()})` : ""}</Label>
                        {!disableSourceSelect && (
                            <Select value={sourceFormat} onValueChange={(v) => setSourceFormat(v as Format)}>
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="json">JSON</SelectItem>
                                    <SelectItem value="xml">XML</SelectItem>
                                    <SelectItem value="yaml">YAML</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                    <CodeTextarea
                        placeholder={`Paste ${sourceFormat.toUpperCase()} here...`}
                        className="h-full"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>

                {/* Target Section */}
                <div className="flex flex-col gap-2 h-full">
                    <div className="flex items-center justify-between">
                        <Label>Target Format {disableTargetSelect ? `(${targetFormat.toUpperCase()})` : ""}</Label>
                        <div className="flex items-center gap-2">
                            {!disableSourceSelect && !disableTargetSelect && (
                                <Button variant="ghost" size="icon" onClick={handleSwap} title="Swap input/output">
                                    <ArrowRightLeft className="h-4 w-4" />
                                </Button>
                            )}
                            {!disableTargetSelect && (
                                <Select value={targetFormat} onValueChange={(v) => setTargetFormat(v as Format)}>
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="json">JSON</SelectItem>
                                        <SelectItem value="xml">XML</SelectItem>
                                        <SelectItem value="yaml">YAML</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                            <Button onClick={handleConvert} disabled={isLoading}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Convert
                            </Button>
                        </div>
                    </div>
                    <div className="relative flex-1 h-full min-h-0">
                        <CodeTextarea
                            readOnly
                            placeholder="Converted output..."
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
