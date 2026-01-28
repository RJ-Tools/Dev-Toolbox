"use client"

import * as React from "react"
import { Copy, FileCode, Split } from "lucide-react"
import yaml from "yaml"
import Papa from "papaparse"
import { diffWords, Change } from "diff" // Using diff for highlight
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
// import { diffChars } from "diff"; // If needed

type FormatType = "json" | "yaml" | "xml" | "csv"

export function FormatterViewer() {
    const [input, setInput] = React.useState("")
    const [output, setOutput] = React.useState("")
    const [type, setType] = React.useState<FormatType>("json")
    const [error, setError] = React.useState<string | null>(null)

    // Diff View State
    const [showDiff, setShowDiff] = React.useState(false)
    const [diffChanges, setDiffChanges] = React.useState<Change[]>([])

    const handleFormat = async () => {
        setError(null)
        if (!input.trim()) {
            toast.error("Input is empty")
            return
        }

        try {
            let formatted = ""
            switch (type) {
                case "json":
                    const jsonObj = JSON.parse(input)
                    formatted = JSON.stringify(jsonObj, null, 2)
                    break
                case "yaml":
                    const yamlObj = yaml.parse(input)
                    formatted = yaml.stringify(yamlObj)
                    break
                case "xml":
                    const p = new DOMParser();
                    const xmlDoc = p.parseFromString(input, "text/xml");
                    const errorNode = xmlDoc.querySelector("parsererror");
                    if (errorNode) {
                        throw new Error("Invalid XML: " + errorNode.textContent);
                    }
                    formatted = formatXML(input)
                    break
                case "csv":
                    const csvData = Papa.parse(input, { header: true })
                    if (csvData.errors.length > 0) {
                        throw new Error(csvData.errors[0].message)
                    }
                    formatted = Papa.unparse(csvData.data, { quotes: true })
                    break
            }
            setOutput(formatted)
            setShowDiff(false) // Reset view on new format
            toast.success(`${type.toUpperCase()} formatted successfully`)
        } catch (err: any) {
            const msg = err.message || "Failed to format"
            setError(msg)
            setOutput("")
            toast.error(msg)
        }
    }

    const toggleDiff = () => {
        if (!output) return
        if (!showDiff) {
            // Calculate diff
            // Use diffWords to show what changed
            const changes = diffWords(input, output)
            setDiffChanges(changes)
        }
        setShowDiff(!showDiff)
    }

    const formatXML = (xml: string) => {
        let formatted = '';
        let reg = /(>)(<)(\/*)/g;
        xml = xml.replace(reg, '$1\r\n$2$3');
        let pad = 0;
        xml.split('\r\n').forEach((node) => {
            let indent = 0;
            if (node.match(/.+<\/\w[^>]*>$/)) {
                indent = 0;
            } else if (node.match(/^<\/\w/)) {
                if (pad != 0) {
                    pad -= 1;
                }
            } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
                indent = 1;
            } else {
                indent = 0;
            }

            let padding = '';
            for (let i = 0; i < pad; i++) {
                padding += '  ';
            }

            formatted += padding + node + '\r\n';
            pad += indent;
        });

        return formatted;
    }

    const handleCopy = () => {
        if (output) {
            navigator.clipboard.writeText(output)
            toast.success("Copied to clipboard")
        }
    }

    return (
        <div className="flex flex-col gap-4 h-[calc(100vh-140px)] min-h-[500px]">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Formatter</h2>
                <div className="flex items-center gap-2">
                    <Select value={type} onValueChange={(v) => { setType(v as FormatType); setShowDiff(false); }}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="yaml">YAML</SelectItem>
                            <SelectItem value="xml">XML</SelectItem>
                            <SelectItem value="csv">CSV</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button onClick={handleFormat}>
                        <FileCode className="mr-2 h-4 w-4" />
                        Format
                    </Button>

                    {output && (
                        <Button variant={showDiff ? "secondary" : "outline"} onClick={toggleDiff}>
                            <Split className="mr-2 h-4 w-4" />
                            {showDiff ? "Hide Diff" : "Show Diff"}
                        </Button>
                    )}

                    <Button variant="outline" onClick={() => { setInput(""); setOutput(""); setError(null); setShowDiff(false); }}>
                        Clear
                    </Button>
                </div>
            </div>

            <div className="grid h-full gap-4 md:grid-cols-2 pb-4">
                <div className="flex flex-col gap-2 h-full">
                    <Label htmlFor="input">Input</Label>
                    <Textarea
                        id="input"
                        placeholder={`Paste ${type.toUpperCase()} here...`}
                        className="flex-1 resize-none font-mono text-sm h-full"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-2 h-full">
                    <Label htmlFor="output">Output {showDiff ? "(Diff View)" : ""}</Label>
                    <div className="relative flex-1 h-full min-h-0">
                        {showDiff ? (
                            <div className="h-full border rounded-md p-4 overflow-auto bg-muted/30 font-mono text-sm whitespace-pre-wrap break-all">
                                {diffChanges.map((part, index) => {
                                    const color = part.added
                                        ? "bg-green-500/20 text-green-700 dark:text-green-300"
                                        : part.removed
                                            ? "bg-red-500/20 text-red-700 dark:text-red-300 decoration-line-through"
                                            : "opacity-70"
                                    return <span key={index} className={color}>{part.value}</span>
                                })}
                            </div>
                        ) : (
                            <Textarea
                                id="output"
                                placeholder="Formatted output will appear here..."
                                className={cn("h-full resize-none font-mono text-sm", error && "border-red-500")}
                                value={error ? error : output}
                                readOnly
                            />
                        )}
                        {output && !error && !showDiff && (
                            <Button
                                size="icon"
                                variant="ghost"
                                className="absolute top-2 right-2"
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
