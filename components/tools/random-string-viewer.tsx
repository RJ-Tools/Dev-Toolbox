"use client"

import * as React from "react"
import { Copy, RefreshCw, Settings2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"

const CHARSETS = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-="
}

export function RandomStringViewer() {
    const [length, setLength] = React.useState([32])
    const [count, setCount] = React.useState([1])
    const [useUppercase, setUseUppercase] = React.useState(true)
    const [useLowercase, setUseLowercase] = React.useState(true)
    const [useNumbers, setUseNumbers] = React.useState(true)
    const [useSymbols, setUseSymbols] = React.useState(false)
    const [customChars, setCustomChars] = React.useState("")
    const [excludeChars, setExcludeChars] = React.useState("")
    const [generated, setGenerated] = React.useState("")

    const generate = React.useCallback(() => {
        let chars = ""
        if (useUppercase) chars += CHARSETS.uppercase
        if (useLowercase) chars += CHARSETS.lowercase
        if (useNumbers) chars += CHARSETS.numbers
        if (useSymbols) chars += CHARSETS.symbols
        if (customChars) chars += customChars

        if (excludeChars) {
            chars = chars.split("").filter(c => !excludeChars.includes(c)).join("")
        }

        // Fallback if no characters selected
        if (!chars) {
            setGenerated("Please select at least one character set")
            return
        }

        const results = []
        for (let c = 0; c < count[0]; c++) {
            let result = ""
            const randomValues = new Uint32Array(length[0])
            crypto.getRandomValues(randomValues)

            for (let i = 0; i < length[0]; i++) {
                result += chars[randomValues[i] % chars.length]
            }
            results.push(result)
        }

        setGenerated(results.join("\n"))
    }, [length, count, useUppercase, useLowercase, useNumbers, useSymbols, customChars, excludeChars])

    React.useEffect(() => {
        generate()
    }, [generate])

    const copyToClipboard = () => {
        if (!generated || generated.startsWith("Please")) return
        navigator.clipboard.writeText(generated)
        toast.success("Copied to clipboard")
    }

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardContent className="p-6 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            {/* Length Control */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>Length</Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={256}
                                        value={length[0]}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value)
                                            if (!isNaN(val)) setLength([Math.min(Math.max(val, 1), 256)])
                                        }}
                                        className="w-20 h-8 font-mono text-center"
                                    />
                                </div>
                                <Slider
                                    value={length}
                                    onValueChange={setLength}
                                    min={1}
                                    max={128}
                                    step={1}
                                />
                            </div>

                            {/* Quantity Control */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>Count</Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={100}
                                        value={count[0]}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value)
                                            if (!isNaN(val)) setCount([Math.min(Math.max(val, 1), 100)])
                                        }}
                                        className="w-20 h-8 font-mono text-center"
                                    />
                                </div>
                                <Slider
                                    value={count}
                                    onValueChange={setCount}
                                    min={1}
                                    max={50}
                                    step={1}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center justify-between space-x-2 border p-3 rounded-md">
                                    <Label htmlFor="uppercase" className="cursor-pointer flex-1">A-Z</Label>
                                    <Switch id="uppercase" checked={useUppercase} onCheckedChange={setUseUppercase} />
                                </div>
                                <div className="flex items-center justify-between space-x-2 border p-3 rounded-md">
                                    <Label htmlFor="lowercase" className="cursor-pointer flex-1">a-z</Label>
                                    <Switch id="lowercase" checked={useLowercase} onCheckedChange={setUseLowercase} />
                                </div>
                                <div className="flex items-center justify-between space-x-2 border p-3 rounded-md">
                                    <Label htmlFor="numbers" className="cursor-pointer flex-1">0-9</Label>
                                    <Switch id="numbers" checked={useNumbers} onCheckedChange={setUseNumbers} />
                                </div>
                                <div className="flex items-center justify-between space-x-2 border p-3 rounded-md">
                                    <Label htmlFor="symbols" className="cursor-pointer flex-1">!@#</Label>
                                    <Switch id="symbols" checked={useSymbols} onCheckedChange={setUseSymbols} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Include Custom Characters</Label>
                                    <Input
                                        value={customChars}
                                        onChange={(e) => setCustomChars(e.target.value)}
                                        placeholder="e.g. abc"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Exclude Characters</Label>
                                    <Input
                                        value={excludeChars}
                                        onChange={(e) => setExcludeChars(e.target.value)}
                                        placeholder="e.g. 1lI0O"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 flex flex-col h-full">
                            <Label>Generated Strings</Label>
                            <div className="relative flex-1 min-h-[300px]">
                                <Textarea
                                    className="font-mono h-full resize-none p-4 text-sm"
                                    value={generated}
                                    readOnly
                                />
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="absolute top-2 right-2 h-8 w-8 bg-background/80 backdrop-blur-sm"
                                    onClick={copyToClipboard}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            <Button onClick={generate} size="lg" className="w-full">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Regenerate
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
