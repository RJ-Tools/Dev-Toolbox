"use client"

import * as React from "react"
import { CheckCircle, XCircle, Wrench, AlertTriangle } from "lucide-react"
import yaml from "yaml"
import Papa from "papaparse"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type FormatType = "json" | "yaml" | "xml" | "csv"

export function ValidatorViewer() {
    const [input, setInput] = React.useState("")
    const [type, setType] = React.useState<FormatType>("json")
    const [status, setStatus] = React.useState<"idle" | "valid" | "invalid">("idle")
    const [message, setMessage] = React.useState("")

    const validate = (text: string = input) => {
        if (!text.trim()) {
            setStatus("idle")
            setMessage("")
            return
        }

        try {
            switch (type) {
                case "json":
                    JSON.parse(text)
                    break
                case "yaml":
                    yaml.parse(text)
                    break
                case "xml":
                    const p = new DOMParser()
                    const xmlDoc = p.parseFromString(text, "text/xml")
                    const errorNode = xmlDoc.querySelector("parsererror")
                    if (errorNode) throw new Error(errorNode.textContent || "Invalid XML")
                    break
                case "csv":
                    const csv = Papa.parse(text, { header: true })
                    if (csv.errors.length > 0) throw new Error(csv.errors[0].message + " at row " + (csv.errors[0].row || '?'))
                    break
            }
            setStatus("valid")
            setMessage(`Valid ${type.toUpperCase()}`)
            toast.success(`Valid ${type.toUpperCase()}`)
        } catch (err: any) {
            setStatus("invalid")
            setMessage(err.message)
            toast.error("Validation failed")
        }
    }

    // Auto-validate on input change? Maybe debounce.
    // Or manual. User asked for "Tool to check/validate".
    // Let's do manual "Validate" button + "Fix" button.

    const handleFix = () => {
        // Basic fix logic
        let fixed = input
        try {
            if (type === 'json') {
                // Attempt to fix common JSON errors (single quotes, trailing commas)
                // This is naive but works for some cases.
                // Replace single quotes ?? No, might be content.
                // Using new Function to parse loose JSON (DANGEROUS if not careful, but client side sandbox...)
                // Actually, we can assume developer tool usage.
                // But let's try a safer regex approach for common issues.
                // 1. Keys without quotes
                // 2. Trailing commas
                // Reference: https://github.com/josdejong/jsonrepair logic is complex.
                // check if we can fix simple trailing commas using regex
                fixed = fixed.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']')
                JSON.parse(fixed) // Check if valid now
                setInput(fixed)
                validate(fixed)
                toast.success("Auto-fixed JSON")
                return
            }
        } catch (e) {
            toast.error("Could not auto-fix")
        }
        // If we can't fix, we stay invalid.
        validate()
    }

    return (
        <div className="flex flex-col gap-4 h-[calc(100vh-140px)] min-h-[500px]">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Validator</h2>
                <div className="flex items-center gap-2">
                    <Select value={type} onValueChange={(v) => { setType(v as FormatType); setStatus("idle"); setMessage(""); }}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="yaml">YAML</SelectItem>
                            <SelectItem value="xml">XML</SelectItem>
                            <SelectItem value="csv">CSV</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={() => validate()}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Validate
                    </Button>
                    {status === 'invalid' && type === 'json' && (
                        <Button variant="secondary" onClick={handleFix}>
                            <Wrench className="mr-2 h-4 w-4" />
                            Auto Fix
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-2 h-full pb-4">
                <div className="flex-1 relative h-full">
                    <Textarea
                        placeholder={`Paste ${type.toUpperCase()} content here...`}
                        className={cn(
                            "h-full resize-none font-mono text-sm",
                            status === "invalid" && "border-red-500 focus-visible:ring-red-500",
                            status === "valid" && "border-green-500 focus-visible:ring-green-500"
                        )}
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value)
                            if (status !== 'idle') setStatus('idle')
                        }}
                    />
                </div>

                {status !== 'idle' && (
                    <Alert variant={status === 'valid' ? "default" : "destructive"} className={status === 'valid' ? "border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400" : ""}>
                        {status === 'valid' ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                        <AlertTitle>{status === 'valid' ? "Valid" : "Invalid"}</AlertTitle>
                        <AlertDescription>
                            {message}
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    )
}
