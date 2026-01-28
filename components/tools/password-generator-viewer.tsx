"use client"

import * as React from "react"
import { Copy, RefreshCw, ShieldCheck, ShieldAlert, Shield } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const CHARSETS = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?"
}

export function PasswordGeneratorViewer() {
    const [length, setLength] = React.useState([16])
    const [useUppercase, setUseUppercase] = React.useState(true)
    const [useLowercase, setUseLowercase] = React.useState(true)
    const [useNumbers, setUseNumbers] = React.useState(true)
    const [useSymbols, setUseSymbols] = React.useState(true)
    const [avoidAmbiguous, setAvoidAmbiguous] = React.useState(true) // No 1, l, I, 0, O
    const [password, setPassword] = React.useState("")
    const [entropy, setEntropy] = React.useState(0)

    const calculateEntropy = (len: number, poolSize: number) => {
        return Math.floor(len * Math.log2(poolSize))
    }

    const generate = React.useCallback(() => {
        let chars = ""
        if (useUppercase) chars += CHARSETS.uppercase
        if (useLowercase) chars += CHARSETS.lowercase
        if (useNumbers) chars += CHARSETS.numbers
        if (useSymbols) chars += CHARSETS.symbols

        if (avoidAmbiguous) {
            chars = chars.replace(/[1lI0O]/g, "")
        }

        if (!chars) {
            setPassword("")
            setEntropy(0)
            return
        }

        let result = ""
        const len = length[0]
        const randomValues = new Uint32Array(len)
        crypto.getRandomValues(randomValues)

        for (let i = 0; i < len; i++) {
            result += chars[randomValues[i] % chars.length]
        }

        setPassword(result)
        setEntropy(calculateEntropy(len, chars.length))
    }, [length, useUppercase, useLowercase, useNumbers, useSymbols, avoidAmbiguous])

    React.useEffect(() => {
        generate()
    }, [generate])

    const copyToClipboard = () => {
        if (!password) return
        navigator.clipboard.writeText(password)
        toast.success("Copied to clipboard")
    }

    const getStrengthColor = (bits: number) => {
        if (bits < 50) return "text-red-500"
        if (bits < 80) return "text-yellow-500"
        if (bits < 120) return "text-green-500"
        return "text-emerald-500"
    }

    const getStrengthLabel = (bits: number) => {
        if (bits < 50) return "Very Weak"
        if (bits < 80) return "Weak"
        if (bits < 120) return "Strong"
        return "Very Strong"
    }

    return (
        <div className="flex flex-col gap-6 max-w-2xl mx-auto">
            <Card>
                <CardContent className="p-8 flex flex-col gap-8">
                    {/* Display */}
                    <div className="relative">
                        <div className="h-20 bg-muted/30 rounded-lg flex items-center justify-center relative border group">
                            <span className="font-mono text-3xl break-all px-12 text-center">
                                {password || "Select options"}
                            </span>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={copyToClipboard}
                            >
                                <Copy className="h-5 w-5" />
                            </Button>
                        </div>
                        <div className="absolute -bottom-6 left-0 right-0 flex justify-center">
                            <div className={cn("text-sm font-medium flex items-center gap-2 px-3 py-1 rounded-full bg-background border shadow-sm", getStrengthColor(entropy))}>
                                {entropy > 120 ? <ShieldCheck className="w-4 h-4" /> : entropy > 50 ? <Shield className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                                {getStrengthLabel(entropy)} ({entropy} bits)
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 mt-4">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Length: {length[0]}</Label>
                            </div>
                            <Slider
                                value={length}
                                onValueChange={setLength}
                                min={4}
                                max={64}
                                step={1}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center justify-between space-x-2 border p-3 rounded-md">
                                <Label htmlFor="uppercase" className="cursor-pointer flex-1">Uppercase (A-Z)</Label>
                                <Switch id="uppercase" checked={useUppercase} onCheckedChange={setUseUppercase} />
                            </div>
                            <div className="flex items-center justify-between space-x-2 border p-3 rounded-md">
                                <Label htmlFor="lowercase" className="cursor-pointer flex-1">Lowercase (a-z)</Label>
                                <Switch id="lowercase" checked={useLowercase} onCheckedChange={setUseLowercase} />
                            </div>
                            <div className="flex items-center justify-between space-x-2 border p-3 rounded-md">
                                <Label htmlFor="numbers" className="cursor-pointer flex-1">Numbers (0-9)</Label>
                                <Switch id="numbers" checked={useNumbers} onCheckedChange={setUseNumbers} />
                            </div>
                            <div className="flex items-center justify-between space-x-2 border p-3 rounded-md">
                                <Label htmlFor="symbols" className="cursor-pointer flex-1">Symbols (!@#)</Label>
                                <Switch id="symbols" checked={useSymbols} onCheckedChange={setUseSymbols} />
                            </div>
                            <div className="col-span-2 flex items-center justify-between space-x-2 border p-3 rounded-md">
                                <Label htmlFor="ambiguous" className="cursor-pointer flex-1">Avoid Ambiguous Characters (1, l, I, 0, O)</Label>
                                <Switch id="ambiguous" checked={avoidAmbiguous} onCheckedChange={setAvoidAmbiguous} />
                            </div>
                        </div>

                        <Button onClick={generate} size="lg" className="w-full">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Generate New Password
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
